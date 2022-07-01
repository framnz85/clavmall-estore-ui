import axios from "axios";

export const createCategory = async (category, authToken) =>
  await axios.post(process.env.REACT_APP_API + "/category", category, {
    headers: {
      authToken,
    },
  });

export const getCategories = async (address) =>
  await axios.post(process.env.REACT_APP_API + "/categories", { address });

export const updateCategory = async (slug, category, authToken) =>
  await axios.put(process.env.REACT_APP_API + "/category/" + slug, category, {
    headers: {
      authToken,
    },
  });

export const removeCategory = async (slug, authToken) =>
  await axios.delete(process.env.REACT_APP_API + "/category/" + slug, {
    headers: {
      authToken,
    },
  });

export const getCategorySubcats = async (_id) =>
  await axios.get(process.env.REACT_APP_API + "/category/subcats/" + _id);

export const getProductByCategory = async (_id, address) =>
  await axios.post(process.env.REACT_APP_API + "/categories/product/" + _id, {
    address,
  });
