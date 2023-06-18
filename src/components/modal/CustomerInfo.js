import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Button } from "antd";
import { FormOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import PhoneInput from "react-phone-number-input";
import Joi from "joi-browser";
import { Link } from "react-router-dom";

import "react-phone-number-input/style.css";

import { generateAuthToken, createOrUpdateUser } from "../../functions/auth";

const initialAddress = {
  refid: "",
  name: "",
  email: "",
  phone: "",
};

const CustomerInfo = ({ showCustomerInfo, setShowCustomerInfo }) => {
  let dispatch = useDispatch();

  const [values, setValues] = useState(initialAddress);
  const [password, setPassword] = useState("");
  const [inputPassword, showInputPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((state) => ({
    ...state,
  }));

  useEffect(() => {
    setReferenceId();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const schema = {
    name: Joi.string().required(),
    email: Joi.string().email().min(3).max(255),
  };

  const setReferenceId = () => {
    const refid = localStorage.getItem("refid");
    if (refid && refid.length > 0) {
      setValues({ ...values, refid });
    }
  };

  const handleModal = async () => {
    const { refid, name, email, phone } = values;

    const validate1 = Joi.validate({ name }, schema, {
      abortEarly: false,
    });

    if (validate1.error) {
      for (let item of validate1.error.details) toast.error(item.message);
      return;
    }

    if (email || phone) {
      if (email) {
        const validate2 = Joi.validate({ name, email }, schema, {
          abortEarly: false,
        });

        if (validate2.error) {
          for (let item of validate2.error.details) toast.error(item.message);
          return;
        }
      }
    } else {
      toast.error("You need to provide either email or phone number");
      return;
    }

    generateAuthToken({ refid, name, phone, email }).then((res) => {
      if (res.data.err) {
        toast.error(res.data.err);
        setLoading(false);
      } else {
        const token = res.data;
        createOrUpdateUser(token, { address: user.address })
          .then(async (res) => {
            if (res.data.err) {
              toast.error(res.data.err);
              setLoading(false);
            } else {
              if (res.data.superAdmin || res.data.role === "admin") {
                if (!password) {
                  showInputPassword(true);
                  return;
                }
              }
              if (res.data.password) {
                if (!password) {
                  showInputPassword(true);
                  return;
                }
              }
              window.localStorage.setItem("userToken", token);
              dispatch({
                type: "LOGGED_IN_USER_III",
                payload: {
                  _id: res.data._id,
                  refid: res.data.refid,
                  name: res.data.name,
                  phone: res.data.phone,
                  email: res.data.email,
                  emailConfirm: res.data.emailConfirm,
                  role: res.data.role,
                  address: res.data.address.addiv3
                    ? res.data.address
                    : user.address,
                  homeAddress: res.data.homeAddress,
                  wishlist: res.data.wishlist,
                  token,
                },
              });
              setShowCustomerInfo(false);
            }
          })
          .catch((error) => {
            toast.error(error.message);
          });
      }
    });
  };

  const { refid, name, email, phone } = values;

  return (
    <>
      <Modal
        title="Customer Information"
        centered
        visible={showCustomerInfo}
        onOk={handleModal}
        onCancel={() => setShowCustomerInfo(false)}
        okText="Proceed"
      >
        <div className="form-group">
          <input
            type="fullname"
            className="form-control"
            value={name}
            onChange={(e) => setValues({ ...values, name: e.target.value })}
            placeholder="Full Name"
            autoFocus
            disabled={loading}
          />
          <br />
          <br />
          <b>Enter either email or mobile number</b>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setValues({ ...values, email: e.target.value })}
            placeholder="Email"
            disabled={loading}
          />
          <br />
          or
          <br />
          <br />
          <PhoneInput
            placeholder="Enter Mobile Number"
            value={phone}
            onChange={(value) => setValues({ ...values, phone: value })}
          />
          {!inputPassword && (
            <div align="center" style={{ color: "GREEN" }}>
              <br />
              If you proceed, you will be given a default password of{" "}
              <b>Grocery@1234</b> so you can login and monitor your orders.
              However, you may also Register so you can create your own
              password.
              <Link
                to={{
                  pathname: "/register",
                  state: { from: "cart" },
                }}
              >
                <Button
                  type="primary"
                  size="large"
                  style={{ width: "100%", marginTop: "15px" }}
                >
                  <FormOutlined />
                  Register to Checkout
                </Button>
              </Link>
            </div>
          )}
          {inputPassword && (
            <>
              <br />
              <br />
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                style={{ marginTop: "10px" }}
                disabled={loading}
              />
              <div style={{ color: "red" }}>
                The email or phone you provided is owned by someone and needs
                password to proceed.
              </div>
            </>
          )}
          <div align="center">
            {refid && (
              <>
                <br />
                {`Referred by: ${refid}`}
              </>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CustomerInfo;
