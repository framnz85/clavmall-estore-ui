import axios from "axios";

export const createParent = async (parent, authToken) =>
  await axios.post(process.env.REACT_APP_API + "/parent", parent, {
    headers: {
      authToken,
    },
  });

export const getParents = async () =>
  await axios.get(process.env.REACT_APP_API + "/parents");

export const removeParent = async (slug, authToken) =>
  await axios.delete(process.env.REACT_APP_API + "/parent/" + slug, {
    headers: {
      authToken,
    },
  });

export const updateParent = async (slug, parent, authToken) =>
  await axios.put(process.env.REACT_APP_API + "/parent/" + slug, parent, {
    headers: {
      authToken,
    },
  });

export const getProductByParent = async (parid) =>
  await axios.get(process.env.REACT_APP_API + "/parent/products/" + parid);
