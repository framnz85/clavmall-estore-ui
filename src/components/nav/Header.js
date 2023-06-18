import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Badge } from "antd";
import {
  HomeOutlined,
  LoginOutlined,
  UserOutlined,
  UserAddOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  EnvironmentOutlined
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { BrowserView, isMobile } from 'react-device-detect';

import SearchHead from "./SearchHead";
import LocationModal from "../modal/LocationModal";
import CartExistModal from "../modal/CartExistModal";

import { checkExistCart } from "../../functions/order";
import Categories from "./Categories";

const Header = () => {
  const [cart, setCart] = useState({});
  const [locModalVisible, setLocModalVisible] = useState(false);
  const [isCartExist, setIsCartExist] = useState(false);

  let { estore, user, inputs } = useSelector((state) => ({ ...state }));

  const checkCart = (token) => {
    const stopCartShow = localStorage.getItem("stopCartShow");
    if (!stopCartShow) {
      checkExistCart(token).then(res => {
        const savedCart = JSON.parse(localStorage.getItem("cart"));
        if (res.data.cart[0] && (res.data.cart[0] && res.data.cart[0].products.length) !== (savedCart && savedCart.length)) {
          setCart(res.data.cart[0]);
          setIsCartExist(true);
        }
      })
    }
  }

  useEffect(() => {
    user.token && checkCart(user.token);
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const menuStyle = {
    mainContainer: {
      backgroundColor: estore.headerColor,
      height: "56px",
      position: "fixed",
      zIndex: 2,
      width: "100%",
      top: 0
    },
    leftStyle: {
      color: "#ffffff",
      backgroundColor: estore.headerColor,
      borderBottom: `1px solid ${estore.headerColor}`,
    },
    headerStyle: {
      color: "#ffffff",
      borderBottom: `1px solid ${estore.headerColor}`,
    },
    searchStyle: {
      width: "300px",
    },
    rightStyle: {
      color: "#ffffff",
      backgroundColor: estore.headerColor,
      borderBottom: `1px solid ${estore.headerColor}`,
    }
  }

  return (
    <div
      className="d-flex justify-content-between"
      style={menuStyle.mainContainer}
    >
      <BrowserView className="d-flex flex-row">
        <Categories />
        <div className="p-3 mr-3">
          <Link to="/" style={menuStyle.headerStyle}>
            <HomeOutlined /> Home
          </Link>
        </div>
        <div className="p-3 mr-3">
          <Link to="/shop" style={menuStyle.headerStyle}>
            <ShoppingOutlined /> Shop
          </Link>
        </div>
        <div
          className="p-3 mr-3"
          style={{ ...menuStyle.headerStyle, cursor: "pointer" }}
          onClick={() => setLocModalVisible(true)}
        >
          <EnvironmentOutlined /> Location
        </div>
        <div className="p-3 mr-3">
          <Link to="/cart" style={menuStyle.headerStyle}>
            <ShoppingCartOutlined />{" "}
            <Badge count={inputs.cart && inputs.cart.map(p => parseInt(p.count)).reduce((a, b) => a + b, 0)} offset={[11, 0]}>
              <span style={menuStyle.headerStyle}>Cart</span>
            </Badge>
          </Link>
        </div>
      </BrowserView>

      <div className="d-flex justify-content-end">
        {isMobile && <Categories />}
        <div className="mr-3" style={{padding: "13px"}}>
          <SearchHead />
        </div>

          {user.token && (
            <>
              <BrowserView className="p-3 mr-3">
                <Link to={
                    user && user.role === "admin"
                      ? "/admin/dashboard"
                    : user && user.role === "customer"
                      ? "/user/orders"
                      : ""
                  } style={menuStyle.headerStyle}>
                  <UserOutlined /> {user.name || (user.email && user.email.split("@")[0])}
                </Link>
              </BrowserView>
            </>
          )}

          {!user.token && (
            <>
              <BrowserView className="p-3 mr-3">
                <Link to="/login" style={menuStyle.headerStyle}>
                  <LoginOutlined /> Login
                </Link>
              </BrowserView>
              <BrowserView className="p-3 mr-3">
                <Link to="/register" style={menuStyle.headerStyle}>
                  <UserAddOutlined /> Register
                </Link>
              </BrowserView>
            </>
          )}
        
      </div>

      <LocationModal
        locModalVisible={locModalVisible}
        setLocModalVisible={setLocModalVisible}
      />
      <CartExistModal
        cart={cart}
        isCartExist={isCartExist}
        setIsCartExist={setIsCartExist}
      />
    </div>
  );
};

export default Header;
