import axios from "axios";

export const getEstoreInfo = async (estid) =>
  await axios.get(process.env.REACT_APP_API + "/setting/information/" + estid);

export const getEstore = async (estid, authToken) =>
  await axios.get(process.env.REACT_APP_API + "/setting/estore/" + estid, {
    headers: {
      authToken,
    },
  });

export const getEstoreChanges = async (estid) =>
  await axios.get(process.env.REACT_APP_API + "/setting/changes/" + estid);

export const updateEstore = async (estid, values, authToken) =>
  await axios.put(
    process.env.REACT_APP_API + "/setting/estoreupdate/" + estid,
    values,
    {
      headers: {
        authToken,
      },
    }
  );

export const updateChanges = async (estid, property, authToken) =>
  await axios.put(
    process.env.REACT_APP_API + "/setting/updatechanges/" + estid,
    { property },
    {
      headers: {
        authToken,
      },
    }
  );

export const copyAllAddiv1 = async (country, details, authToken) => {
  await axios.put(
    process.env.REACT_APP_API + "/setting/copyalladdiv1",
    { country, details },
    {
      headers: {
        authToken,
      },
    }
  );
};

export const saveCreatedLocation1 = async (values, details, authToken) => {
  await axios.put(
    process.env.REACT_APP_API + "/setting/savecreatedlocation1",
    { values, details },
    {
      headers: {
        authToken,
      },
    }
  );
};

export const copyAllAddiv2 = async (country, addiv1, details, authToken) => {
  await axios.put(
    process.env.REACT_APP_API + "/setting/copyalladdiv2",
    { country, addiv1, details },
    {
      headers: {
        authToken,
      },
    }
  );
};

export const saveCreatedLocation2 = async (values, details, authToken) => {
  await axios.put(
    process.env.REACT_APP_API + "/setting/savecreatedlocation2",
    { values, details },
    {
      headers: {
        authToken,
      },
    }
  );
};

export const copyAllAddiv3 = async (
  country,
  addiv1,
  addiv2,
  details,
  authToken
) => {
  await axios.put(
    process.env.REACT_APP_API + "/setting/copyalladdiv3",
    { country, addiv1, addiv2, details },
    {
      headers: {
        authToken,
      },
    }
  );
};

export const saveCreatedLocation3 = async (values, details, authToken) => {
  await axios.put(
    process.env.REACT_APP_API + "/setting/savecreatedlocation3",
    { values, details },
    {
      headers: {
        authToken,
      },
    }
  );
};

export const saveLocation3 = async (
  country,
  addiv1,
  addiv2,
  addiv3,
  details,
  authToken
) => {
  await axios.put(
    process.env.REACT_APP_API + "/setting/savelocation3",
    { country, addiv1, addiv2, addiv3, details },
    {
      headers: {
        authToken,
      },
    }
  );
};

export const deleteAddiv3 = async (couCode, addiv3Id, authToken) => {
  await axios.delete(
    process.env.REACT_APP_API +
      "/setting/deleteaddiv3/?coucode=" +
      couCode +
      "&addiv3=" +
      addiv3Id,
    {
      headers: {
        authToken,
      },
    }
  );
};

export const deleteAddiv2 = async (couCode, addiv2Id, authToken) => {
  await axios.delete(
    process.env.REACT_APP_API +
      "/setting/deleteaddiv2/?coucode=" +
      couCode +
      "&addiv2=" +
      addiv2Id,
    {
      headers: {
        authToken,
      },
    }
  );
};

export const deleteAddiv1 = async (couCode, addiv1Id, authToken) => {
  await axios.delete(
    process.env.REACT_APP_API +
      "/setting/deleteaddiv1/?coucode=" +
      couCode +
      "&addiv1=" +
      addiv1Id,
    {
      headers: {
        authToken,
      },
    }
  );
};
