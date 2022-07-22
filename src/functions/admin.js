import axios from "axios";

export const getOrders = async (
  sortkey,
  sort,
  currentPage,
  pageSize,
  searchQuery,
  minPrice,
  maxPrice,
  dateFrom,
  dateTo,
  status,
  payment,
  authToken
) => {
  return await axios.post(process.env.REACT_APP_API + "/admin/orders", {
    sortkey,
    sort,
    currentPage,
    pageSize,
    searchQuery,
    minPrice,
    maxPrice,
    dateFrom,
    dateTo,
    status,
    payment,
  }, {
    headers: {
      authToken,
      estoreid: process.env.REACT_APP_ESTORE_ID,
    },
  });
};

export const getOrder = async (orderId, authToken) =>
  await axios.get(process.env.REACT_APP_API + "/admin/order/" + orderId, {
    headers: {
      authToken,
      estoreid: process.env.REACT_APP_ESTORE_ID,
    },
  });

export const changeStatus = async (data, authToken) => {
  return await axios.put(
    process.env.REACT_APP_API + "/admin/order-status",
    { data },
    {
      headers: {
        authToken,
        estoreid: process.env.REACT_APP_ESTORE_ID,
      },
    }
  );
};

export const uploadFileImage = async (image, estore, authToken) => {
  const uploadUrl = estore.imageStorage === "clavmall"
    ? `${process.env.REACT_APP_CLAVMALL_IMG}/estore_functions/estore${estore._id}/?estoreId=${estore._id}`
    : `${process.env.REACT_APP_API}/uploadimages`;
  
  return await axios.post(uploadUrl, { image },
    {
      headers: {
        authToken,
      },
    }
  );
};

export const removeFileImage = async (public_id, estore, authToken) => {
  const uploadUrl = estore.imageStorage === "clavmall"
    ? `${process.env.REACT_APP_CLAVMALL_IMG}/estore_functions/estore${estore._id}/removeimage.php?estoreId=${estore._id}`
    : `${process.env.REACT_APP_API}/removeimage`;
  
  return await axios.post(uploadUrl, { public_id },
    {
      headers: {
        authToken,
      },
    }
  );
};

export const checkImageUser = async (public_id, authToken) => {  
  return await axios.get(`${process.env.REACT_APP_API}/admin/check-image-user/${public_id}`,
    {
      headers: {
        authToken,
        estoreid: process.env.REACT_APP_ESTORE_ID,
      },
    }
  );
};