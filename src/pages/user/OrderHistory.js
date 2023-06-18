import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

import UserNav from "../../components/nav/UserNav";
import InputSearch from "../../components/common/form/InputSearch";
import OrderUsersTable from "../../components/user/OrderUsersTable";
import OrderGroupSearch from "../../components/user/OrderGroupSearch";
import CreateStore from "../../components/common/CreateStore";

import { getUserOrders } from "../../functions/order";
import paymentCategories from "../../components/common/constants/paymentCategories";

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

const History = () => {
  let dispatch = useDispatch();

  const [values, setValues] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");

  const { user, orders } = useSelector((state) => ({
    ...state,
  }));

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
    getUserOrders(
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
    ).then((res) => {
      let result = [];
      res.data.orders && res.data.orders.map((data) => {
        const existOrder = orders.values.filter(order => order._id === data._id);
        if (!existOrder.length || res.data.query) {
          result.push({
            ...data, page: values.currentPage
          })
        }
        return result;
      });
      setValues({
        ...values,
        orders: res.data.query ? result : [...orders.values, ...result],
        itemsCount: res.data.query ? parseInt(res.data.count)
          : orders.itemsCount > 0
            ? orders.itemsCount
            : parseInt(res.data.count),
      });
      !res.data.query && dispatch({
        type: "ORDER_LIST_II",
        payload: {
          values: [...orders.values, ...result],
          pages: !orders.pages.includes(currentPage)
            ? [...orders.pages, currentPage]
            : orders.pages,
          itemsCount: orders.itemsCount > 0
            ? orders.itemsCount
            : parseInt(res.data.count),
        }
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

  return (
    <div className="container">
      <div className="row">
        <div className="col-m-2">
          <UserNav />
        </div>
        <div className="col-md-10 bg-white mt-3 mb-5">

          <h4 style={{ margin: "20px 0" }}>
            {orders.values && orders.values.length
              ? "Order History"
              : "No orders yet"}
          </h4>

          <form onSubmit={groupSearchSubmit}>
            <InputSearch
              keyword={keyword}
              setKeyword={setKeyword}
              placeholder="Search order code"
              data={values}
              setData={setValues}
            />
          </form>

          <OrderGroupSearch
            values={values}
            setValues={setValues}
            groupSearchSubmit={groupSearchSubmit}
          />
          <br /><br />

          <OrderUsersTable
            values={values}
            setValues={setValues}
            loading={loading}
          />
          <br /><br />
          
          <div style={{ paddingBottom: 10 }}>
            <CreateStore />
          </div>

        </div>
      </div>
    </div>
  );
};

export default History;
