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
    },
  });
};

export const getOrder = async (orderId, authToken) =>
  await axios.get(process.env.REACT_APP_API + "/admin/order/" + orderId, {
    headers: {
      authToken,
    },
  });

export const changeStatus = async (data, authToken) => {
  return await axios.put(
    process.env.REACT_APP_API + "/admin/order-status",
    { data },
    {
      headers: {
        authToken,
      },
    }
  );
};

export const uploadFileImage = async (image, estore, authToken) => {
  const uploadUrl = estore.imageStorage === "clavmall"
    ? `${process.env.REACT_APP_CLAVMALL_IMG}/estore_functions/?estoreId=${estore._id}`
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
    ? `${process.env.REACT_APP_CLAVMALL_IMG}/estore_functions/removeimage.php?estoreId=${estore._id}`
    : `${process.env.REACT_APP_API}/removeimage`;
  
  return await axios.post(uploadUrl, { public_id },
    {
      headers: {
        authToken,
      },
    }
  );
};