import { useEffect } from "react";
import { useDispatch } from "react-redux";
import "./App.css";
import AppRouter from "@routes";

import userSelectors from "@store/selectors/userSelectors";
import { listUserActions } from "@store/slices/userSlices";

function App() {
  const dispatch = useDispatch();
  const userProfile = userSelectors.selectUserProfile();

  useEffect(() => {
    if (!!userProfile) {
      dispatch(listUserActions.getUserProfileRequest());
    }
  }, [dispatch, userProfile]);

  return <AppRouter />;
}

export default App;
