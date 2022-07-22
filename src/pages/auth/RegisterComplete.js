import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Joi from "joi-browser";
import { toast } from "react-toastify";
import { Button } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { isSignInWithEmailLink, signInWithEmailLink, updatePassword } from "firebase/auth";

import { createOrUpdateUser } from "../../functions/auth";
import { auth } from "../../functions/firebase";

const RegisterComplete = ({ history }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [loading, setLoading] = useState(false);
  let dispatch = useDispatch();

  let { user, estore } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    document.title = "Complete Registration | " + estore.name;
    if (user && user.token) history.push("/");
  }, [user, history]); // eslint-disable-line react-hooks/exhaustive-deps

  const schema1 = {
    email: Joi.string().email().min(3).max(255).required(),
    password: Joi.string().min(8).max(1024).required(),
  };

  const schema2 = {
    password: Joi.string().regex(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
    ),
  };

  useEffect(() => {
    setEmail(window.localStorage.getItem("emailForRegistration"));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem('emailForRegistration');
      if (!email) {
        toast.error("Link to complete registration should be open on the same computer and browser where you have entered it for registration");
      } else {
        const validate1 = Joi.validate({ email, password }, schema1, {
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

        signInWithEmailLink(auth, email, window.location.href).then((result) => {
          if (result.user.emailVerified) {
            let user = auth.currentUser;
            updatePassword(user, password).then(() => {
                createOrUpdateUser(user.accessToken)
                  .then((res) => {
                    dispatch({
                      type: "LOGGED_IN_USER_III",
                      payload: {
                        name: res.data.name,
                        email: res.data.email,
                        token: user.accessToken,
                        role: res.data.role,
                        _id: res.data._id,
                      },
                    });
                  })
                  .catch((error) => {
                    toast.error(error.message);
                  });
                window.localStorage.removeItem("emailForRegistration");
                setLoading(false);
                history.push("/");
            }).catch((error) => {
              toast.error(error.message);
              setLoading(false);
            });
          }
        }).catch((error) => {
          toast.error(error.message);
          setLoading(false);
        });
      }
    } else {
      toast.error("The link to complete registration may have expired or it should be open on the same computer and browser where you have entered it for registration. ");
    }
  };

  const completeRegisterForm = () => (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        className="form-control"
        value={email}
        disabled
        style={{ marginTop: "20px" }}
      />
      <input
        type="password"
        className="form-control"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter Password"
        autoFocus
        style={{ marginTop: "10px" }}
        disabled={loading}
      />
      <input
        type="password"
        className="form-control"
        value={repassword}
        onChange={(e) => setRepassword(e.target.value)}
        placeholder="Re-enter Password"
        style={{ marginTop: "10px" }}
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
          <h4>Complete Registration</h4>
          {completeRegisterForm()}
        </div>
      </div>
    </div>
  );
};

export default RegisterComplete;
