import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  CaretRightOutlined,
  LoginOutlined,
  DeleteOutlined,
  RetweetOutlined,
} from "@ant-design/icons";
import { Popconfirm, Pagination } from "antd";
import { toast } from "react-toastify";

import InputSearch from "../../common/form/InputSearch";

import {
  currentUser,
  loginAsAuthToken,
  setDefaultPassword,
  updateRole,
  deleteUser,
} from "../../../functions/auth";

const UserListTable = ({
  values,
  setValues,
  adminUser,
  setAdminUser,
  loadAllUsers,
}) => {
  let dispatch = useDispatch();
  let history = useHistory();

  const [keyword, setKeyword] = useState("");

  const { user, estore } = useSelector((state) => ({
    ...state,
  }));

  useEffect(() => {
    if (keyword.length > 0) {
      loadAllUsers(keyword);
    } else {
      loadAllUsers();
    }
  }, [keyword]); // eslint-disable-line react-hooks/exhaustive-deps

  const logoutLogin = (userTo) => {
    dispatch({
      type: "USER_LOGOUT",
      payload: {},
    });
    loginAsAuthToken(userTo.email, userTo.phone, user.token)
      .then((res) => {
        if (res.data.err) {
          toast.error(res.data.err);
        } else {
          const token = res.data;
          window.localStorage.setItem("userToken", token);
          currentUser(token).then((res) => {
            dispatch({
              type: "LOGGED_IN_USER_II",
              payload: {
                _id: res.data._id,
                name: res.data.name,
                phone: res.data.phone,
                email: res.data.email,
                emailConfirm: res.data.emailConfirm,
                role: res.data.role,
                address: res.data.address ? res.data.address : {},
                homeAddress: res.data.homeAddress ? res.data.homeAddress : {},
                token,
                wishlist: res.data.wishlist,
                addInstruct: res.data.addInstruct,
              },
            });
          });
          history.push("/");
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const handleResetPassword = (userid) => {
    setDefaultPassword(userid, user.token).then(() => {
      const updatedUser = values.users.filter((user) => user._id === userid);
      toast.success(
        `Password for ${updatedUser[0].name} set to default password => Grocery@1234`
      );
    });
  };

  const updateUserRole = (userid, role) => {
    updateRole(userid, role, user.token).then(() => {
      const newUsers = values.users.map((user) =>
        user._id === userid ? { ...user, role } : user
      );
      setValues({
        ...values,
        users: newUsers,
      });
      const adminUser = newUsers.filter((resUser) => resUser.role === "admin");
      adminUser.length > 0 && setAdminUser(adminUser);
    });
  };

  const handleDeleteUser = (userid) => {
    deleteUser(userid, user.token).then(() => {
      const newUsers = values.users.filter((user) => user._id !== userid);
      setValues({
        ...values,
        users: newUsers,
      });
      const adminUser = newUsers.filter((resUser) => resUser.role === "admin");
      adminUser.length > 0 && setAdminUser(adminUser);
    });
  };

  const userTableList = (userTo) => {
    return (
      <div
        key={userTo._id}
        className="alert alert-success"
        style={{ backgroundColor: estore.carouselColor }}
      >
        Name: {userTo.name} <CaretRightOutlined /> Email: {userTo.email}{" "}
        <CaretRightOutlined /> Phone: {userTo.phone} <CaretRightOutlined />{" "}
        Role:{" "}
        {userTo.superAdmin ? (
          "super admin"
        ) : userTo._id === user._id ? (
          "admin"
        ) : (
          <select
            name="category"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0)",
              border: "none",
              borderBottom: "1px solid #999",
              cursor: "pointer",
            }}
            onChange={(e) => updateUserRole(userTo._id, e.target.value)}
            value={userTo.role}
          >
            <option value="admin">admin</option>
            <option value="customer">customer</option>
          </select>
        )}
        {!userTo.superAdmin && userTo._id !== user._id && (
          <>
            <Popconfirm
              className="btn btn-sm float-right"
              value={userTo}
              title="Are you sure to delete this user?"
              onConfirm={() => handleDeleteUser(userTo._id)}
              onCancel={() => ""}
              okText="Yes"
              cancelText="No"
            >
              <DeleteOutlined className="text-danger" />
            </Popconfirm>

            <Popconfirm
              className="btn btn-sm float-right"
              value={userTo}
              title={
                <>
                  Are you sure to reset password to{" "}
                  <strong>Grocery@1234</strong>, the default password?
                </>
              }
              onConfirm={() => handleResetPassword(userTo._id)}
              onCancel={() => ""}
              okText="Yes"
              cancelText="No"
            >
              <RetweetOutlined className="text-primary" />
            </Popconfirm>

            <Popconfirm
              className="btn btn-sm float-right"
              value={userTo}
              title="Are you sure to login as this user?"
              onConfirm={() => logoutLogin(userTo)}
              onCancel={() => ""}
              okText="Yes"
              cancelText="No"
            >
              <LoginOutlined className="text-secondary" />
            </Popconfirm>
          </>
        )}
      </div>
    );
  };

  return (
    <>
      <h4 style={{ margin: "20px 0" }}>User Admin</h4>
      <hr />

      {adminUser.map((user) => userTableList(user))}

      <h4 style={{ margin: "20px 0" }}>Manage User</h4>
      <hr />

      <InputSearch
        keyword={keyword}
        setKeyword={setKeyword}
        placeholder="Search name or email"
        data={[]}
        setData={() => ""}
      />

      {values.users
        .filter((user) => user.role !== "admin")
        .map((user) => userTableList(user))}

      <Pagination
        className="text-center pt-3"
        onChange={(page, pageSize) =>
          setValues({ ...values, currentPage: page, pageSize })
        }
        current={values.currentPage}
        pageSize={values.pageSize}
        total={values.itemsCount}
      />
    </>
  );
};

export default UserListTable;
