import axios from "axios";

export const createPaymentIntent = async (authToken) =>
  await axios.post(
    process.env.REACT_APP_API + "/create-payment-intent",
    {},
    {
      headers: {
        authToken,
      },
    }
  );

export const getCartTotals = async (authToken) =>
  await axios.post(
    process.env.REACT_APP_API + "/get-cart-totals",
    {},
    {
      headers: {
        authToken,
      },
    }
  );

export const getSubGrandTotal = async (authToken) =>
  await axios.post(
    process.env.REACT_APP_API + "/get-subgrand-total",
    {},
    {
      headers: {
        authToken,
      },
    }
  );