import axios from "axios";

export const createCategory = async (category, authToken) =>
  await axios.post(process.env.REACT_APP_API + "/category", category, {
    headers: {
      authToken,
      estoreid: process.env.REACT_APP_ESTORE_ID,
    },
  });

export const getCategories = async (address) =>
  await axios.post(process.env.REACT_APP_API + "/categories", { address },
    {
      headers: {
        estoreid: process.env.REACT_APP_ESTORE_ID,
      },
    });

export const updateCategory = async (slug, category, authToken) =>
  await axios.put(process.env.REACT_APP_API + "/category/" + slug, category, {
    headers: {
      authToken,
      estoreid: process.env.REACT_APP_ESTORE_ID,
    },
  });

export const removeCategory = async (slug, authToken) =>
  await axios.delete(process.env.REACT_APP_API + "/category/" + slug, {
    headers: {
      authToken,
      estoreid: process.env.REACT_APP_ESTORE_ID,
    },
  });

export const getCategorySubcats = async (_id) =>
  await axios.get(process.env.REACT_APP_API + "/category/subcats/" + _id,
    {
      headers: {
        estoreid: process.env.REACT_APP_ESTORE_ID,
      },
    });

export const getCategoryParents = async (_id) =>
  await axios.get(process.env.REACT_APP_API + "/category/parents/" + _id,
    {
      headers: {
        estoreid: process.env.REACT_APP_ESTORE_ID,
      },
    });

export const getProductByCategory = async (_id, address) =>
  await axios.post(process.env.REACT_APP_API + "/categories/product/" + _id, {
    address,
  },
    {
      headers: {
        estoreid: process.env.REACT_APP_ESTORE_ID,
      },
    });

export const imageupdate = async (slug, images, authtoken) =>
  axios.put(
      `${process.env.REACT_APP_API}/category/imageupdate/${slug}`,
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
