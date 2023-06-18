import axios from "axios";

export const getAddiv3 = async (coucode, addiv3) =>
  await axios.get(
    process.env.REACT_APP_API +
      "/address/locate/" +
      addiv3 +
      "/?coucode=" +
      coucode,
    {
      headers: {
        estoreid: process.env.REACT_APP_ESTORE_ID,
      },
    }
  );

export const getNewAdded3 = async (coucode, authToken) =>
  await axios.get(
    process.env.REACT_APP_API + "/address/myaddiv3/?coucode=" + coucode,
    {
      headers: {
        authToken,
        estoreid: process.env.REACT_APP_ESTORE_ID,
      },
    }
  );

export const getAllAddiv3 = async (couid, addiv1, addiv2, coucode) =>
  await axios.get(
    process.env.REACT_APP_API +
      "/address/addiv3/" +
      couid +
      "/" +
      addiv1 +
      "/" +
      addiv2 +
      "/?coucode=" +
      coucode
  );

export const getAllMyAddiv3 = async (couid, addiv1, addiv2, coucode) =>
  await axios.get(
    process.env.REACT_APP_API +
      "/address/myaddiv3/" +
      couid +
      "/" +
      addiv1 +
      "/" +
      addiv2 +
      "/?coucode=" +
      coucode,
        {
            headers: {
                estoreid: process.env.REACT_APP_ESTORE_ID,
            },
        }
  );

export const updateMyAddiv3 = async (coucode, addiv3, values, authToken) =>
  await axios.put(
    process.env.REACT_APP_API +
      "/address/updatemyaddiv3/" +
      addiv3 +
      "/?coucode=" +
      coucode,
    values,
    {
      headers: {
        authToken,
        estoreid: process.env.REACT_APP_ESTORE_ID,
      },
    }
  );
