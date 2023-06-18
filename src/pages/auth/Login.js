import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Joi from "joi-browser";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "antd";
import { MailOutlined, FormOutlined } from "@ant-design/icons";
import PhoneInput from "react-phone-number-input";

import "react-phone-number-input/style.css";

import { existUserAuthToken, createOrUpdateUser } from "../../functions/auth";

const Login = ({ history }) => {
  let dispatch = useDispatch();

  // const [email, setEmail] = useState(process.env.REACT_APP_ESTORE_ID === "613216389261e003d696cc65" ? "clavmall.85@gmail.com" : "");
  // const [phone, setPhone] = useState(process.env.REACT_APP_ESTORE_ID === "613216389261e003d696cc65" ? "+639778557778" : "");
  // const [password, setPassword] = useState(process.env.REACT_APP_ESTORE_ID === "613216389261e003d696cc65" ? "Ejccoc@1204" : "");

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [reloading, setReloading] = useState(0);

  let { user: userExist, estore } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    document.title = "Login | " + estore.name;
    let intended = history.location.state;
    if (intended) {
      return;
    } else {
      if (userExist && userExist.token) {
        const interval = setInterval(() => {
          setReloading((currentCount) =>
            currentCount === 0 ? history.push("/") : --currentCount
          );
        }, 1000);

        setReloading(5);
        return () => interval;
      }
    }
  }, [userExist, history]); // eslint-disable-line react-hooks/exhaustive-deps

  const roleBasedRedirect = (res) => {
    let intended = history.location.state;

    if (intended) {
      history.push(intended.from);
    } else {
      if (res.data.role === "admin") {
        history.push("/admin/dashboard");
      } else {
        history.push("/user/orders");
      }
    }
  };

  const schema = {
    email: Joi.string().email().min(3).max(255).required(),
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email || phone) {
      if (email) {
        const validate = Joi.validate({ email }, schema, {
          abortEarly: false,
        });

        if (validate.error) {
          for (let item of validate.error.details) toast.error(item.message);
          return;
        }
      }
    } else {
      toast.error("You need to provide either email or phone number");
      return;
    }

    setLoading(true);
    existUserAuthToken(email, phone, password)
      .then((res) => {
        if (res.data.err) {
          toast.error(res.data.err);
          setLoading(false);
        } else {
          if (res.data.noPass) {
            toast.error(res.data.noPass);
            setLoading(false);
            history.push("/register");
          } else {
            const token = res.data;
            window.localStorage.setItem("userToken", token);
            handleLoginUser(token);
          }
        }
      })
      .catch((error) => {
        toast.error(error.message);
        setLoading(false);
      });
  };

  const handleLoginUser = (token) => {
    createOrUpdateUser(token, { address: userExist.address })
      .then((res) => {
        dispatch({
          type: "LOGGED_IN_USER_II",
          payload: {
            _id: res.data._id,
            refid: res.data.refid,
            name: res.data.name,
            phone: res.data.phone,
            email: res.data.email,
            emailConfirm: res.data.emailConfirm,
            role: res.data.role,
            address: res.data.address ? res.data.address : userExist.address,
            homeAddress: res.data.homeAddress,
            wishlist: res.data.wishlist,
            addInstruct: res.data.addInstruct,
            token,
          },
        });
        roleBasedRedirect(res);
      })
      .catch((error) => {
        toast.error(error.message);
        setLoading(false);
      });
  };

  return (
    <div className="container p-5">
      {reloading > 0 && (
        <div className="container p-5 text-center text-danger">
          <p>Redirecting you to your account in {reloading} seconds...</p>
        </div>
      )}
      {reloading === 0 && (
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <h4>Login</h4>
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
              <br />
              or
              <br />
              <br />
              <PhoneInput
                placeholder="Enter Mobile Number"
                value={phone}
                onChange={(value) => setPhone(value)}
              />
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
              <button type="submit" style={{ border: 0 }} />
              <Button
                onClick={handleSubmit}
                type="primary"
                className="mb-3"
                block
                shape="round"
                icon={<MailOutlined />}
                size="large"
                disabled={loading || (!email && !phone) || password.length < 3}
                style={{ marginTop: "30px" }}
              >
                Login with Email/Password
              </Button>
            </form>

            <Button
              onClick={() => history.push("/register")}
              type="secondary"
              className="mb-3"
              block
              shape="round"
              icon={<FormOutlined />}
              size="large"
            >
              Register
            </Button>

            <Link to="/forgot/password" style={{ float: "right" }}>
              Forgot Password
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
