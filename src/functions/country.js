import axios from "axios";

export const getAllCountry = async () =>
  await axios.get(process.env.REACT_APP_API + "/address/country");

export const getAllMyCountry = async () =>
  await axios.get(process.env.REACT_APP_API + "/address/mycountry",
    {
      headers: {
        estoreid: process.env.REACT_APP_ESTORE_ID,
      },
    });
