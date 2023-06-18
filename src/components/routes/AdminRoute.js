import React, { useState, useEffect } from "react";
import { Route } from "react-router";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import LoadingToRedirect from "./LoadingToRedirect";
import { currentAdmin } from "../../functions/auth";

const AdminRoute = ({ children, ...rest }) => {
  const { user } = useSelector((state) => ({ ...state }));
  const [ok, setOk] = useState(user.role === "admin" ? user.role : false);

  useEffect(() => {
    if (user && user.token) {
      currentAdmin(user.token)
        .then((res) => {
          setOk(true);
        })
        .catch((error) => {
          setOk(false);
          toast.error("You have been logged out due to inactivity");
        });
    }
  }, [user]);

  return ok ? <Route {...rest} /> : <LoadingToRedirect />;
};

export default AdminRoute;
