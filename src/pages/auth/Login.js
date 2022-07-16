import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Joi from "joi-browser";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "antd";
import { MailOutlined, GoogleOutlined  } from "@ant-design/icons";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

import { createOrUpdateUser } from "../../functions/auth";
import { auth, googleAuth } from "../../functions/firebase";

const Login = ({ history }) => {
  let dispatch = useDispatch();

  const [email, setEmail] = useState("clavmall.85@gmail.com");
  const [password, setPassword] = useState("Grocery@123456");
  const [loading, setLoading] = useState(false);
  const [reloading, setReloading] = useState(0);

  let { user: userExist } = useSelector((state) => ({ ...state }));

  useEffect(() => {
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
  }, [userExist, history]);

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

    setLoading(true);

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const { user } = result;
      createOrUpdateUser(user.accessToken, userExist.address)
        .then((res) => {
          dispatch({
            type: "LOGGED_IN_USER_II",
            payload: {
              _id: res.data._id,
              name: res.data.name,
              email: res.data.email,
              role: res.data.role,
              address: res.data.address,
              homeAddress: res.data.homeAddress,
              token: user.accessToken,
              wishlist: res.data.wishlist,
            },
          });
          roleBasedRedirect(res);
        })
        .catch((error) => {
          toast.error(error.message);
          setLoading(false);
        });
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    signInWithPopup(auth, googleAuth)
      .then(async (result) => {
        const { user } = result;
        createOrUpdateUser(user.accessToken, userExist.address)
          .then((res) => {
            dispatch({
              type: "LOGGED_IN_USER_II",
              payload: {
                _id: res.data._id,
                name: res.data.name,
                email: res.data.email,
                role: res.data.role,
                address: res.data.address,
                homeAddress: res.data.homeAddress,
                token: user.accessToken,
                wishlist: res.data.wishlist,
              },
            });
            roleBasedRedirect(res);
          })
          .catch((error) => {
            toast.error(error.message);
            setLoading(false);
          });
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
                disabled={loading || !email || password.length < 3}
                style={{ marginTop: "30px" }}
              >
                Login with Email/Password
              </Button>
            </form>

            <Button
              onClick={googleLogin}
              type="danger"
              className="mb-3"
              block
              shape="round"
              icon={<GoogleOutlined />}
              size="large"
            >
              Login with Google
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
