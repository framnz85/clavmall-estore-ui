import axios from "axios";

export const listUsers = async (authToken) =>
  await axios.get(
    process.env.REACT_APP_API + "/admin/users",
    {
      headers: {
        authToken,
        estoreid: process.env.REACT_APP_ESTORE_ID,
      },
    }
  );

export const userCart = async (cart, authToken) =>
  await axios.post(
    process.env.REACT_APP_API + "/user/cart",
    { cart },
    {
      headers: {
        authToken,
        estoreid: process.env.REACT_APP_ESTORE_ID,
      },
    }
  );

export const getUserCart = async (authToken, coucode, addiv3Id) =>
  await axios.get(process.env.REACT_APP_API + "/user/cart/" + coucode + "/" + addiv3Id, {
    headers: {
      authToken,
        estoreid: process.env.REACT_APP_ESTORE_ID,
    },
  });

export const emptyUserCart = async (authToken) =>
  await axios.delete(process.env.REACT_APP_API + "/user/cart", {
    headers: {
      authToken,
        estoreid: process.env.REACT_APP_ESTORE_ID,
    },
  });

export const saveUserAddress = async (authToken, address, homeAddress, coupon) =>
  await axios.post(
    process.env.REACT_APP_API + "/user/address",
    { address, homeAddress, coupon },
    {
      headers: {
        authToken,
        estoreid: process.env.REACT_APP_ESTORE_ID,
      },
    }
  );

export const applyCoupon = async (authToken, coupon) =>
  await axios.post(
    process.env.REACT_APP_API + "/user/cart/coupon",
    { coupon },
    {
      headers: {
        authToken,
        estoreid: process.env.REACT_APP_ESTORE_ID,
      },
    }
  );

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

export const getWishlist = async (authToken) =>
  await axios.get(process.env.REACT_APP_API + "/user/wishlist", {
    headers: {
      authToken,
      estoreid: process.env.REACT_APP_ESTORE_ID,
    },
  });

export const removeWishlist = async (productId, authToken) =>
  await axios.put(
    process.env.REACT_APP_API + "/user/wishlist/" + productId,
    {},
    {
      headers: {
        authToken,
        estoreid: process.env.REACT_APP_ESTORE_ID,
      },
    }
  );

export const addToWishlist = async (productId, authToken) =>
  await axios.post(
    process.env.REACT_APP_API + "/user/wishlist",
    { productId },
    {
      headers: {
        authToken,
        estoreid: process.env.REACT_APP_ESTORE_ID,
      },
    }
  );

export const updateProfile = async (values, authToken) =>
  await axios.put(
    process.env.REACT_APP_API + "/user/profile",
    { values },
    {
      headers: {
        authToken,
        estoreid: process.env.REACT_APP_ESTORE_ID,
      },
    }
  ); 