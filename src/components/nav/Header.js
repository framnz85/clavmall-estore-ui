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
  EnvironmentOutlined,
} from "@ant-design/icons";
import { signOut } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

import SearchHead from "./SearchHead";

import { auth } from "../../functions/firebase";
import { getEstoreInfo } from "../../functions/estore";
import LocationModal from "../modal/LocationModal";

const { SubMenu, Item } = Menu;

const Header = () => {
  let dispatch = useDispatch();
  let history = useHistory();

  const [current, setCurrent] = useState("home");
  const [locModalVisible, setLocModalVisible] = useState(false);

  let { estore, user, inputs } = useSelector((state) => ({ ...state }));

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
    signOut(auth).then(() => {
      dispatch({
        type: "USER_LOGOUT",
        payload: {},
      });
      getEstoreInfo(process.env.REACT_APP_ESTORE_ID).then((estore) => {
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
        <Item
          key="location"
          icon={<EnvironmentOutlined />}
          style={headerStyle}
          onClick={() => setLocModalVisible(true)}
        >
          <span style={headerStyle}>Location</span>
        </Item>
        <Item key="cart" icon={<ShoppingCartOutlined />} style={headerStyle}>
          <Link to="/cart" style={headerStyle}>
            <Badge count={inputs.cart && inputs.cart.map(p => parseInt(p.count)).reduce((a, b) => a + b, 0)} offset={[11, 0]}>
              <span style={headerStyle}>Cart</span>
            </Badge>
          </Link>
        </Item>
      </Menu>

      <Menu className="m-2" style={searchStyle}>
        <SearchHead />
      </Menu>

      <LocationModal
        locModalVisible={locModalVisible}
        setLocModalVisible={setLocModalVisible}
      />

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
                <Link to="/user/orders">Dashboard</Link>
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
