import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";

import { auth } from "../../functions/firebase";
import { getEstoreInfo } from "../../functions/estore";

const UserNav = () => {
  let dispatch = useDispatch();
  let history = useHistory();

  const { estore } = useSelector((state) => ({ ...state }));

  const textColor = {
    color: estore.headerColor ? estore.headerColor : "#009a57",
  };

  const logout = () => {
    signOut(auth).then(() => {
      dispatch({
        type: "USER_LOGOUT",
        payload: {},
      });
      getEstoreInfo(estore._id).then((estore) => {
        dispatch({
          type: "ESTORE_LOGOUT",
          payload: estore.data[0],
        });
        localStorage.setItem(
            "estore",
            JSON.stringify(estore.data[0])
        );
        toast.success("Successfully logged out!");
        history.push("/login");
      });
    }).catch((error) => {
        toast.success(error.message);
    });
  };

  return (
    <nav>
      <ul className="nav flex-column" style={{ padding: "10px 20px 10px 5px" }}>
        <li className="nav-item">
          <Link to="/user/orders" className="nav-link" style={textColor}>
            History
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/user/wishlist" className="nav-link" style={textColor}>
            Wishlist
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/user/account" className="nav-link" style={textColor}>
            Account
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/dashboard" className="nav-link" style={textColor}>
            Admin
          </Link>
        </li>
        <li className="nav-item" onClick={logout}>
          <div className="nav-link" style={{...textColor, cursor: "pointer"}}>
            Logout
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default UserNav;
