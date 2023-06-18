import axios from "axios";

export const getAllCountry = async () =>
    await axios.get(process.env.REACT_APP_API + "/address/country");

export const getAllAddiv1 = async (couid, coucode) =>
    await axios.get(
        process.env.REACT_APP_API +
        "/address/addiv1/" +
        couid +
        "/?coucode=" +
        coucode
    );

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

export const getAddiv3 = async (coucode, addiv3) =>
    await axios.get(
        process.env.REACT_APP_API +
        "/address/locate/" +
        addiv3 +
        "/?coucode=" +
        coucode
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

export const getAllMyCountry = async () =>
    await axios.get(process.env.REACT_APP_API + "/address/mycountry",
        {
            headers: {
                estoreid: process.env.REACT_APP_ESTORE_ID,
            },
        });

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