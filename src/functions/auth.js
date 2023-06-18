import axios from "axios";

export const generateAuthToken = async (user) => {
  return await axios.post(
    process.env.REACT_APP_API + "/generate-authtoken",
    { user },
    {
      headers: {
        estoreid: process.env.REACT_APP_ESTORE_ID,
      },
    }
  );
};

export const existUserAuthToken = async (email, phone, password) => {
  return await axios.post(
    process.env.REACT_APP_API + "/existuser-authtoken",
    { email, phone, password },
    {
      headers: {
        estoreid: process.env.REACT_APP_ESTORE_ID,
      },
    }
  );
};

export const loginAsAuthToken = async (email, phone, authToken) => {
  return await axios.post(
    process.env.REACT_APP_API + "/loginas-authtoken",
    { email, phone },
    {
      headers: {
        authToken,
        estoreid: process.env.REACT_APP_ESTORE_ID,
      },
    }
  );
};

export const createOrUpdateUser = async (authToken, values) => {
  return await axios.post(
    process.env.REACT_APP_API + "/create-or-update-user",
    { values },
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

export const setDefaultPassword = async (userid, authToken) => {
  return await axios.put(
    process.env.REACT_APP_API + "/user-default-password",
    {userid},
    {
      headers: {
        authToken,
        estoreid: process.env.REACT_APP_ESTORE_ID,
      },
    }
  );
};

export const updateRole = async (userid, role, authToken) => {
  return await axios.put(
    process.env.REACT_APP_API + "/user-updaterole",
    {userid, role},
    {
      headers: {
        authToken,
        estoreid: process.env.REACT_APP_ESTORE_ID,
      },
    }
  );
};

export const deleteUser = async (userid, authToken) => {
  return await axios.delete(
    process.env.REACT_APP_API + "/user-delete/" + userid,
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

export const updateUserPassword = async (oldPassword, newPassword, authToken) => {
  return await axios.put(
    process.env.REACT_APP_API + "/update-user-password",
    {oldPassword, newPassword},
    {
      headers: {
        authToken,
        estoreid: process.env.REACT_APP_ESTORE_ID,
      },
    }
  );
};
