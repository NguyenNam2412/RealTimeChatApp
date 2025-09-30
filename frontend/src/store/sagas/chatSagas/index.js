import { eventChannel } from "redux-saga";
import { call, put, takeEvery, take, fork, select } from "redux-saga/effects";
import chatSocket from "@utils/chat/chatSocket";
import { sendMessApi, getGroupMessApi, getUserMessApi } from "@api/chatApi";
import { chatActions } from "@store/slices/chatSlices";

// Tạo channel để nghe socket event
function createSocketChannel(socket) {
  return eventChannel((emit) => {
    const handlerPrivate = (msg) => {
      emit(msg);
    };
    const handlerGroup = (msg) => {
      emit(msg);
    };

    socket.on("new_private_message", handlerPrivate);
    socket.on("new_group_message", handlerGroup);

    return () => {
      socket.off("new_private_message", handlerPrivate);
      socket.off("new_group_message", handlerGroup);
    };
  });
}

function decodeTokenUserId() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub || payload.id || null;
  } catch {
    return null;
  }
}

function* listenMessages() {
  const channel = yield call(createSocketChannel, chatSocket);
  while (true) {
    const payload = yield take(channel); // { event, msg }
    const msg = payload?.msg ?? payload;
    // normalize
    const state = yield select();
    let currentUserId =
      state.auth?.session?.user?.id || state.auth?.session?.sub || null;
    if (!currentUserId) {
      try {
        const token =
          localStorage.getItem("access_token") || localStorage.getItem("token");
        if (token) currentUserId = JSON.parse(atob(token.split(".")[1])).sub;
      } catch {}
    }

    const transformed = {
      id: msg.id ?? `srv-${Date.now()}`,
      content: msg.content ?? msg.text ?? "",
      sender: msg.sender ?? msg.senderId ?? null,
      senderObj: msg.sender ?? null,
      nickname: msg.sender?.nickname ?? null,
      me: !!(
        msg.sender?.id &&
        currentUserId &&
        msg.sender.id === currentUserId
      ),
      createdAt: msg.createdAt ?? new Date().toISOString(),
      groupId: msg.group?.id ?? msg.groupId ?? null,
      receiverId: msg.receiver?.id ?? msg.receiverId ?? null,
      raw: msg,
      _socketEvent: payload?.event ?? null,
    };

    // dispatch to global store
    yield put(chatActions.receiveMessage(transformed));
  }
}

function* handleSendMessage(action) {
  try {
    const payload = action.payload; // { content, groupId?, receiverId? }

    const response = yield call(sendMessApi, payload);
    const saved = response.data ?? response;

    yield put(chatActions.sendMessageSuccess(saved));
  } catch (err) {
    yield put(chatActions.sendMessageFailure(err.message || String(err)));
  }
}

function* fetchUserMessagesSaga(action) {
  try {
    const userId = action.payload;
    const res = yield call(getUserMessApi, userId);
    yield put(
      chatActions.fetchUserMessagesSuccess({
        userId,
        messages: res.data,
      })
    );
  } catch (error) {
    yield put(chatActions.fetchUserMessagesFailure(error.message));
  }
}

// worker saga: group messages
function* fetchGroupMessagesSaga(action) {
  try {
    const groupId = action.payload;
    const res = yield call(getGroupMessApi, groupId);
    yield put(
      chatActions.fetchGroupMessagesSuccess({
        groupId,
        messages: res.data,
      })
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
