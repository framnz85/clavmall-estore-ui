import axios from "axios";

export const createSubcat = async (subcat, authToken) =>
  await axios.post(process.env.REACT_APP_API + "/subcat", subcat, {
    headers: {
      authToken,
      estoreid: process.env.REACT_APP_ESTORE_ID,
    },
  });

export const getSubcats = async (count) =>
  await axios.get(process.env.REACT_APP_API + "/subcats/" + count, {
    headers: {
      estoreid: process.env.REACT_APP_ESTORE_ID,
    },
  });

export const removeSubcat = async (slug, authToken) =>
  await axios.delete(process.env.REACT_APP_API + "/subcat/" + slug, {
    headers: {
      authToken,
      estoreid: process.env.REACT_APP_ESTORE_ID,
    },
  });

export const updateSubcat = async (slug, subcat, authToken) =>
  await axios.put(process.env.REACT_APP_API + "/subcat/" + slug, subcat, {
    headers: {
      authToken,
      estoreid: process.env.REACT_APP_ESTORE_ID,
    },
  });

export const getProductBySubcat = async (subid, address) =>
  await axios.post(process.env.REACT_APP_API + "/subcat/products/" + subid, {
    address
  }, {
    headers: {
      estoreid: process.env.REACT_APP_ESTORE_ID,
    },
  });
