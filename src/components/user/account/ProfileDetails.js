import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import _ from "lodash";
import Joi from "joi-browser";
import { Button } from "antd";
import PhoneInput from "react-phone-number-input";

import "react-phone-number-input/style.css";

import DeliveryAddress from "./DeliveryAddress";
import HomeAddress from "./HomeAddress";
import { updateProfile } from "../../../functions/user";

const initialState = {
  name: "",
  phone: "",
  address: {
    country: {},
    addiv1: {},
    addiv2: {},
    addiv3: {},
    details: "",
  },
  homeAddress: {
    country: {},
    addiv1: {},
    addiv2: {},
    addiv3: {},
    details: "",
  },
};

const ProfileDetails = () => {
  let dispatch = useDispatch();

  const { user } = useSelector((state) => ({ ...state }));

  const [values, setValues] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [addressError, setAddressError] = useState({
    address: {
      country: "",
      addiv1: "",
      addiv2: "",
      addiv3: "",
      details: "",
    },
    homeAddress: {
      country: "",
      addiv1: "",
      addiv2: "",
      addiv3: "",
      details: "",
    },
  });

  useEffect(() => {
    setValues({
      ...values,
      name: user.name,
      phone: user.phone,
      address: user.address,
      homeAddress: user.homeAddress,
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const schema = {
    name: Joi.string().required(),
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validate = Joi.validate({ name: values.name }, schema, {
      abortEarly: false,
    });

    if (validate.error) {
      for (let item of validate.error.details) toast.error(item.message);
      return;
    }

    let errorActive = false;
    let errorList1 = {};
    let errorList2 = {};

    if (_.isEmpty(values.address.country)) {
      errorActive = true;
      errorList1 = { ...errorList1, country: "Delivery Country is required" };
    }
    if (_.isEmpty(values.address.addiv1)) {
      errorActive = true;
      errorList1 = { ...errorList1, addiv1: " is required" };
    }
    if (_.isEmpty(values.address.addiv2)) {
      errorActive = true;
      errorList1 = { ...errorList1, addiv2: " is required" };
    }
    if (_.isEmpty(values.address.addiv3)) {
      errorActive = true;
      errorList1 = { ...errorList1, addiv3: " is required" };
    }
    if (!values.address.details) {
      errorActive = true;
      errorList1 = { ...errorList1, details: "Delivery details is required" };
    }
    if (_.isEmpty(values.homeAddress.country)) {
      errorActive = true;
      errorList2 = { ...errorList2, country: "Home Country is required" };
    }
    if (_.isEmpty(values.homeAddress.addiv1)) {
      errorActive = true;
      errorList2 = { ...errorList2, addiv1: " is required" };
    }
    if (_.isEmpty(values.homeAddress.addiv2)) {
      errorActive = true;
      errorList2 = { ...errorList2, addiv2: " is required" };
    }
    if (_.isEmpty(values.homeAddress.addiv3)) {
      errorActive = true;
      errorList2 = { ...errorList2, addiv3: " is required" };
    }
    if (!values.homeAddress.details) {
      errorActive = true;
      errorList2 = { ...errorList2, details: "Home details is required" };
    }

    setAddressError({
      ...addressError,
      address: errorList1,
      homeAddress: errorList2,
    });

    if (!errorActive) {
      setLoading(true);
      updateProfile(values, user.token)
        .then((res) => {
          dispatch({
            type: "LOGGED_IN_USER_VIII",
            payload: values,
          });
          toast.success("Profile successfully updated!");
          setLoading(false);
        })
        .catch((error) => {
          toast.error(error.message);
          setLoading(false);
        });
    }
  };

  return (
    <>
      <h4 style={{ margin: "20px 0" }}>Profile Details</h4>
      <div className="form-group">
        <label>
          <b>Name</b>
        </label>
        <input
          type="text"
          value={values.name}
          onChange={(e) => setValues({ ...values, name: e.target.value })}
          className="form-control"
          placeholder="Name"
          disabled={loading}
        />
      </div>
      <div className="form-group">
        <label>
          <b>Phone</b>
        </label>
        <PhoneInput
          placeholder="Phone Number"
          value={values.phone && values.phone.length >= 7 ? values.phone : ""}
          onChange={(value) => setValues({ ...values, phone: value })}
        />
      </div>
      <br />

      <h4 style={{ margin: "20px 0" }}>Delivery Address</h4>
      <DeliveryAddress
        values={values}
        setValues={setValues}
        loading={loading}
        setLoading={setLoading}
        addressError={addressError}
      />
      <br />

      <h4 style={{ margin: "20px 0" }}>Home Address</h4>
      <HomeAddress
        values={values}
        setValues={setValues}
        loading={loading}
        setLoading={setLoading}
        addressError={addressError}
      />

      <Button
        onClick={handleSubmit}
        type="primary"
        className="mb-3"
        block
        shape="round"
        size="large"
        disabled={loading}
        style={{ marginTop: "30px", width: "150px" }}
      >
        Update
      </Button>
    </>
  );
};

export default ProfileDetails;
