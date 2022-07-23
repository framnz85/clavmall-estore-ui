import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { CaretRightOutlined, LoginOutlined } from "@ant-design/icons";
import { Popconfirm } from 'antd';
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";

import { auth } from "../../../functions/firebase";
import AdminNav from "../../../components/nav/AdminNav";

import { listUsers } from "../../../functions/user";

const initialState = {
  users: [],
  itemsCount: 0,
  pageSize: 20,
  currentPage: 1,
  sortkey: "",
  sort: -1,
  searchQuery: "",
};

const CategoryCreate = () => {
    let dispatch = useDispatch();
    let history = useHistory();

    const [values, setValues] = useState(initialState);
        
    const { user, admin, estore } = useSelector((state) => ({
        ...state,
    }));

    useEffect(() => {
        loadAllUsers();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    
    const loadAllUsers = () => {
        if (admin.users.length > 0) {
            setValues({
                ...values,
                users: admin.users
            })
        } else {
            listUsers(user.token).then((res) => {
                setValues({
                    ...values,
                    users: res.data
                })
                dispatch({
                    type: "ADMIN_OBJECT_XX",
                    payload: {
                        users: { ...admin.users, ...res.data }
                    },
                });
            });
        }
    }

    const logoutLogin = (userTo) => {
        signOut(auth).then(() => {
            dispatch({
                type: "USER_LOGOUT",
                payload: {},
            });
            dispatch({
                type: "LOGGED_IN_USER_II",
                payload: {
                    _id: userTo._id,
                    name: userTo.name,
                    email: userTo.email,
                    role: userTo.role,
                    address: userTo.address,
                    homeAddress: userTo.homeAddress,
                    token: user.token,
                    wishlist: userTo.wishlist,
                },
            });
            history.push("/");
        }).catch((error) => {
            toast.success(error.message);
        });
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-m-2">
                    <AdminNav />
                </div>
                <div className="col-md-10 bg-white mt-3 mb-5">
                    <h4 style={{ margin: "20px 0" }}>Manage User</h4>
                    <hr />

                    {values.users.map(user => 
                        <div
                            key={user._id}
                            className="alert alert-success"
                            style={{ backgroundColor: estore.carouselColor }}
                        >
                            Name: {user.name} <CaretRightOutlined /> {" "}
                            Email: {user.email} <CaretRightOutlined /> {" "}
                            Role: {user.role}

                            <Popconfirm
                                className="btn btn-sm float-right"
                                value={user}
                                title="Are you sure to login as this user?"
                                onConfirm={() => logoutLogin(user)}
                                onCancel={() => ""}
                                okText="Yes"
                                cancelText="No"
                            >
                                <LoginOutlined className="text-secondary" />
                            </Popconfirm>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default CategoryCreate;
