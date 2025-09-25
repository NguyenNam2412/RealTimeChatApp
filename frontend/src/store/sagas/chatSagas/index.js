import { eventChannel } from "redux-saga";
import { call, put, takeEvery, take, fork, select } from "redux-saga/effects";
import chatSocket from "@utils/chat/chatSocket";
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
    const msg = yield take(channel); // raw msg from server
    // determine current user id (try state then token)
    let currentUserId = null;
    try {
      const state = yield select();
      // adjust according to your auth slice shape if available
      currentUserId =
        state.auth?.session?.user?.id || state.auth?.session?.sub || null;
    } catch {}
    if (!currentUserId) {
      currentUserId = decodeTokenUserId();
    }

    // normalize message shape for FE
    const transformed = {
      id: msg.id ?? `srv-${Date.now()}`,
      content: msg.content ?? msg.text ?? "",
      sender:
        msg.sender?.username ??
        (typeof msg.sender === "string" ? msg.sender : null),
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
    };

    yield put(chatActions.receiveMessage(transformed));
  }
}

function* handleSendMessage(action) {
  try {
    const msg = action.payload;
    // optimistic local message
    const tempId = `tmp-${Date.now()}`;
    const token = localStorage.getItem("token");
    let meUser = null;
    try {
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        meUser = payload.username || null;
      }
    } catch {}

    const optimistic = {
      id: tempId,
      content: msg.content,
      sender: meUser,
      nickname: null,
      me: true,
      createdAt: new Date().toISOString(),
      groupId: msg.groupId ?? null,
      receiverId: msg.receiverId ?? null,
    };

    // emit correct event
    if (msg.groupId) {
      chatSocket.emit("group_message", {
        groupId: msg.groupId,
        content: msg.content,
      });
    } else if (msg.receiverId) {
      chatSocket.emit("private_message", {
        to: msg.receiverId,
        content: msg.content,
      });
    } else {
      throw new Error("Must provide groupId or receiverId");
    }

    // update local state optimistically
    yield put(chatActions.sendMessageSuccess(optimistic));
  } catch (err) {
    yield put(chatActions.sendMessageFailure(err.message));
  }
}

export default function* messageSaga() {
  yield fork(listenMessages);
  yield takeEvery(chatActions.sendMessageRequest, handleSendMessage);
}
