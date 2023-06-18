import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "antd";
import { toast } from "react-toastify";

import {
  copyAllAddiv1,
  saveCreatedLocation1,
  copyAllAddiv2,
  saveCreatedLocation2,
  copyAllAddiv3,
  saveCreatedLocation3,
  saveLocation3,
  updateChanges,
} from "./../../../functions/estore";

const LocationButton = ({ values, loading, setLoading }) => {
  let dispatch = useDispatch();
  const { minorder, maxorder, discount, servefee, referral, deltime } = values;

  const { user, estore } = useSelector((state) => ({ ...state }));

  const handleSubmit = () => {
    const {
      minorder,
      maxorder,
      delfee,
      delfeetype,
      discount,
      discounttype,
      servefee,
      servefeetype,
      referral,
      referraltype,
      deltime,
      deltimetype,
    } = values;

    const importantDetails = {
      minorder,
      maxorder,
      delfee,
      delfeetype,
      discount,
      discounttype,
      servefee,
      servefeetype,
      referral,
      referraltype,
      deltime,
      deltimetype,
    };

    if (servefeetype !== referraltype) {
      toast.error("Make sure that Service Fee type is the same as Referral type. If Service Fee is in % then Referral should also be in %.");
      return;
    }

    if (parseFloat(referral) > parseFloat(servefee)) {
      toast.error("Referral should be lesser than Service Fee");
      return;
    }

    setLoading(1);
    if (values.addiv1._id === "1") {
      copyAllAddiv1(values.country, importantDetails, user.token).then(
        (res) => {
          setLoading(0);
          window.location.reload();
        }
      );
    } else if (values.addiv1._id === "2") {
      saveCreatedLocation1(values, importantDetails, user.token).then((res) => {
        setLoading(0);
        window.location.reload();
      });
    } else {
      if (values.addiv2._id === "1") {
        copyAllAddiv2(
          values.country,
          values.addiv1,
          importantDetails,
          user.token
        ).then((res) => {
          setLoading(0);
          window.location.reload();
        });
      } else if (values.addiv2._id === "2") {
        saveCreatedLocation2(values, importantDetails, user.token).then(
          (res) => {
            setLoading(0);
            window.location.reload();
          }
        );
      } else {
        if (values.addiv3._id === "1") {
          copyAllAddiv3(
            values.country,
            values.addiv1,
            values.addiv2,
            importantDetails,
            user.token
          ).then((res) => {
            setLoading(0);
            window.location.reload();
          });
        } else if (values.addiv3._id === "2") {
          saveCreatedLocation3(values, importantDetails, user.token).then(
            (res) => {
              setLoading(0);
              window.location.reload();
            }
          );
        } else {
          saveLocation3(
            values.country,
            values.addiv1,
            values.addiv2,
            values.addiv3,
            importantDetails,
            user.token
          ).then(() => {
            setLoading(0);
            window.location.reload();
          });
        }
      }
    }
    
    updateChanges(
      estore._id,
      "locationChange",
      user.token
    ).then((res) => {
      dispatch({
        type: "ESTORE_INFO_VI",
        payload: res.data,
      });
    });
  };

  return (
    <Button
      onClick={handleSubmit}
      type="primary"
      className="mb-3"
      block
      shape="round"
      size="large"
      disabled={
        minorder.length === 0 ||
        maxorder.length === 0 ||
        discount.length === 0 ||
        servefee.length === 0 ||
        referral.length === 0 ||
        deltime.length === 0 ||
        loading === 1
      }
      style={{ marginTop: "30px", width: "150px" }}
    >
      Submit
    </Button>
  );
};

export default LocationButton;
