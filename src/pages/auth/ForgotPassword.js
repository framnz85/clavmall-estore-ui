import React, { useState, useEffect } from "react";
import Joi from "joi-browser";
import { toast } from "react-toastify";
import { Button, Modal } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { existUserAuthToken, updateUserPassword } from "../../functions/auth";

const ForgotPassword = ({ history }) => {
  let { user, estore } = useSelector((state) => ({ ...state }));

  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [code, setCode] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [encrypted, setEncrypted] = useState("");
  const [decrypted, setDecrypted] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Forgot Password | " + estore.name;
    if (user && user.token) history.push("/");
  }, [user, history]); // eslint-disable-line react-hooks/exhaustive-deps

  const schema1 = {
    email: Joi.string().email().min(3).max(255).required(),
  };

  const schema2 = {
    oldPassword: Joi.string().required(),
  };

  const schema3 = {
    newPassword: Joi.string().regex(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@_$!%*#?&])[A-Za-z\d@_$!%*#?&]{8,}$/
    ),
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validate1 = Joi.validate({ email }, schema1, {
      abortEarly: false,
    });

    if (validate1.error) {
      for (let item of validate1.error.details) toast.error(item.message);
      return;
    }

    setLoading(true);

    existUserAuthToken(email, null, "forgotpassword").then((res) => {
      if (res.data.err) {
        toast.error(res.data.err);
        setLoading(false);
      } else {
        setVerifyCode();
        setLoading(false);
      }
    });
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    if (code === decrypted) {
      const validate2 = Joi.validate({ oldPassword }, schema2, {
        abortEarly: false,
      });

      if (validate2.error) {
        for (let item of validate2.error.details) toast.error(item.message);
        return;
      }

      const validate3 = Joi.validate({ newPassword }, schema3, {
        abortEarly: false,
      });

      if (validate3.error) {
        toast.error(
          "New password must have at least one letter, one number and one special character @_$!%*#?&"
        );
        return;
      }

      if (newPassword !== rePassword) {
        toast.error("Password does not match!");
        return;
      }

      setLoading(true);

      existUserAuthToken(email, null, "forgotpassword").then((res) => {
        if (res.data.err) {
          toast.error(res.data.err);
        } else {
          const token = res.data;
          updateUserPassword(oldPassword, newPassword, token).then((res) => {
            if (res.data.err) {
              toast.error(res.data.err);
              setLoading(false);
            } else {
              toast.success("Password Updated! Login to access your account.");
              history.push("/login");
            }
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
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h4>Forgot Password</h4>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email here"
              autoFocus
              style={{ marginTop: "20px" }}
              disabled={loading}
            />

            <Button
              onClick={handleSubmit}
              type="primary"
              className="mb-3"
              block
              shape="round"
              icon={<ArrowRightOutlined />}
              size="large"
              disabled={loading}
              style={{ marginTop: "30px" }}
            >
              Proceed
            </Button>
          </form>
        </div>
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
        <br />
        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="form-control"
          placeholder="Enter old password"
          disabled={loading}
        />
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="form-control"
          placeholder="Enter new password"
          disabled={loading}
        />
        <input
          type="password"
          className="form-control"
          value={rePassword}
          onChange={(e) => setRePassword(e.target.value)}
          placeholder="Confirm new Password"
          disabled={loading}
        />
      </Modal>
    </div>
  );
};

export default ForgotPassword;
