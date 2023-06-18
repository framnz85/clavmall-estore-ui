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

export const getParentsWithCatids = async (catids) =>
  await axios.post(process.env.REACT_APP_API + "/parents-with-catids/", {catids}, {
    headers: {
      estoreid: process.env.REACT_APP_ESTORE_ID,
    },
  });

export const removeParent = async (parent, slug, authToken) =>
  await axios.delete(process.env.REACT_APP_API + "/parent/" + parent + "/" + slug, {
    headers: {
      authToken,
      estoreid: process.env.REACT_APP_ESTORE_ID,
    },
  });

export const updateParent = async (parSlug, slug, parent, authToken) =>
  await axios.put(process.env.REACT_APP_API + "/parent/" + parSlug + "/" + slug, parent, {
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
