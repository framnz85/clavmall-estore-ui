import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Select } from "antd";
import {
  HistoryOutlined,
  HeartOutlined,
  AlignLeftOutlined,
  ApartmentOutlined,
  UserAddOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { isMobile } from "react-device-detect";

import { getEstoreInfo } from "../../functions/estore";

const UserNav = () => {
  let dispatch = useDispatch();
  let history = useHistory();

  const { estore, user } = useSelector((state) => ({ ...state }));

  const textColor = {
    color: estore.headerColor ? estore.headerColor : "#009a57",
  };

  const logout = () => {
    dispatch({
      type: "USER_LOGOUT",
      payload: {},
    });
    dispatch({
      type: "INPUTS_OBJECT_X",
      payload: { cart: [] },
    });
    localStorage.clear();
    getEstoreInfo(estore._id).then((estore) => {
      dispatch({
        type: "ESTORE_LOGOUT",
        payload: estore.data[0],
      });
      localStorage.setItem("estore", JSON.stringify(estore.data[0]));
      toast.success("Successfully logged out!");
      history.push("/login");
    });
  };

  let userNav = [
    {
      key: "his",
      href: "/user/orders",
      icon: <HistoryOutlined />,
      label: "History",
    },
    {
      key: "wish",
      href: "/user/wishlist",
      icon: <HeartOutlined />,
      label: "Wishlist",
    },
    {
      key: "acc",
      href: "/user/account",
      icon: <AlignLeftOutlined />,
      label: "Account",
    },
    {
      key: "aff",
      href: "/user/referral",
      icon: <ApartmentOutlined />,
      label: "Referral",
    },
  ];

  if (user.role === "admin")
    userNav = [
      ...userNav,
      {
        key: "admin",
        href: "/admin/dashboard",
        icon: <UserAddOutlined />,
        label: "Admin",
      },
    ];

  const userNavMob = [
    ...userNav,
    { key: "log", href: "logout", icon: <LogoutOutlined />, label: "Logout" },
  ];

  return (
    <nav>
      {!isMobile && (
        <ul
          className="nav flex-column"
          style={{ padding: "10px 20px 10px 5px" }}
        >
          {userNav.map((nav) => (
            <li className="nav-item" key={nav.key}>
              <Link to={nav.href} className="nav-link" style={textColor}>
                {nav.icon} {nav.label}
              </Link>
            </li>
          ))}
          <li className="nav-item" onClick={logout}>
            <div
              className="nav-link"
              style={{ ...textColor, cursor: "pointer" }}
            >
              <LogoutOutlined /> Logout
            </div>
          </li>
        </ul>
      )}

      {isMobile && (
        <div style={{ width: window.innerWidth - 39 }}>
          <Select
            showSearch
            placeholder="Menu Select"
            optionFilterProp="children"
            onChange={(value) =>
              value === "logout" ? logout() : history.push(value)
            }
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={userNavMob.map((nav) => {
              return { label: nav.label, value: nav.href };
            })}
            style={{ margin: "15px 10px 0 10px", width: "100%" }}
          />
        </div>
      )}
    </nav>
  );
};

export default UserNav;
