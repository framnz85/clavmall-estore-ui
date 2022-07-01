import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { signOut } from "firebase/auth";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { auth } from "../../functions/firebase";
import { getEstoreInfo } from "../../functions/estore";

const LoadingToRedirect = () => {
  let dispatch = useDispatch();
  const [count, setCount] = useState(5);
  let history = useHistory();

  useEffect(() => {
    const logout = () => {
      signOut(auth).then(() => {
        dispatch({
          type: "USER_LOGOUT",
          payload: {},
        });
        localStorage.clear();
        getEstoreInfo(process.env.REACT_APP_ESTORE_ID).then((estore) => {
          dispatch({
            type: "ESTORE_INFO_XII",
            payload: estore.data[0],
          });
          history.push("/login");
        });
      }).catch((error) => {
          toast.success(error.message);
      });
    };

    const interval = setInterval(() => {
      setCount((currentCount) => --currentCount);
    }, 1000);

    count === 0 && logout();

    return () => clearInterval(interval);
  }, [count, history, dispatch]);

  return (
    <div className="container p-5 text-center text-danger">
      <p>Redirecting you to the login page in {count} seconds...</p>
    </div>
  );
};

export default LoadingToRedirect;
