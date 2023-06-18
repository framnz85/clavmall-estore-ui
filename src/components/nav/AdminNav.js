import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Select } from "antd";
import {
  MenuUnfoldOutlined,
  SafetyCertificateOutlined,
  SnippetsOutlined,
  PartitionOutlined,
  DropboxOutlined,
  CodepenOutlined,
  EnvironmentOutlined,
  CreditCardOutlined,
  TagOutlined,
  TeamOutlined,
  HomeOutlined,
  UserOutlined,
  LogoutOutlined,
  BlockOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { isMobile } from "react-device-detect";

import { getEstoreInfo } from "../../functions/estore";

const AdminNav = () => {
  let dispatch = useDispatch();
  let history = useHistory();

  const { estore } = useSelector((state) => ({ ...state }));

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

  const adminNav = [
    {
      key: "1",
      href: "/admin/dashboard",
      icon: <MenuUnfoldOutlined />,
      label: "Dashboard",
    },
    {
      key: "2",
      href: "/admin/category",
      icon: <SafetyCertificateOutlined />,
      label: "Category",
    },
    {
      key: "3",
      href: "/admin/subcat",
      icon: <SnippetsOutlined />,
      label: "Sub Category",
    },
    {
      key: "4",
      href: "/admin/parent",
      icon: <PartitionOutlined />,
      label: "Parents",
    },
    {
      key: "5",
      href: "/admin/product",
      icon: <DropboxOutlined />,
      label: "Product",
    },
    {
      key: "6",
      href: "/admin/products",
      icon: <CodepenOutlined />,
      label: "Products",
    },
    {
      key: "7",
      href: "/admin/location",
      icon: <EnvironmentOutlined />,
      label: "Location",
    },
    {
      key: "8",
      href: "/admin/payment",
      icon: <CreditCardOutlined />,
      label: "Payments",
    },
    {
      key: "9",
      href: "/admin/coupon",
      icon: <TagOutlined />,
      label: "Coupons",
    },
    {
      key: "10",
      href: "/admin/manageuser",
      icon: <TeamOutlined />,
      label: "Manage Users",
    },
    {
      key: "11",
      href: "/admin/managehome",
      icon: <HomeOutlined />,
      label: "Manage Home",
    },
    {
      key: "12",
      href: "/user/orders",
      icon: <UserOutlined />,
      label: "Personal",
    },
    {
      key: "13",
      href: "/admin/subscription",
      icon: <BlockOutlined />,
      label: "Subscription",
    },
    // { key: "14", href: "/admin/affiliate", icon: <ApartmentOutlined />, label: "Affiliate" },
    {
      key: "15",
      href: "/admin/guide1",
      icon: <QuestionCircleOutlined />,
      label: "Guide",
    },
  ];

  const adminNavMob = [
    ...adminNav,
    { key: "16", href: "logout", icon: <LogoutOutlined />, label: "Logout" },
  ];

  return (
    <nav>
      {!isMobile && (
        <ul
          className="nav flex-column"
          style={{ padding: "10px 20px 10px 5px" }}
        >
          {adminNav.map((nav) => (
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
            options={adminNavMob.map((nav) => {
              return { label: nav.label, value: nav.href };
            })}
            style={{ margin: "15px 10px 0 10px", width: "100%" }}
          />
        </div>
      )}
    </nav>
  );
};

export default AdminNav;
