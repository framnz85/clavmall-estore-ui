import axios from "axios";

export const createSubcat = async (subcat, authToken) =>
  await axios.post(process.env.REACT_APP_API + "/subcat", subcat, {
    headers: {
      authToken,
    },
  });

export const getSubcats = async () =>
  await axios.get(process.env.REACT_APP_API + "/subcats");

export const removeSubcat = async (slug, authToken) =>
  await axios.delete(process.env.REACT_APP_API + "/subcat/" + slug, {
    headers: {
      authToken,
    },
  });

export const updateSubcat = async (slug, subcat, authToken) =>
  await axios.put(process.env.REACT_APP_API + "/subcat/" + slug, subcat, {
    headers: {
      authToken,
    },
  });

export const getProductBySubcat = async (subid) =>
  await axios.get(process.env.REACT_APP_API + "/subcat/products/" + subid);
