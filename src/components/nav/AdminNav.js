import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminNav = () => {
  const { estore } = useSelector((state) => ({ ...state }));

  const textColor = {
    color: estore.headerColor ? estore.headerColor : "#009a57",
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
            Payment
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/coupon" className="nav-link" style={textColor}>
            Coupon
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/managehome" className="nav-link" style={textColor}>
            Manage Home
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/user/history" className="nav-link" style={textColor}>
            Personal
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default AdminNav;
