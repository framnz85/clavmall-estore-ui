import axios from "axios";

export const createOrder = async (orderObjects, authToken) =>
  await axios.post(
    process.env.REACT_APP_API + "/user/order",
    { orderObjects },
    {
      headers: {
        authToken,
        estoreid: process.env.REACT_APP_ESTORE_ID,
      },
    }
  );

export const updateOrder = async (orderid, authToken) =>
  await axios.put(
      process.env.REACT_APP_API + "/user/order/" + orderid, {},
    {
      headers: {
        authToken,
        estoreid: process.env.REACT_APP_ESTORE_ID,
      },
    }
  );

export const getUserOrders = async (
  sortkey,
  sort,
  currentPage,
  pageSize,
  searchQuery,
  minPrice,
  maxPrice,
  dateFrom,
  dateTo,
  status,
  payment,
  authToken
) =>
  await axios.post(process.env.REACT_APP_API + "/user/orders", {
    sortkey,
    sort,
    currentPage,
    pageSize,
    searchQuery,
    minPrice,
    maxPrice,
    dateFrom,
    dateTo,
    status,
    payment,
  }, {
    headers: {
      authToken,
      estoreid: process.env.REACT_APP_ESTORE_ID,
    },
  });

export const getUserOrder = async (orderId, authToken) =>
  await axios.get(process.env.REACT_APP_API + "/user/order/" + orderId, {
    headers: {
      authToken,
      estoreid: process.env.REACT_APP_ESTORE_ID,
    },
  });

export const paymentChange = async (orderId, payid, category, name, authToken) =>
  await axios.put(
      process.env.REACT_APP_API + "/user/orderpayment/" + orderId, {payid, category, name},
    {
      headers: {
        authToken,
        estoreid: process.env.REACT_APP_ESTORE_ID,
      },
    }
  );

export const checkExistCart = async (authToken) =>
  await axios.get(
      process.env.REACT_APP_API + "/user/check-exist-cart",
    {
      headers: {
        authToken,
        estoreid: process.env.REACT_APP_ESTORE_ID,
      },
    }
  );

export const deleteOrderById = async (orderid, authToken) =>
  await axios.delete(
      process.env.REACT_APP_API + "/user/order/" + orderid,
    {
      headers: {
        authToken,
        estoreid: process.env.REACT_APP_ESTORE_ID,
      },
    }
  );