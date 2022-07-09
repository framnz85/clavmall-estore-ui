import axios from "axios";

export const createParent = async (parent, authToken) =>
  await axios.post(process.env.REACT_APP_API + "/parent", parent, {
    headers: {
      authToken,
      estoreid: process.env.REACT_APP_ESTORE_ID,
    },
  });

export const getParents = async (count) =>
  await axios.get(process.env.REACT_APP_API + "/parents/" + count,
    {
      headers: {
        estoreid: process.env.REACT_APP_ESTORE_ID,
      },
    });

export const removeParent = async (slug, authToken) =>
  await axios.delete(process.env.REACT_APP_API + "/parent/" + slug, {
    headers: {
      authToken,
      estoreid: process.env.REACT_APP_ESTORE_ID,
    },
  });

export const updateParent = async (slug, parent, authToken) =>
  await axios.put(process.env.REACT_APP_API + "/parent/" + slug, parent, {
    headers: {
      authToken,
      estoreid: process.env.REACT_APP_ESTORE_ID,
    },
  });

export const getProductByParent = async (parid, address) =>
  await axios.post(process.env.REACT_APP_API + "/parent/products/" + parid, {
    address,
  }, {
    headers: {
      estoreid: process.env.REACT_APP_ESTORE_ID,
    },
  });
