import axios from "axios";

export const getOrders = async (
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
) => {
  return await axios.post(process.env.REACT_APP_API + "/admin/orders", {
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
    },
  });
};

export const getOrder = async (orderId, authToken) =>
  await axios.get(process.env.REACT_APP_API + "/admin/order/" + orderId, {
    headers: {
      authToken,
    },
  });

export const changeStatus = async (data, authToken) => {
  return await axios.put(
    process.env.REACT_APP_API + "/admin/order-status",
    { data },
    {
      headers: {
        authToken,
      },
    }
  );
};
