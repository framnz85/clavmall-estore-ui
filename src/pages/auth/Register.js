import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Joi from "joi-browser";
import { toast } from "react-toastify";
import { Button } from "antd";
import { MailOutlined, FormOutlined } from "@ant-design/icons";
import PhoneInput from 'react-phone-number-input'

import { generateAuthToken, createOrUpdateUser } from "../../functions/auth";

import 'react-phone-number-input/style.css'

const initialState = {
  refid: "",
  name: "",
  phone: "",
  email: "",
  password: "",
  repassword: ""
}

const Register = ({ history }) => {
  let dispatch = useDispatch();

  const [values, setValues] = useState(initialState);
  const [loading, setLoading] = useState(false);

  let { user, estore } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    document.title = "Register | " + estore.name;
    if (user && user.token) regsiterRedirect();
    setReferenceId();
  }, [user, history]); // eslint-disable-line react-hooks/exhaustive-deps

  const setReferenceId = () => {
    const refid = localStorage.getItem("refid");
    if (refid && refid.length > 0) {
      setValues({ ...values, refid })
    }
  }

  const regsiterRedirect = () => {
    let intended = history.location.state;

    if (intended) {
      history.push(intended.from);
    } else {
      history.push("/")
    }
  };

  const schema1 = {
    name: Joi.string().required(),
    password: Joi.string().min(8).max(1024).required(),
  };

  const schema2 = {
    password: Joi.string().regex(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@_$!%*#?&])[A-Za-z\d@_$!%*#?&]{8,}$/
    ),
  };

  const schema3 = {
    name: Joi.string().required(),
    email: Joi.string().email().min(3).max(255),
    password: Joi.string().min(8).max(1024).required(),
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { refid, name, email, phone, password, repassword } = values;

    const validate1 = Joi.validate({ name, password }, schema1, {
      abortEarly: false,
    });

    if (validate1.error) {
      for (let item of validate1.error.details) toast.error(item.message);
      return;
    }

    if (email || phone) {
      if (email) {
        const validate3 = Joi.validate({ name, email, password }, schema3, {
          abortEarly: false,
        });

        if (validate3.error) {
          for (let item of validate3.error.details) toast.error(item.message);
          return;
        }
      }
    } else {
      toast.error("You need to provide either email or phone number");
      return;
    }

    const validate2 = Joi.validate({ password }, schema2, {
      abortEarly: false,
    });

    if (validate2.error) {
      toast.error(
        "Password must have at least one letter, one number and one special character @_$!%*#?&"
      );
      return;
    }

    if (password !== repassword) {
      toast.error("Password does not match!");
      return;
    }

    setLoading(true);

    generateAuthToken({ refid, name, phone, email, password }).then(res => {
      if (res.data.err) {
        toast.error(res.data.err);
        setLoading(false);
      } else {
        const token = res.data;
        createOrUpdateUser(token, { address: user.address }).then((res) => {
          window.localStorage.setItem("userToken", token);
          window.localStorage.setItem("emailForRegistration", email);
          dispatch({
            type: "LOGGED_IN_USER_III",
            payload: {
              _id: res.data._id,
              refid: res.data.refid,
              name: res.data.name,
              phone: res.data.phone,
              email: res.data.email,
              emailConfirm: res.data.emailConfirm,
              role: res.data.role,
              address: res.data.address ? res.data.address : user.address,
              homeAddress: res.data.homeAddress,
              wishlist: res.data.wishlist,
              token,
            },
          });
        })
        .catch((error) => {
          toast.error(error.message);
        });
      }
    });
  };

  const { refid, name, email, phone, password, repassword } = values;

  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h4>Register</h4>
            <form onSubmit={handleSubmit}>
              <input
                type="fullname"
                className="form-control"
                value={name}
                onChange={(e) => setValues({ ...values, name: e.target.value })}
                placeholder="Enter Full Name"
                autoFocus
                style={{ marginTop: "20px" }}
                disabled={loading}
              /><br/><br/>
              <b>Enter either email or mobile number</b>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setValues({ ...values, email: e.target.value })}
                placeholder="Enter Email"
                disabled={loading}
              /><br />or<br /><br />
              <PhoneInput
                placeholder="Enter Mobile Number"
                value={phone}
                onChange={(value => setValues({ ...values, phone: value }))}
              /><br /><br />
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setValues({ ...values, password: e.target.value })}
                placeholder="Enter Password"
                style={{ marginTop: "10px" }}
                disabled={loading}
              />
              <input
                type="password"
                className="form-control"
                value={repassword}
                onChange={(e) => setValues({ ...values, repassword: e.target.value })}
                placeholder="Re-enter Password"
                style={{ marginTop: "10px" }}
                disabled={loading}
              />
              
              <div align="center">{refid && <><br />{`Referred by: ${refid}`}</>}</div>
      
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

            <Button
              onClick={() => history.push("/login")}
              type="secondary"
              className="mb-3"
              block
              shape="round"
              icon={<FormOutlined />}
              size="large"
            >
              Login
            </Button>
        </div>
      </div>
    </div>
  );
};

export default Register;
