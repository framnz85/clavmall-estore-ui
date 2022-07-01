import axios from "axios";

export const userCart = async (cart, authToken) =>
  await axios.post(
    process.env.REACT_APP_API + "/user/cart",
    { cart },
    {
      headers: {
        authToken,
      },
    }
  );

export const getUserCart = async (authToken, coucode, addiv3Id) =>
  await axios.get(process.env.REACT_APP_API + "/user/cart/" + coucode + "/" + addiv3Id, {
    headers: {
      authToken,
    },
  });

export const emptyUserCart = async (authToken) =>
  await axios.delete(process.env.REACT_APP_API + "/user/cart", {
    headers: {
      authToken,
    },
  });

export const saveUserAddress = async (authToken, address, homeAddress, coupon) =>
  await axios.post(
    process.env.REACT_APP_API + "/user/address",
    { address, homeAddress, coupon },
    {
      headers: {
        authToken,
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
    },
  });

export const getUserOrder = async (orderId, authToken) =>
  await axios.get(process.env.REACT_APP_API + "/user/order/" + orderId, {
    headers: {
      authToken,
    },
  });

export const getWishlist = async (authToken) =>
  await axios.get(process.env.REACT_APP_API + "/user/wishlist", {
    headers: {
      authToken,
    },
  });

export const removeWishlist = async (productId, authToken) =>
  await axios.put(
    process.env.REACT_APP_API + "/user/wishlist/" + productId,
    {},
    {
      headers: {
        authToken,
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
      },
    }
  ); 