import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getEstoreInfo } from "../../functions/estore";

const LoadingToRedirect = () => {
  let dispatch = useDispatch();
  const [count, setCount] = useState(5);
  let history = useHistory();

  const { estore } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    const logout = () => {
      dispatch({
        type: "USER_LOGOUT",
        payload: {},
      });
      dispatch({
        type: "INPUTS_OBJECT_X",
        payload: { cart: [] },
      });
      localStorage.clear();
      getEstoreInfo(estore._id).then((estore) => {
        dispatch({
          type: "ESTORE_INFO_XII",
          payload: estore.data[0],
        });
        history.push("/login");
      });
    };

    const interval = setInterval(() => {
      setCount((currentCount) => --currentCount);
    }, 1000);

    count === 0 && logout();

    return () => clearInterval(interval);
  }, [count, history, dispatch, estore._id]);

  return (
    <div className="container p-5 text-center text-danger">
      <p>Redirecting you to the login page in {count} seconds...</p>
    </div>
  );
};

export default LoadingToRedirect;
