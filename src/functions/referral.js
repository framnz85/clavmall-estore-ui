import axios from "axios";

export const getCommissions = async (
    sortkey,
    sort,
    currentPage,
    pageSize,
    authtoken
) =>
    await axios.post(process.env.REACT_APP_API + "/commission-list", {
        sortkey,
        sort,
        currentPage,
        pageSize
    }, {
        headers: {
            authtoken,
            estoreid: process.env.REACT_APP_ESTORE_ID,
        },
    });

export const getReferrals = async (
    sortkey,
    sort,
    currentPage,
    pageSize,
    authtoken
) =>
    await axios.post(process.env.REACT_APP_API + "/referral-list", {
        sortkey,
        sort,
        currentPage,
        pageSize
    }, {
        headers: {
            authtoken,
            estoreid: process.env.REACT_APP_ESTORE_ID,
        },
    });

export const getReferralOrders = async (
    sortkey,
    sort,
    currentPage,
    pageSize,
    authtoken
) =>
    await axios.post(process.env.REACT_APP_API + "/referral-orders", {
        sortkey,
        sort,
        currentPage,
        pageSize
    }, {
        headers: {
            authtoken,
            estoreid: process.env.REACT_APP_ESTORE_ID,
        },
    });

export const createCommission = async (
    values,
    authtoken
) =>
    await axios.post(process.env.REACT_APP_API + "/referral-create", values, {
        headers: {
            authtoken,
            estoreid: process.env.REACT_APP_ESTORE_ID,
        },
    });

export const getAllCommissions = async (
    sortkey,
    sort,
    currentPage,
    pageSize,
    authtoken
) =>
    await axios.post(process.env.REACT_APP_API + "/all-commission-list", {
        sortkey,
        sort,
        currentPage,
        pageSize
    }, {
        headers: {
            authtoken,
            estoreid: process.env.REACT_APP_ESTORE_ID,
        },
    });

export const editCommissionStatus = async (commid, status, authtoken) =>
    await axios.put(process.env.REACT_APP_API + "/update-commission-status", { commid, status }, {
        headers: {
            authtoken,
            estoreid: process.env.REACT_APP_ESTORE_ID,
        },
    });

export const withdrawReferral = async (values, authToken) =>
  await axios.post(process.env.REACT_APP_API + "/referral-withdraw", {values}, {
    headers: {
      authToken,
      estoreid: process.env.REACT_APP_ESTORE_ID,
    },
  });

export const getAllWithdrawal = async (
    sortkey,
    sort,
    currentPage,
    pageSize,
    authtoken
) =>
    await axios.post(process.env.REACT_APP_API + "/all-withdrawal-list", {
        sortkey,
        sort,
        currentPage,
        pageSize
    }, {
        headers: {
            authtoken,
            estoreid: process.env.REACT_APP_ESTORE_ID,
        },
    });