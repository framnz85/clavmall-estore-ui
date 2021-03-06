import axios from "axios";

export const createOrUpdateUser = async (authToken, address) => {
  return await axios.post(
    process.env.REACT_APP_API + "/create-or-update-user",
    { address },
    {
      headers: {
        authToken,
        estoreid: process.env.REACT_APP_ESTORE_ID,
      },
    }
  );
};

export const currentUser = async (authToken) => {
  return await axios.post(
    process.env.REACT_APP_API + "/current-user",
    {},
    {
      headers: {
        authToken,
        estoreid: process.env.REACT_APP_ESTORE_ID,
      },
    }
  );
};

export const currentAdmin = async (authToken) => {
  return await axios.post(
    process.env.REACT_APP_API + "/current-admin",
    {},
    {
      headers: {
        authToken,
        estoreid: process.env.REACT_APP_ESTORE_ID,
      },
    }
  );
};

export const updateEmailAddress = async (oldEmail, authToken) => {
  return await axios.put(
    process.env.REACT_APP_API + "/update-email-address",
    {oldEmail},
    {
      headers: {
        authToken,
        estoreid: process.env.REACT_APP_ESTORE_ID,
      },
    }
  );
};
