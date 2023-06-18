import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CaretRightOutlined } from "@ant-design/icons";

import AdminNav from "../../../components/nav/AdminNav";
import EstoreExpired from "../../../components/common/EstoreExpired";
import UserListTable from "../../../components/forms/user/UserListTable";
import AddDomain from "../../../components/common/addDomain";
import AllReferralComm from "../../../components/forms/user/AllReferralComm";
import AllWithdrawComm from "../../../components/forms/user/AllWithdrawComm";

import { listUsers } from "../../../functions/user";

const initialState = {
  users: [],
  itemsCount: 0,
  pageSize: 20,
  currentPage: 1,
  sortkey: "name",
  sort: 1
};

const CategoryCreate = () => {
    const [values, setValues] = useState(initialState);
    const [superUser, setSuperUser] = useState({});
    const [adminUser, setAdminUser] = useState([]);
  const [tabMenu, setTabMenu] = useState(1);
        
    const { user, estore } = useSelector((state) => ({
        ...state,
    }));

    useEffect(() => {
        loadAllUsers();
    }, [values.currentPage, values.pageSize]); // eslint-disable-line react-hooks/exhaustive-deps
    
    const loadAllUsers = (keyword) => {
        const { sortkey, sort, currentPage, pageSize } = values;
        listUsers(sortkey, sort, currentPage, pageSize, keyword ? keyword : "").then((res) => {
            const superUser = res.data.users.filter(resUser => resUser._id === user._id && resUser.superAdmin);
            const adminUser = res.data.users.filter(resUser => resUser.role === "admin");
            setValues({
                ...values,
                users: res.data.users,
                itemsCount: res.data.count
            })
            superUser.length > 0 && setSuperUser(superUser[0]);
            adminUser.length > 0 && setAdminUser(adminUser);
        });
    }

    const tabs = {
        float: "left",
        padding: "5px 10px",
        borderTop: "1px solid #aaa",
        borderLeft: "1px solid #aaa",
        width: 80,
        textAlign: "center",
        cursor: "pointer",
        borderTopRightRadius: 4,
        borderTopLeftRadius: 4
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-m-2">
                    <AdminNav />
                </div>
                <div className="col-md-10 bg-white mt-3 mb-5">
                    <EstoreExpired />
                    <br />

                    <div style={{borderBottom: "1px solid #aaa"}}>
                        <div style={{...tabs, backgroundColor: tabMenu === 1 ? "#fff" : "#eee"}} onClick={() => setTabMenu(1)}>Users</div>
                        <div style={{...tabs, backgroundColor: tabMenu === 2 ? "#fff" : "#eee", width: 110}} onClick={() => setTabMenu(2)}>Commissions</div>
                        <div style={{...tabs, borderRight: "1px solid #aaa", backgroundColor: tabMenu === 3 ? "#fff" : "#eee", width: 110}} onClick={() => setTabMenu(3)}>Withdrawals</div>
                        <div style={{clear: "both"}}></div>
                    </div>
                    <br />

                    {tabMenu === 1 && 
                        <>
                            {superUser.superAdmin && <>
                                <h4 style={{ margin: "20px 0" }}>Super Admin</h4>
                                <hr />

                                <div
                                    key={superUser._id}
                                    className="alert alert-success"
                                    style={{ backgroundColor: estore.carouselColor }}
                                >
                                    Name: {superUser.name} <CaretRightOutlined /> {" "}
                                    Email: {superUser.email} <CaretRightOutlined /> {" "}
                                    Role: super admin
                                </div>
                            </>
                            }

                            <UserListTable
                                values={values}
                                setValues={setValues}
                                adminUser={adminUser}
                                setAdminUser={setAdminUser}
                                loadAllUsers={loadAllUsers}
                            />
                            <br /><br />
                        </>
                    }

                    {tabMenu === 2 && 
                        <AllReferralComm />
                    }
                    
                    {tabMenu === 3 && 
                        <AllWithdrawComm />
                    }
                    
                    <div style={{ paddingBottom: 10 }}>
                        <AddDomain />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CategoryCreate;
