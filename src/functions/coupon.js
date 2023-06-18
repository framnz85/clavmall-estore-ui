import axios from "axios";

export const getCoupon = async () =>
  await axios.get(process.env.REACT_APP_API + "/coupons",
    {
      headers: {
        estoreid: process.env.REACT_APP_ESTORE_ID,
      },
    });

export const removeCoupon = async (couponId, authToken) =>
  await axios.delete(process.env.REACT_APP_API + "/coupon/" + couponId, {
    headers: {
      authToken,
      estoreid: process.env.REACT_APP_ESTORE_ID,
    },
  });

export const createCoupon = async (coupon, authToken) =>
  await axios.post(
    process.env.REACT_APP_API + "/coupon",
    { coupon },
    {
      headers: {
        authToken,
        estoreid: process.env.REACT_APP_ESTORE_ID,
      },
    }
  );

export const updateCoupon = async (couponId, activate, authToken) =>
  await axios.put(process.env.REACT_APP_API + "/coupon-activate/" + couponId,
    { activate },
    {
      headers: {
        authToken,
        estoreid: process.env.REACT_APP_ESTORE_ID,
      },
    }
  );
