import { useEffect } from "react";
import { useDispatch } from "react-redux";
import "./App.css";
import AppRouter from "@routes";

import chatSocket from "@utils/chat/chatSocket";

import userSelectors from "@store/selectors/userSelectors";
import { listUserActions } from "@store/slices/userSlices";

function App() {
  const dispatch = useDispatch();
  const userProfile = userSelectors.selectUserProfile();

  useEffect(() => {
    chatSocket.on("connect", () => {
      console.log("Connected:", chatSocket.id);
    });
    chatSocket.on("disconnect", () => {
      console.log("Disconnected");
    });

    return () => {
      chatSocket.off("connect");
      chatSocket.off("disconnect");
    };
  }, []);

  useEffect(() => {
    if (!!userProfile) {
      dispatch(listUserActions.getUserProfileRequest());
    }
  }, [dispatch, userProfile]);

  return <AppRouter />;
}

export default App;
