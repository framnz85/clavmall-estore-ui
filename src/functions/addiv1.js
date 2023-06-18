import axios from "axios";

export const getAllAddiv1 = async (couid, coucode) =>
  await axios.get(
    process.env.REACT_APP_API +
      "/address/addiv1/" +
      couid +
      "/?coucode=" +
      coucode
  );

export const getAllMyAddiv1 = async (couid, coucode) =>
  await axios.get(
    process.env.REACT_APP_API +
      "/address/myaddiv1/" +
      couid +
      "/?coucode=" +
      coucode,
    {
      headers: {
        estoreid: process.env.REACT_APP_ESTORE_ID,
      },
    }
  );
