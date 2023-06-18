import axios from "axios";

export const getAllProduct = async (authToken) =>
  await axios.get(process.env.REACT_APP_API + "/export-all-products", {
    headers: {
      authToken,
      estoreid: process.env.REACT_APP_ESTORE_ID,
    },
  });

export const updateProducts = async (products, authToken) =>
  await axios.put(process.env.REACT_APP_API + "/import-products", {
    products
  }, {
    headers: {
      authToken,
      estoreid: process.env.REACT_APP_ESTORE_ID,
    },
  });