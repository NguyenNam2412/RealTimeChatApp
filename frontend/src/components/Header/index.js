import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "@store/slices/authSlice";

function Header(props) {
  const { userInfo } = props;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.clear();
    dispatch(authActions.logout());
    navigate("/login");
  };

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        backgroundColor: "#1976d2",
        color: "#fff",
      }}
    >
      <div>{userInfo}</div>
      <button
        style={{
          backgroundColor: "#fff",
          color: "#1976d2",
          border: "none",
          padding: "6px 12px",
          cursor: "pointer",
          borderRadius: "4px",
          fontWeight: "bold",
        }}
        onClick={handleLogout}
      >
        Logout
      </button>
    </header>
  );
}

export default Header;
