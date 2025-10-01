import { eventChannel } from "redux-saga";
import { call, put, take, fork, takeEvery, select } from "redux-saga/effects";
import chatSocket from "@utils/chat/chatSocket";
import { chatActions } from "@store/slices/chatSlices";
import { listUserActions } from "@store/slices/userSlices";
import { sendMessApi, getUserMessApi, getGroupMessApi } from "@api/chatApi";

// create an eventChannel from socket.io
function createSocketChannel(socket) {
  return eventChannel((emit) => {
    const onConnect = () => {
      emit({ type: "SOCKET_CONNECT" });
    };
    const onDisconnect = (reason) => {
      emit({ type: "SOCKET_DISCONNECT", reason });
    };
    const onNewPrivate = (payload) => {
      emit({ type: "NEW_PRIVATE_MESSAGE", payload });
    };
    const onNewGroup = (payload) => {
      emit({ type: "NEW_GROUP_MESSAGE", payload });
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("new_private_message", onNewPrivate);
    socket.on("new_group_message", onNewGroup);

    // unsubscribe function
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("new_private_message", onNewPrivate);
      socket.off("new_group_message", onNewGroup);
    };
  });
}

// transform server payload to local message shape and mark me flag
function* transformAndTagMessage(serverMsg) {
  const state = yield select();
  const currentUserId =
    state.auth?.session?.userId ?? state.auth?.session?.sub ?? null;
  const msg = {
    ...serverMsg,
    // normalize sender plain object to senderObj for frontend usage
    senderObj: serverMsg.sender ?? null,
    sender: serverMsg.sender?.id ?? serverMsg.sender ?? null,
    receiver: serverMsg.receiver?.id ?? serverMsg.receiver ?? null,
    groupId: serverMsg.group?.id ?? serverMsg.groupId ?? null,
    me: !!(
      serverMsg.sender?.id &&
      currentUserId &&
      serverMsg.sender.id === currentUserId
    ),
  };
  return msg;
}

function* listenMessages() {
  const socket = chatSocket;
  const channel = yield call(createSocketChannel, socket);

  try {
    while (true) {
      const ev = yield take(channel);
      if (!ev) continue;

      switch (ev.type) {
        case "SOCKET_CONNECT":
          // optional: debug
          // console.info("chat socket connected");
          break;
        case "SOCKET_DISCONNECT":
          // console.info("chat socket disconnected", ev.reason);
          break;
        case "NEW_PRIVATE_MESSAGE": {
          const msg = yield call(transformAndTagMessage, ev.payload);
          // put into store so UI updates immediately
          yield put(chatActions.receiveMessage(msg));
          // refresh conversations so Sidebar updates (optional but helpful)
          yield put(listUserActions.getUserConversationsRequest());
          break;
        }
        case "NEW_GROUP_MESSAGE": {
          const msg = yield call(transformAndTagMessage, ev.payload);
          yield put(chatActions.receiveMessage(msg));
          break;
        }
        default:
          break;
      }
    }
  } finally {
    channel.close();
  }
}

function* handleSendMessage(action) {
  try {
    const payload = action.payload; // { content, groupId?, receiverId? }
    // create optimistic temp message
    const state = yield select();
    let currentUserId =
      state.auth?.session?.userId ?? state.auth?.session?.sub ?? null;
    if (!currentUserId) {
      try {
        const token =
          localStorage.getItem("access_token") || localStorage.getItem("token");
        if (token) currentUserId = JSON.parse(atob(token.split(".")[1])).sub;
      } catch {}
    }
    const tempId = `tmp-${Date.now()}`;
    const optimistic = {
      id: tempId,
      content: payload.content,
      sender: { id: currentUserId },
      senderObj: { id: currentUserId },
      me: true,
      createdAt: new Date().toISOString(),
      groupId: payload.groupId ?? null,
      receiverId: payload.receiverId ?? null,
      _optimistic: true,
    };
    // immediately add to store so UI shows it
    yield put(chatActions.receiveMessage(optimistic));

    // persist to backend
    const response = yield call(sendMessApi, payload);
    const saved = response.data ?? response;

    // replace temp with saved
    yield put(chatActions.updateMessageId({ tempId, saved }));
    yield put(chatActions.sendMessageSuccess(saved));
  } catch (err) {
    // remove optimistic on failure (optional) or mark failed (not implemented)
    // here just set failure
    yield put(chatActions.sendMessageFailure(err.message || String(err)));
  }
}

function* fetchUserMessagesSaga(action) {
  try {
    // payload supports either id or { id, limit, offset }
    const raw = action.payload;
    let userId, limit, offset;
    if (typeof raw === "object" && raw !== null && raw.id) {
      userId = raw.id;
      limit = raw.limit ?? 20;
      offset = raw.offset ?? 0;
    } else {
      userId = raw;
      limit = 20;
      offset = 0;
    }
    const res = yield call(getUserMessApi, userId, { limit, offset });
    // normalize: get data array
    const data = res.data ?? res;
    // ensure newest at end and limit to last `limit` if server returned more
    const arr = Array.isArray(data) ? data : data?.messages ?? [];
    yield put(
      chatActions.fetchUserMessagesSuccess({ userId, messages: arr, offset })
    );
  } catch (error) {
    yield put(chatActions.fetchUserMessagesFailure(error.message));
  }
}

// worker saga: group messages
function* fetchGroupMessagesSaga(action) {
  try {
    const raw = action.payload;
    let groupId, limit, offset;
    if (typeof raw === "object" && raw !== null && raw.id) {
      groupId = raw.id;
      limit = raw.limit ?? 20;
      offset = raw.offset ?? 0;
    } else {
      groupId = raw;
      limit = 20;
      offset = 0;
    }
    const res = yield call(getGroupMessApi, groupId, { limit, offset });
    const data = res.data ?? res;
    const arr = Array.isArray(data) ? data : data?.messages ?? [];
    yield put(
      chatActions.fetchGroupMessagesSuccess({ groupId, messages: arr, offset })
    );
  } catch (error) {
    yield put(chatActions.fetchGroupMessagesFailure(error.message));
  }
}

export default function* messageSaga() {
  yield fork(listenMessages);
  yield takeEvery(chatActions.sendMessageRequest.type, handleSendMessage);
  yield takeEvery(
    chatActions.fetchUserMessagesRequest.type,
    fetchUserMessagesSaga
  );
  yield takeEvery(
    chatActions.fetchGroupMessagesRequest.type,
    fetchGroupMessagesSaga
  );
}
