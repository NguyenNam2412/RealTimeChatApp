import { Outlet } from "react-router-dom";
import Header from "@components/Header";
import Navbar from "@components/Navbar";

import { HideScrollBarContainer } from "@styles/common/hideScrollBarContainer.styled";

function AdminSide() {
  const username = localStorage.getItem("username");

  return (
    <HideScrollBarContainer>
      <div
        style={{ height: "100vh", display: "flex", flexDirection: "column" }}
      >
        <Header userInfo={`Hello ${username}`} />

        <Navbar />

        <div style={{ flex: 1, padding: "20px" }}>
          <Outlet />
        </div>
      </div>
    </HideScrollBarContainer>
  );
}

export default AdminSide;
