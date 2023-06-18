import axios from "axios";

export const getAffiliates = async (
  sortkey,
  sort,
  currentPage,
  pageSize
) =>
  await axios.post(process.env.REACT_APP_API + "/affiliate-list", {
    sortkey,
    sort,
    currentPage,
    pageSize
  }, {
    headers: {
      estoreid: process.env.REACT_APP_ESTORE_ID,
    },
  });

export const withdrawCommission = async (user, product, values, authToken) =>
  await axios.post(process.env.REACT_APP_API + "/affiliate-withdraw", {user, product, values}, {
    headers: {
      authToken,
      estoreid: process.env.REACT_APP_ESTORE_ID,
    },
  });

export const updateWithdraw = async (values, authToken) =>
  await axios.put(process.env.REACT_APP_API + "/affiliate-withdraw", {values}, {
    headers: {
      authToken,
      estoreid: process.env.REACT_APP_ESTORE_ID,
    },
  });

export const getProspects = async (
  sortkey,
  sort,
  currentPage,
  pageSize
) =>
  await axios.post(process.env.REACT_APP_API + "/affiliate-prospects", {
    sortkey,
    sort,
    currentPage,
    pageSize
  }, {
    headers: {
      estoreid: process.env.REACT_APP_ESTORE_ID,
    },
  });