import React, { useState, useEffect } from "react";
import Joi from "joi-browser";
import { toast } from "react-toastify";
import { Button } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { sendPasswordResetEmail } from "firebase/auth";

import { auth } from "../../functions/firebase";

const ForgotPassword = ({ history }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  let { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    if (user && user.token) history.push("/");
  }, [user, history]);

  const schema = {
    email: Joi.string().email().min(3).max(255).required(),
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = Joi.validate({ email }, schema, {
      abortEarly: false,
    });

    if (result.error) {
      for (let item of result.error.details) toast.error(item.message);
      return;
    }

    setLoading(true);

    sendPasswordResetEmail(auth, email)
      .then(() => {
        setLoading(false);
        setEmail("");
        toast.success(`Check your email for password reset link.`);
      }).catch((error) => {
        setLoading(false);
        toast.error(error.message);
      });
  };

  const registerForm = () => (
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
  );

  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h4>Forgot Password</h4>
          {registerForm()}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
