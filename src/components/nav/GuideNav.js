import React from "react";
import { Link, useHistory } from "react-router-dom";
import { Select } from "antd";
import { MenuUnfoldOutlined } from "@ant-design/icons";
import { isMobile } from "react-device-detect";

const GuideNav = () => {
  let history = useHistory();

  const textColor = {
    color: "#666",
  };

  const guideNav = [
    {
      key: "8",
      href: "/admin/guide8",
      icon: <MenuUnfoldOutlined />,
      label: "Verifying Account",
    },
    {
      key: "1",
      href: "/admin/guide1",
      icon: <MenuUnfoldOutlined />,
      label: "Setting Manage Home",
    },
    {
      key: "2",
      href: "/admin/guide2",
      icon: <MenuUnfoldOutlined />,
      label: "Managing Categories",
    },
    {
      key: "3",
      href: "/admin/guide3",
      icon: <MenuUnfoldOutlined />,
      label: "Parents & Sub-Categories",
    },
    {
      key: "4",
      href: "/admin/guide4",
      icon: <MenuUnfoldOutlined />,
      label: "Product Management",
    },
    {
      key: "5",
      href: "/admin/guide5",
      icon: <MenuUnfoldOutlined />,
      label: "Establishing Locations",
    },
    {
      key: "6",
      href: "/admin/guide6",
      icon: <MenuUnfoldOutlined />,
      label: "Setting-up Payments",
    },
    {
      key: "7",
      href: "/admin/guide7",
      icon: <MenuUnfoldOutlined />,
      label: "Offering Coupons",
    },
    {
      key: "10",
      href: "/admin/guide10",
      icon: <MenuUnfoldOutlined />,
      label: "Premade Posts",
    },
    {
      key: "11",
      href: "/admin/guide11",
      icon: <MenuUnfoldOutlined />,
      label: "Grocey Setup",
    },
    {
      key: "10",
      href: "/admin/guide10",
      icon: <MenuUnfoldOutlined />,
      label: "Premade Posts",
    },
    {
      key: "9",
      href: "/admin/dashboard",
      icon: <MenuUnfoldOutlined />,
      label: "Back To Admin",
    },
  ];

  return (
    <nav>
      {!isMobile && (
        <ul
          className="nav flex-column"
          style={{ padding: "10px 20px 10px 5px" }}
        >
          {guideNav.map((nav) => (
            <li className="nav-item" key={nav.key}>
              <Link to={nav.href} className="nav-link" style={textColor}>
                {nav.icon} {nav.label}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {isMobile && (
        <div style={{ width: window.innerWidth - 39 }}>
          <Select
            showSearch
            placeholder="Menu Select"
            optionFilterProp="children"
            onChange={(value) => history.push(value)}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={guideNav.map((nav) => {
              return { label: nav.label, value: nav.href };
            })}
            style={{ margin: "15px 10px 0 10px", width: "100%" }}
          />
        </div>
      )}
    </nav>
  );
};

export default GuideNav;
