import axios from "axios";

export const getGroceyResonse = async (message, openaiAPI, coucode) =>
  await axios.post(
    process.env.REACT_APP_API + "/chat/grocey-response/?coucode=" + coucode,
    {
      message,
      openaiAPI,
    },
    {
      headers: {
        estoreid: process.env.REACT_APP_ESTORE_ID,
      },
    }
  );
