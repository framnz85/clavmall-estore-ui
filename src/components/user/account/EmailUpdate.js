import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Joi from "joi-browser";
import { Button, Modal } from "antd";

import {
  updateEmailAddress,
  generateAuthToken,
  existUserAuthToken,
  createOrUpdateUser,
} from "../../../functions/auth";

const EmailUpdate = () => {
  let dispatch = useDispatch();

  const { user: userExist } = useSelector((state) => ({ ...state }));

  const [email, setEmail] = useState(userExist.email ? userExist.email : "");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [encrypted, setEncrypted] = useState("");
  const [decrypted, setDecrypted] = useState("");

  const schema = {
    email: Joi.string().email().min(3).max(255).required(),
    password: Joi.string().min(8).max(1024).required(),
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validate = Joi.validate({ email, password }, schema, {
      abortEarly: false,
    });

    if (validate.error) {
      for (let item of validate.error.details) toast.error(item.message);
      return;
    }

    const { refid, name, phone } = userExist;
    generateAuthToken({ refid, name, phone, email, password }).then((res) => {
      if (res.data.err) {
        toast.error(res.data.err);
        setLoading(false);
      } else {
        let token = res.data;
        updateEmailAddress(userExist.email ? userExist.email : "", token).then(
          (res) => {
            if (res.data.err) {
              toast.error(res.data.err);
              setLoading(false);
            } else {
              dispatch({
                type: "LOGGED_IN_USER_IX",
                payload: {
                  email: res.data.email,
                  emailConfirm: false,
                },
              });
            }
          }
        );
      }
    });
  };

  const handleVerify = async (e) => {
    if (code === decrypted) {
      const { refid, name, phone } = userExist;
      existUserAuthToken(email, phone, password).then((res) => {
        if (res.data.err) {
          toast.error(res.data.err);
        } else {
          const token = res.data;
          createOrUpdateUser(token, { emailConfirm: true })
            .then((res) => {
              dispatch({
                type: "LOGGED_IN_USER_III",
                payload: {
                  _id: res.data._id,
                  name: res.data.name,
                  phone: res.data.phone,
                  email: res.data.email,
                  emailConfirm: res.data.emailConfirm,
                  role: res.data.role,
                  address: res.data.address ? res.data.address : {},
                  homeAddress: res.data.homeAddress ? res.data.homeAddress : {},
                  token,
                  wishlist: res.data.wishlist,
                },
              });
              generateAuthToken({
                refid,
                name,
                phone,
                email,
                password,
              }).then((res) => {
                window.localStorage.setItem("userToken", res.data);
              });
              setIsModalOpen(false);
              toast.success("Success! Your email is now verified");
            })
            .catch((error) => {
              toast.error(error.message);
            });
        }
      });
    } else {
      toast.error(
        "Sorry! The code you have entered is invalid. Send the code again."
      );
    }
  };

  const makeid = (length) => {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  };

  const setVerifyCode = () => {
    const myCipher = cipher("GUsAj3nEfhdtwttFbMEt0l00ZdXWWdRk");
    const code = makeid(8);
    setDecrypted(code);
    setEncrypted(myCipher(code));
    setIsModalOpen(true);
  };

  const cipher = (salt) => {
    const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
    const byteHex = (n) => ("0" + Number(n).toString(16)).substr(-2);
    const applySaltToChar = (code) =>
      textToChars(salt).reduce((a, b) => a ^ b, code);

    return (text) =>
      text
        .split("")
        .map(textToChars)
        .map(applySaltToChar)
        .map(byteHex)
        .join("");
  };

  return (
    <>
      <h4 style={{ margin: "20px 0" }}>
        Email Update{" "}
        {userExist.email && !userExist.emailConfirm && (
          <span style={{ color: "red" }}>(Unverified)</span>
        )}
      </h4>
      <div className="form-group">
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control"
          placeholder="Enter new email"
          disabled={loading}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-control"
          placeholder="Enter current password"
          disabled={loading}
        />

        <Button
          onClick={handleSubmit}
          type="primary"
          className="mb-3"
          block
          shape="round"
          size="large"
          disabled={password.length < 3 || loading}
          style={{ marginTop: "30px", width: "150px" }}
        >
          Update
        </Button>

        {userExist.email && !userExist.emailConfirm && (
          <Button
            onClick={setVerifyCode}
            type="danger"
            className="mb-3"
            block
            shape="round"
            size="large"
            disabled={loading}
            style={{ marginTop: "30px", marginLeft: "10px", width: "150px" }}
          >
            Verify
          </Button>
        )}
      </div>

      <Modal
        title="Verify Email"
        visible={isModalOpen && encrypted}
        onOk={handleVerify}
        onCancel={() => setIsModalOpen(false)}
        okText="Verify"
      >
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="form-control"
          placeholder="Enter verification code"
          disabled={loading}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-control"
          placeholder="Enter current password"
          disabled={loading}
        />
        <br />
        <div align="center">
          <a
            href={`../verify.html?email=${email}&cvc=${encrypted}`}
            target="_blank"
            rel="noreferrer"
          >
            Send Verification Code
          </a>
        </div>
      </Modal>
    </>
  );
};

export default EmailUpdate;
