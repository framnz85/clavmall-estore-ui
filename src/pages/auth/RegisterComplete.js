import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Joi from "joi-browser";
import { toast } from "react-toastify";
import { Button } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { createOrUpdateUser } from "../../functions/auth";
import { auth } from "../firebase";

const RegisterComplete = ({ history }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  let { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    if (user && user.token) history.push("/");
  }, [user, history]);

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

    try {
      const result = await auth.signInWithEmailLink(
        email,
        window.location.href
      );
      if (result.user.emailVerified) {
        window.localStorage.removeItem("emailForRegistration");

        let user = auth.currentUser;
        await user.updatePassword(password);
        const idTokenResult = await user.getIdTokenResult();

        createOrUpdateUser(idTokenResult.token)
          .then((res) => {
            dispatch({
              type: "LOGGED_IN_USER",
              payload: {
                name: res.data.name,
                email: res.data.email,
                token: idTokenResult.token,
                role: res.data.role,
                _id: res.data._id,
              },
            });
          })
          .catch((error) => {
            toast.error(error.message);
            setLoading(false);
          });

        history.push("/");
      }
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
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
