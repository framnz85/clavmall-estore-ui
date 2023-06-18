import React from "react";
import ShowingForms from "./ShowingForms";

const NoAvailableProperty = ({
  myValues,
  loading,
  handleMyCountryChange,
  handleMyAddiv1Change,
  handleMyAddiv2Change,
  handleMyAddiv3Change,
}) => {
  const { country, countries, addiv1s, addiv2s, addiv3s } = myValues;

  const formProperty = [
    {
      type: "ant select",
      name: "country",
      style: {
        width: "180px",
        float: "left",
      },
      onChange: handleMyCountryChange,
      defaultValue: "Select Country",
      disabled: loading,
      options: countries.map(
        (country) =>
          (country = {
            ...country,
            key: country._id,
            value: country._id,
            text: country.name,
          })
      ),
      show: true,
    },
    {
      type: "ant select",
      name: "addiv1",
      style: {
        width: "180px",
        float: "left",
      },
      onChange: handleMyAddiv1Change,
      defaultValue: "Select " + country.adDivName1,
      disabled: loading,
      options: addiv1s.map(
        (addiv1) =>
          (addiv1 = {
            ...addiv1,
            key: addiv1._id,
            value: addiv1._id,
            text: addiv1.name,
          })
      ),
      show: true,
    },
    {
      type: "ant select",
      name: "addiv2",
      style: {
        width: "180px",
        float: "left",
      },
      onChange: handleMyAddiv2Change,
      defaultValue: "Select " + country.adDivName2,
      disabled: loading,
      options: addiv2s.map(
        (addiv2) =>
          (addiv2 = {
            ...addiv2,
            key: addiv2._id,
            value: addiv2._id,
            text: addiv2.name,
          })
      ),
      show: true,
    },
    {
      type: "ant select",
      name: "addiv3",
      style: {
        width: "180px",
        float: "left",
      },
      onChange: handleMyAddiv3Change,
      defaultValue: "Select " + country.adDivName3,
      disabled: loading,
      options: addiv3s.map(
        (addiv3) =>
          (addiv3 = {
            ...addiv3,
            key: addiv3._id,
            value: addiv3._id,
            text: addiv3.name,
          })
      ),
      show: true,
    },
  ];

  return (
    <>
      <ShowingForms formProperty={formProperty} />
    </>
  );
};

export default NoAvailableProperty;
