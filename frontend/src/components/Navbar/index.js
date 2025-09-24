import { NavLink } from "react-router-dom";

function Navbar() {
  const navStyle = {
    padding: "10px 20px",
    backgroundColor: "#eeeeee",
    display: "flex",
    gap: "20px",
  };

  const linkStyle = ({ isActive }) => ({
    color: isActive ? "#1976d2" : "#333",
    fontWeight: isActive ? "bold" : "normal",
    textDecoration: "none",
  });

  return (
    <nav style={navStyle}>
      <NavLink to="/admin/list-user" style={linkStyle}>
        user reg request
      </NavLink>
      {/* <NavLink to="/" style={linkStyle}>
        side 2
      </NavLink>
      <NavLink to="/" style={linkStyle}>
        side 3
      </NavLink> */}
    </nav>
  );
}

export default Navbar;
