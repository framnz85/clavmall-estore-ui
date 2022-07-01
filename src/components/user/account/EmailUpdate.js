import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Joi from "joi-browser";
import { Button } from "antd";
import {
  updateEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendEmailVerification
} from "firebase/auth";

import { auth } from "../../../functions/firebase";
import { updateEmailAddress } from "../../../functions/auth";

const EmailUpdate = () => {
  let dispatch = useDispatch();

  const { user } = useSelector((state) => ({ ...state }));
  
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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

    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, password);

    reauthenticateWithCredential(user, credential).then(() => {
      const oldEmail = user.email;
      setLoading(true);
      updateEmail(user, email).then(() => {
        sendEmailVerification(auth.currentUser).then(() => {
          updateEmailAddress(oldEmail, user.accessToken).then((res) => {
            dispatch({
              type: "LOGGED_IN_USER_IX",
              payload: {
                email: res.data.email,
              },
            });
          }).catch((error) => {
            toast.error(error.message);
            setLoading(false);
          });
          toast.success("An email verification was sent to your email's inbox.");
          setPassword("");
          setLoading(false);
        });
      }).catch((error) => {
        toast.error(error.message);
        setPassword("");
        setLoading(false);
      });
    }).catch((error) => {
      toast.error(error.message);
    });
  };

  return (
    <>
        <h4 style={{ margin: "20px 0" }}>Email Update</h4>
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
        </div>
    </>
  );
};

export default EmailUpdate;
