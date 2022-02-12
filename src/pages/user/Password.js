import React, { useState } from "react";
import { toast } from "react-toastify";
import Joi from "joi-browser";
import { Button } from "antd";
import UserNav from "../../components/nav/UserNav";
import { auth } from "../firebase";

const Password = () => {
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [loading, setLoading] = useState(false);

  const schema1 = {
    password: Joi.string().min(8).max(1024).required(),
  };

  const schema2 = {
    password: Joi.string().regex(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
    ),
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validate1 = Joi.validate({ password }, schema1, {
      abortEarly: false,
    });

    if (validate1.error) {
      for (let item of validate1.error.details) toast.error(item.message);
      return;
    }

    const validate2 = Joi.validate({ password }, schema2, {
      abortEarly: false,
    });

    if (validate2.error) {
      toast.error(
        "Password must have at least one letter, one number and one special character."
      );
      return;
    }

    if (password !== repassword) {
      toast.error("Password does not match!");
      return;
    }

    setLoading(true);

    await auth.currentUser
      .updatePassword(password)
      .then(() => {
        toast.success("Password Updated");
        setPassword("");
        setRepassword("");
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.message);
        setPassword("");
        setRepassword("");
        setLoading(false);
      });
  };

  const passwordUpdateForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-control"
          placeholder="Enter new password"
          autoFocus
          disabled={loading}
        />
        <input
          type="password"
          value={repassword}
          onChange={(e) => setRepassword(e.target.value)}
          className="form-control"
          placeholder="Re-enter new password"
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
          Submit
        </Button>
      </div>
    </form>
  );

  return (
    <div className="container">
      <div className="row">
        <div className="col-m-2">
          <UserNav />
        </div>
        <div className="col-md-10 bg-white mt-3 mb-5">
          <h4 style={{ margin: "20px 0" }}>Password Update</h4>
          {passwordUpdateForm()}
        </div>
      </div>
    </div>
  );
};

export default Password;
