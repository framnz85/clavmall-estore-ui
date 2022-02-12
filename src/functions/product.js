import axios from "axios";

export const createProduct = async (product, authToken) =>
  await axios.post(process.env.REACT_APP_API + "/product", product, {
    headers: {
      authToken,
    },
  });

export const getProduct = async (slug) =>
  await axios.get(process.env.REACT_APP_API + "/product/" + slug);

export const getProducts = async (sort, order, page, itemPerPage) =>
  await axios.post(process.env.REACT_APP_API + "/products", {
    sort,
    order,
    page,
    itemPerPage,
  });

export const updateProduct = async (slug, product, authToken) =>
  await axios.put(process.env.REACT_APP_API + "/product/" + slug, product, {
    headers: {
      authToken,
    },
  });

export const removeProduct = async (slug, authToken) =>
  await axios.delete(process.env.REACT_APP_API + "/product/" + slug, {
    headers: {
      authToken,
    },
  });

export const getRandomProducts = async (count, catId) =>
  catId
    ? await axios.post(
        process.env.REACT_APP_API +
          "/products/random/" +
          count +
          "/?catId=" +
          catId
      )
    : await axios.post(process.env.REACT_APP_API + "/products/random/" + count);

export const getProductsCount = async () =>
  await axios.get(process.env.REACT_APP_API + "/products/total");

export const productStar = async (productId, star, authToken) =>
  await axios.put(
    process.env.REACT_APP_API + "/product/star/" + productId,
    { star },
    {
      headers: {
        authToken,
      },
    }
  );

export const getRelated = async (productId) =>
  await axios.get(process.env.REACT_APP_API + "/product/related/" + productId);

export const getParent = async (productId) =>
  await axios.get(process.env.REACT_APP_API + "/product/parent/" + productId);

export const fetchProductByFilter = async (arg, count) =>
  await axios.post(process.env.REACT_APP_API + "/search/filters/" + count, arg);
