import React from "react";

const AddressDetailsInput = ({ address, setAddress, setAddressSaved }) => {
  return (
    <input
      type="text"
      name="address"
      className="form-control"
      value={address.details ? address.details : ""}
      onChange={(e) => {
        setAddressSaved(false);
        setAddress({ ...address, details: e.target.value });
      }}
      placeholder="Place here"
    />
  );
};

export default AddressDetailsInput;
