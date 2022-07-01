import React, { useState } from "react";
import { toast } from "react-toastify";
import Joi from "joi-browser";
import { Button } from "antd";
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";

import { auth } from "../../../functions/firebase";

const PasswordUpdate = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
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

    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, oldPassword);

    reauthenticateWithCredential(user, credential).then(() => {
      setLoading(true);
      updatePassword(user, newPassword).then(() => {
        toast.success("Password Updated");
          setOldPassword("");
          setNewPassword("");
          setRePassword("");
          setLoading(false);
        })
        .catch((error) => {
          toast.error(error.message);
          setOldPassword("");
          setNewPassword("");
          setRePassword("");
          setLoading(false);
        });
    }).catch((error) => {
      toast.error(error.message);
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
                value={rePassword}
                onChange={(e) => setRePassword(e.target.value)}
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
                disabled={newPassword.length < 3 || loading}
                style={{ marginTop: "30px", width: "150px" }}
            >
                Update
            </Button>
        </div>
    </>
  );
};

export default PasswordUpdate;
