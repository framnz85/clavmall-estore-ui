import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";

import { auth } from "../../functions/firebase";
import { getEstoreInfo } from "../../functions/estore";

const AdminNav = () => {
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
          <Link to="/admin/dashboard" className="nav-link" style={textColor}>
            Dashboard
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/category" className="nav-link" style={textColor}>
            Category
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/subcat" className="nav-link" style={textColor}>
            Sub Category
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/parent" className="nav-link" style={textColor}>
            Parents
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/product" className="nav-link" style={textColor}>
            Product
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/products" className="nav-link" style={textColor}>
            Products
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/location" className="nav-link" style={textColor}>
            Location
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/payment" className="nav-link" style={textColor}>
            Payments
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/coupon" className="nav-link" style={textColor}>
            Coupons
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/manageuser" className="nav-link" style={textColor}>
            Manage User
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/managehome" className="nav-link" style={textColor}>
            Manage Home
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/user/orders" className="nav-link" style={textColor}>
            Personal
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

export default AdminNav;
