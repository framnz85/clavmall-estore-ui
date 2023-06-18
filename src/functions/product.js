import axios from "axios";

export const createProduct = async (product, authToken) =>
  await axios.post(process.env.REACT_APP_API + "/product", product, {
    headers: {
      authToken,
      estoreid: process.env.REACT_APP_ESTORE_ID,
    },
  });

export const getProduct = async (slug) =>
  await axios.get(process.env.REACT_APP_API + "/product/" + slug, {
    headers: {
      estoreid: process.env.REACT_APP_ESTORE_ID,
    },
  });

export const getProducts = async (
  sortkey,
  sort,
  currentPage,
  pageSize,
  searchQuery,
  category,
  subcat,
  parent
) =>
  await axios.post(process.env.REACT_APP_API + "/products", {
    sortkey,
    sort,
    currentPage,
    pageSize,
    searchQuery,
    category,
    subcat,
    parent
  }, {
    headers: {
      estoreid: process.env.REACT_APP_ESTORE_ID,
    },
  });

export const updateProduct = async (slug, product, authToken) =>
  await axios.put(process.env.REACT_APP_API + "/product/" + slug, product, {
    headers: {
      authToken,
      estoreid: process.env.REACT_APP_ESTORE_ID,
    },
  });

export const removeProduct = async (slug, authToken) =>
  await axios.delete(process.env.REACT_APP_API + "/product/" + slug, {
    headers: {
      authToken,
      estoreid: process.env.REACT_APP_ESTORE_ID,
    },
  });

export const getRandomProducts = async (count, address) =>
  await axios.post(process.env.REACT_APP_API + "/products/random/" + count, { address }, {
    headers: {
      estoreid: process.env.REACT_APP_ESTORE_ID,
    },
  });

export const productStar = async (productId, star, authToken) =>
  await axios.put(
    process.env.REACT_APP_API + "/product/star/" + productId,
    { star },
    {
      headers: {
        authToken,
        estoreid: process.env.REACT_APP_ESTORE_ID,
      },
    }
  );

export const getRelated = async (productId) =>
  await axios.get(process.env.REACT_APP_API + "/product/related/" + productId,
    {
      headers: {
        estoreid: process.env.REACT_APP_ESTORE_ID,
      },
    });

export const getParent = async (productId) =>
  await axios.get(process.env.REACT_APP_API + "/product/parent/" + productId,
    {
      headers: {
        estoreid: process.env.REACT_APP_ESTORE_ID,
      },
    });

export const fetchProductByFilter = async (arg, count, address) =>
  await axios.post(process.env.REACT_APP_API + "/search/filters/" + count, {
    arg,
    address,
  },
  {
    headers: {
      estoreid: process.env.REACT_APP_ESTORE_ID,
    },
  });

export const imageupdate = async (slug, images, authtoken) =>
  axios.put(
      `${process.env.REACT_APP_API}/product/imageupdate/${slug}`,
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

export const bulkChangePrice = async (values, authtoken) =>
  axios.put(
      `${process.env.REACT_APP_API}/product/changeprice/bulk`,
      {
        values,
      },
      {
        headers: {
          authtoken,
          estoreid: process.env.REACT_APP_ESTORE_ID,
        },
      }
  );

 export const bulkChangeMarkup = async (values, authtoken) =>
  axios.put(
      `${process.env.REACT_APP_API}/product/changemarkup/bulk`,
      {
        values,
      },
      {
        headers: {
          authtoken,
          estoreid: process.env.REACT_APP_ESTORE_ID,
        },
      }
  );
    
export const bulkDeleteProducts = async (values, authtoken) =>
  axios.put(
      `${process.env.REACT_APP_API}/product/deleteproduct/bulk`,
      {
        values,
      },
      {
        headers: {
          authtoken,
          estoreid: process.env.REACT_APP_ESTORE_ID,
        },
      }
  );

  export const bulkChangeStatus = async (values, authtoken) =>
  axios.put(
      `${process.env.REACT_APP_API}/product/statusproduct/bulk`,
      {
        values,
      },
      {
        headers: {
          authtoken,
          estoreid: process.env.REACT_APP_ESTORE_ID,
        },
      }
  );

  export const bulkChangeReferral = async (values, authtoken) =>
  axios.put(
      `${process.env.REACT_APP_API}/product/referralproduct/bulk`,
      {
        values,
      },
      {
        headers: {
          authtoken,
          estoreid: process.env.REACT_APP_ESTORE_ID,
        },
      }
  );