import axios from "axios";

export const getAllAddiv2 = async (couid, addiv1, coucode) =>
  await axios.get(
    process.env.REACT_APP_API +
      "/address/addiv2/" +
      couid +
      "/" +
      addiv1 +
      "/?coucode=" +
      coucode
  );

export const getAllMyAddiv2 = async (couid, addiv1, coucode) =>
  await axios.get(
    process.env.REACT_APP_API +
      "/address/myaddiv2/" +
      couid +
      "/" +
      addiv1 +
      "/?coucode=" +
      coucode,
    {
      headers: {
        estoreid: process.env.REACT_APP_ESTORE_ID,
      },
    }
  );
