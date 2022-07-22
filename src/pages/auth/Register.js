import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Joi from "joi-browser";
import { toast } from "react-toastify";
import { Button } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { sendSignInLinkToEmail } from "firebase/auth";

import { auth } from "../../functions/firebase";

const Register = ({ history }) => {
  const [email, setEmail] = useState("");
  const [succeed, setSucceed] = useState("");
  const [loading, setLoading] = useState(false);

  let { user, estore } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    document.title = "Register | " + estore.name;
    if (user && user.token) history.push("/");
  }, [user, history]); // eslint-disable-line react-hooks/exhaustive-deps

  const schema = {
    email: Joi.string().email().min(3).max(255).required(),
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const config = {
      url: window.location.href + "/complete",
      handleCodeInApp: true,
    };

    const result = Joi.validate({ email }, schema, {
      abortEarly: false,
    });

    if (result.error) {
      for (let item of result.error.details) toast.error(item.message);
      return;
    }

    setLoading(true);

    sendSignInLinkToEmail(auth, email, config).then(async (result) => {
      toast.success(
        `Email is sent to ${email}. Click the link attached to that email to complete your registration.`
      );
      window.localStorage.setItem("emailForRegistration", email);
      setEmail("");
      setSucceed(email)
      setLoading(false);
    }).catch((error) => {
      toast.error(error.message);
      setLoading(false);
    });
  };

  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h4>Register</h4>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email"
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
                icon={<MailOutlined />}
                size="large"
                disabled={loading}
                style={{ marginTop: "30px" }}
              >
                Register with Email/Password
              </Button>
            </form>
            {succeed && <div align="center" className="alert alert-success" role="alert">
              Email is sent to {succeed}. Click the link attached to that email to complete your registration.
            </div>}
        </div>
      </div>
    </div>
  );
};

export default Register;
