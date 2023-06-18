import axios from "axios";

export const getAllPayments = async () =>
  await axios.get(process.env.REACT_APP_API + "/payment/payments",
    {
      headers: {
        estoreid: process.env.REACT_APP_ESTORE_ID,
      },
    });

export const getAllMyPayments = async (address) =>
  await axios.post(process.env.REACT_APP_API + "/payment/mypayments",
    { address },
    {
      headers: {
        estoreid: process.env.REACT_APP_ESTORE_ID,
      },
    }
  );

export const getMyPayment = async (payid) =>
  await axios.get(process.env.REACT_APP_API + "/payment/mypayment/" + payid,
    {
      headers: {
        estoreid: process.env.REACT_APP_ESTORE_ID,
      },
    });

export const createMyPayment = async (payment, authToken) =>
  await axios.post(process.env.REACT_APP_API + "/payment/mypayment", payment, {
    headers: {
      authToken,
      estoreid: process.env.REACT_APP_ESTORE_ID,
    },
  });

export const updateMyPayment = async (payment, authToken) =>
  await axios.put(process.env.REACT_APP_API + "/payment/mypayment", payment, {
    headers: {
      authToken,
      estoreid: process.env.REACT_APP_ESTORE_ID,
    },
  });

export const deleteMyPayment = async (payid, authToken) =>
  await axios.delete(
    process.env.REACT_APP_API + "/payment/mypayment/" + payid,
    {
      headers: {
        authToken,
        estoreid: process.env.REACT_APP_ESTORE_ID,
      },
    }
  );

export const imageupdate = async (payid, images, authtoken) =>
  axios.put(
      `${process.env.REACT_APP_API}/payment/imageupdate/${payid}`,
      {
        images,
      },
      {
        headers: {
          authtoken,
          estoreid: process.env.REACT_APP_ESTORE_ID,
        },
      }
    );
