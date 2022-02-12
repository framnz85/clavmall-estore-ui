import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Badge } from "antd";
import {
  HomeOutlined,
  LoginOutlined,
  UserOutlined,
  UserAddOutlined,
  LogoutOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import firebase from "firebase";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import SearcHead from "../forms/SearcHead";
import { getEstoreInfo } from "../../functions/estore";

const { SubMenu, Item } = Menu;

const Header = () => {
  let dispatch = useDispatch();
  const [current, setCurrent] = useState("home");

  let { estore, user, cart } = useSelector((state) => ({ ...state }));

  let history = useHistory();

  const rightStyle = {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: estore.headerColor,
    color: "#ffffff",
  };

  const searchStyle = {
    position: "absolute",
    top: 0,
    right: 200,
    width: "200px",
  };

  const headerStyle = {
    backgroundColor: estore.headerColor,
    color: "#ffffff",
    borderBottom: `1px solid ${estore.headerColor}`,
  };

  const handleClick = (e) => {
    setCurrent(e.key);
  };

  const logout = () => {
    firebase.auth().signOut();
    dispatch({
      type: "USER_LOGOUT",
      payload: {},
    });
    localStorage.clear();
    getEstoreInfo(process.env.REACT_APP_ESTORE_ID).then((estore) => {
      dispatch({
        type: "ESTORE_INFO",
        payload: {
          ...estore.data[0],
        },
      });
      localStorage.setItem("estore", JSON.stringify(estore.data[0]));
      history.push("/login");
    });
  };

  return (
    <>
      <Menu
        onClick={handleClick}
        selectedKeys={[current]}
        mode="horizontal"
        style={headerStyle}
      >
        <Item key="home" icon={<HomeOutlined />} style={headerStyle}>
          <Link to="/" style={headerStyle}>
            Home
          </Link>
        </Item>
        <Item key="shop" icon={<ShoppingOutlined />} style={headerStyle}>
          <Link to="/shop" style={headerStyle}>
            Shop
          </Link>
        </Item>
        <Item key="cart" icon={<ShoppingCartOutlined />} style={headerStyle}>
          <Link to="/cart" style={headerStyle}>
            <Badge count={cart.length} offset={[11, 0]}>
              <span style={headerStyle}>Cart</span>
            </Badge>
          </Link>
        </Item>
      </Menu>

      <Menu className="m-2" style={searchStyle}>
        <SearcHead />
      </Menu>

      {user.token && (
        <Menu
          onClick={handleClick}
          selectedKeys={[current]}
          mode="horizontal"
          style={rightStyle}
        >
          <SubMenu
            key="SubMenu"
            icon={<UserOutlined />}
            title={user.name || (user.email && user.email.split("@")[0])}
            style={headerStyle}
          >
            {user && user.role === "admin" && (
              <Item key="admin">
                <Link to="/admin/dashboard">Dashboard</Link>
              </Item>
            )}
            {user && user.role === "subscriber" && (
              <Item key="subscriber">
                <Link to="/user/history">Dashboard</Link>
              </Item>
            )}
            <Item key="logout" icon={<LogoutOutlined />} onClick={logout}>
              Logout
            </Item>
          </SubMenu>
        </Menu>
      )}

      {!user.token && (
        <Menu
          onClick={handleClick}
          selectedKeys={[current]}
          mode="horizontal"
          style={rightStyle}
        >
          <Item key="login" icon={<LoginOutlined />} style={headerStyle}>
            <Link to="/login" style={headerStyle}>
              Login
            </Link>
          </Item>
          <Item key="register" icon={<UserAddOutlined />} style={headerStyle}>
            <Link to="/register" style={headerStyle}>
              Register
            </Link>
          </Item>
        </Menu>
      )}
    </>
  );
};

export default Header;
