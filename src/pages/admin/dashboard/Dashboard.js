import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import AdminNav from "../../../components/nav/AdminNav";
import InputSearch from "../../../components/common/form/InputSearch";
import DashGroupSearch from "../../../components/forms/dashboard/DashGroupSearch";
import DashboardTable from "../../../components/forms/dashboard/DashboardTable";
import EstoreExpired from "../../../components/common/EstoreExpired";
import AddDomain from "../../../components/common/addDomain";
import AddToCartTable from "../../../components/forms/dashboard/AddToCartTable";

import { getOrders } from "../../../functions/admin";
import paymentCategories from "../../../components/common/constants/paymentCategories";

const initialState = {
  orders: [],
  itemsCount: 0,
  pageSize: 20,
  currentPage: 1,
  sortkey: "createdAt",
  sort: -1,
  searchQuery: "",
  minPrice: 0,
  maxPrice: 0,
  dateFrom: "",
  dateTo: "",
  status: "",
  statusOption: [
    "Not Processed",
    "Waiting Payment",
    "Processing",
    "Delivering",
    "Cancelled",
    "Completed",
  ],
  payment: "",
  paymentOption: paymentCategories,
};

const AdminDashboard = () => {
  let dispatch = useDispatch();

  const [values, setValues] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [tabMenu, setTabMenu] = useState(1);

  const { user, admin } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadOrders();
  }, [values.currentPage, values.sortkey, values.sort]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadOrders = () => {
    const {
      sortkey,
      sort,
      currentPage,
      pageSize,
      minPrice,
      maxPrice,
      dateFrom,
      dateTo,
      status,
      payment,
    } = values;
    setLoading(true);
    getOrders(
      sortkey,
      sort,
      currentPage,
      pageSize,
      keyword,
      minPrice,
      maxPrice,
      dateFrom,
      dateTo,
      status,
      payment,
      user.token
    )
      .then((res) => {
        let result = [];
        res.data.orders &&
          res.data.orders.map((data) => {
            const existOrder = admin.orders.values.filter(
              (order) => order._id === data._id
            );
            if (!existOrder.length || res.data.query) {
              result.push({
                ...data,
                page: currentPage,
              });
            }
            return result;
          });
        result.map((order) =>
          order.orderedBy && order.orderedBy.name
            ? order
            : {
                ...order,
                orderedBy: {
                  ...order.orderedBy,
                  name: "",
                },
              }
        );
        setValues({
          ...values,
          orders: res.data.query ? result : [...admin.orders.values, ...result],
          itemsCount: res.data.query
            ? parseInt(res.data.count)
            : admin.orders.itemsCount > 0
            ? admin.orders.itemsCount
            : parseInt(res.data.count),
        });
        !res.data.query &&
          dispatch({
            type: "ADMIN_OBJECT_XIII",
            payload: {
              orders: {
                ...admin.orders,
                values: [...admin.orders.values, ...result],
                pages: !admin.orders.pages.includes(currentPage)
                  ? [...admin.orders.pages, currentPage]
                  : admin.orders.pages,
                itemsCount:
                  admin.orders.itemsCount > 0
                    ? admin.orders.itemsCount
                    : parseInt(res.data.count),
              },
            },
          });
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.message);
        setLoading(false);
      });
  };

  const groupSearchSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    loadOrders();
  };

  const tabs = {
    float: "left",
    padding: "5px 10px",
    borderTop: "1px solid #aaa",
    borderLeft: "1px solid #aaa",
    width: 80,
    textAlign: "center",
    cursor: "pointer",
    borderTopRightRadius: 4,
    borderTopLeftRadius: 4,
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-m-2">
          <AdminNav />
        </div>

        <div className="col-md-10 bg-white mt-3 mb-5">
          <EstoreExpired />

          <h4 style={{ margin: "20px 0" }}>Dashboard</h4>

          <div style={{ borderBottom: "1px solid #aaa" }}>
            <div
              style={{
                ...tabs,
                backgroundColor: tabMenu === 1 ? "#fff" : "#eee",
              }}
              onClick={() => setTabMenu(1)}
            >
              Orders
            </div>
            <div
              style={{
                ...tabs,
                borderRight: "1px solid #aaa",
                backgroundColor: tabMenu === 2 ? "#fff" : "#eee",
              }}
              onClick={() => setTabMenu(2)}
            >
              Carts
            </div>
            <div style={{ clear: "both" }}></div>
          </div>
          <br />

          {tabMenu === 1 && (
            <>
              <form onSubmit={groupSearchSubmit}>
                <InputSearch
                  keyword={keyword}
                  setKeyword={setKeyword}
                  placeholder="Search name or order code"
                  data={values}
                  setData={setValues}
                />
              </form>
              <DashGroupSearch
                values={values}
                setValues={setValues}
                groupSearchSubmit={groupSearchSubmit}
              />
              <br />
              <br />

              <DashboardTable
                values={values}
                setValues={setValues}
                loading={loading}
              />
            </>
          )}

          {tabMenu === 2 && (
            <>
              <AddToCartTable />
            </>
          )}
          <br />
          <br />

          <div style={{ paddingBottom: 10 }}>
            <AddDomain />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
