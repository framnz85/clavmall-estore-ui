import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const UserNav = () => {
  const { estore } = useSelector((state) => ({ ...state }));

  const textColor = {
    color: estore.headerColor ? estore.headerColor : "#009a57",
  };

  return (
    <nav>
      <ul className="nav flex-column" style={{ padding: "10px 20px 10px 5px" }}>
        <li className="nav-item">
          <Link to="/user/history" className="nav-link" style={textColor}>
            History
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/user/password" className="nav-link" style={textColor}>
            Password
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/user/wishlist" className="nav-link" style={textColor}>
            Wishlist
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/dashboard" className="nav-link" style={textColor}>
            Admin
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default UserNav;
