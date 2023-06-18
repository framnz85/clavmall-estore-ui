import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Joi from "joi-browser";
import { Button } from "antd";

import { updateUserPassword } from "../../../functions/auth";

const PasswordUpdate = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((state) => ({ ...state }));

  const schema1 = {
    password: Joi.string().min(8).max(1024).required(),
  };

  const schema2 = {
    password: Joi.string().regex(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@_$!%*#?&])[A-Za-z\d@_$!%*#?&]{8,}$/
    ),
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validate1 = Joi.validate({ password: newPassword }, schema1, {
      abortEarly: false,
    });

    if (validate1.error) {
      for (let item of validate1.error.details) toast.error(item.message);
      return;
    }

    const validate2 = Joi.validate({ password: newPassword }, schema2, {
      abortEarly: false,
    });

    if (validate2.error) {
      toast.error(
        "Password must have at least one letter, one number and one special character."
      );
      return;
    }

    if (newPassword !== rePassword) {
      toast.error("Password does not match!");
      return;
    }

    setLoading(true);
    updateUserPassword(oldPassword, newPassword, user.token).then((res) => {
      if (res.data.err) {
        toast.error(res.data.err);
        setLoading(false);
      } else {
        toast.success("Password Updated");
        setOldPassword("");
        setNewPassword("");
        setRePassword("");
        setLoading(false);
      }
    });
  };

  return (
    <>
      <h4 style={{ margin: "20px 0" }}>Password Update</h4>
      <div className="form-group">
        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="form-control"
          placeholder="Enter old password"
          disabled={!user.emailConfirm || loading}
        />
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="form-control"
          placeholder="Enter new password"
          disabled={!user.emailConfirm || loading}
        />
        <input
          type="password"
          value={rePassword}
          onChange={(e) => setRePassword(e.target.value)}
          className="form-control"
          placeholder="Re-enter new password"
          disabled={!user.emailConfirm || loading}
        />
        {!user.emailConfirm && (
          <div style={{ color: "red" }}>
            You need to have a verified email address before you can modify
            password
          </div>
        )}
        <Button
          onClick={handleSubmit}
          type="primary"
          className="mb-3"
          block
          shape="round"
          size="large"
          disabled={!user.emailConfirm || newPassword.length < 3 || loading}
          style={{ marginTop: "30px", width: "150px" }}
        >
          Update
        </Button>
      </div>
    </>
  );
};

export default PasswordUpdate;
