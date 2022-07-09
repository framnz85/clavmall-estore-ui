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

  const menuStyle = {
    mainContainer: {
      backgroundColor: estore.headerColor,
      height: "50px",
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

  const handleClick = (e) => {
    setCurrent(e.key);
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
    <div
      className="d-flex justify-content-between"
      style={menuStyle.mainContainer}
    >
      <Menu
        onClick={handleClick}
        selectedKeys={[current]}
        mode="horizontal"
        style={menuStyle.leftStyle}
      >
        <Item key="home" icon={<HomeOutlined />} style={menuStyle.headerStyle}>
          <Link to="/" style={menuStyle.headerStyle}>
            Home
          </Link>
        </Item>
        <Item key="shop" icon={<ShoppingOutlined />} style={menuStyle.headerStyle}>
          <Link to="/shop" style={menuStyle.headerStyle}>
            Shop
          </Link>
        </Item>
        <Item
          key="location"
          icon={<EnvironmentOutlined />}
          style={menuStyle.headerStyle}
          onClick={() => setLocModalVisible(true)}
        >
          <span style={menuStyle.headerStyle}>Location</span>
        </Item>
        <Item key="cart" icon={<ShoppingCartOutlined />} style={menuStyle.headerStyle}>
          <Link to="/cart" style={menuStyle.headerStyle}>
            <Badge count={inputs.cart && inputs.cart.map(p => parseInt(p.count)).reduce((a, b) => a + b, 0)} offset={[11, 0]}>
              <span style={menuStyle.headerStyle}>Cart</span>
            </Badge>
          </Link>
        </Item>
        <Item key="search">
        </Item>
      </Menu>

      <div className="d-flex justify-content-end">

        <Menu className="m-2" style={menuStyle.searchStyle}>
          <SearchHead />
        </Menu>

        {user.token && (
          <Menu
            onClick={handleClick}
            selectedKeys={[current]}
            mode="horizontal"
            style={menuStyle.rightStyle}
             className="d-flex justify-content-between"
          >
            <SubMenu
              key="SubMenu"
              icon={<UserOutlined />}
              title={user.name || (user.email && user.email.split("@")[0])}
              style={menuStyle.headerStyle}
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
            style={menuStyle.rightStyle}
          >
            <Item key="login" icon={<LoginOutlined />} style={menuStyle.headerStyle}>
              <Link to="/login" style={menuStyle.headerStyle}>
                Login
              </Link>
            </Item>
            <Item key="register" icon={<UserAddOutlined />} style={menuStyle.headerStyle}>
              <Link to="/register" style={menuStyle.headerStyle}>
                Register
              </Link>
            </Item>
          </Menu>
        )}
        
      </div>

      <LocationModal
        locModalVisible={locModalVisible}
        setLocModalVisible={setLocModalVisible}
      />
    </div>
  );
};

export default Header;
