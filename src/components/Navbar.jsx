import { NavLink } from "react-router";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="site-nav" aria-label="Primær navigation">
      <NavLink
        className="brand"
        to="/"
        aria-label="Mellemrum - gå til forsiden"
      >
        mellemrum<span>.</span>
      </NavLink>
      <div className="nav-links">
        <NavLink to="/">Events</NavLink>
        <NavLink to="/om">Om Mellemrum</NavLink>
      </div>
    </nav>
  );
}
