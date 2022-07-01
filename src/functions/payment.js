import axios from "axios";

export const getAllPayments = async () =>
  await axios.get(process.env.REACT_APP_API + "/payment/payments");

export const getAllMyPayments = async (address) =>
  await axios.post(process.env.REACT_APP_API + "/payment/mypayments",
    { address }
  );

export const getMyPayment = async (payid) =>
  await axios.get(process.env.REACT_APP_API + "/payment/mypayment/" + payid);

export const createMyPayment = async (payment, authToken) =>
  await axios.post(process.env.REACT_APP_API + "/payment/mypayment", payment, {
    headers: {
      authToken,
    },
  });

export const updateMyPayment = async (payment, authToken) =>
  await axios.put(process.env.REACT_APP_API + "/payment/mypayment", payment, {
    headers: {
      authToken,
    },
  });

export const deleteMyPayment = async (payid, authToken) =>
  await axios.delete(
    process.env.REACT_APP_API + "/payment/mypayment/" + payid,
    {
      headers: {
        authToken,
      },
    }
  );
