import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

import AdminNav from "../../../components/nav/AdminNav";
import LocationDetails from "../../../components/forms/location/LocationDetails";
import AddDomain from "../../../components/common/addDomain";

import { getAddiv3, updateMyAddiv3 } from "./../../../functions/addiv3";
import { updateChanges } from "../../../functions/estore";

const LocationUpdate = ({ history, match }) => {
  const { addiv3, coucode, currency } = match.params;
  let dispatch = useDispatch();
  let addiv3Exist = [];

  const initialState = {
    name: "",
    country: { currency },
    addiv1: { name: "" },
    addiv2: { name: "" },
    addiv3: { name: "" },
    minorder: "",
    maxorder: "",
    delfee: "",
    delfeetype: "%",
    discount: "",
    discounttype: "%",
    servefee: "",
    servefeetype: "%",
    referral: "",
    referraltype: "%",
    deltime: "",
    deltimetype: "days",
  };

  const [values, setValues] = useState(initialState);
  const [loading, setLoading] = useState(0);

  const { user, admin, estore } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadAddiv3();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadAddiv3 = () => {
    if (admin.location && admin.location.addiv3s) {
      addiv3Exist = admin.location.addiv3s.filter((addiv) => addiv._id === addiv3);
    }

    if (addiv3Exist.length > 0) {
      delete addiv3.couid;
      delete addiv3Exist[0].adDivId1;
      delete addiv3Exist[0].adDivId2;
      setValues({
        ...initialState, ...addiv3Exist[0]
      });
    } else {
      setLoading(1);
      getAddiv3(coucode, addiv3).then((res) => {
        const addiv3 = res.data;
        if (addiv3) {
          delete addiv3.couid;
          delete addiv3.adDivId1;
          delete addiv3.adDivId2;
          setValues({ ...initialState, ...addiv3 });
          setLoading(0);
        } else {
          history.push("/admin/location");
        }
      });
    }
  };

  const updateSubmit = () => {
    console.log(values.referral, values.servefee)
    if (values.servefeetype !== values.referraltype) {
      toast.error("Make sure that markup type is the same as referral type. If markup is in % then referral should also be in %.");
      return;
    }
    if (parseFloat(values.referral) > parseFloat(values.servefee)) {
      toast.error("Referral should be lesser than Service Fee");
      return;
    }
    setLoading(1);
    updateMyAddiv3(coucode, addiv3, values, user.token).then((res) => {
      updateChanges(
        estore._id,
        "locationChange",
        user.token
      ).then((res) => {
        dispatch({
          type: "ESTORE_INFO_XVI",
          payload: res.data,
        });
      });
      dispatch({
        type: "ADMIN_OBJECT_XIV",
        payload: {
          location: {
            ...admin.location,
            addiv3s: admin.location.addiv3s.map((addiv) =>
              addiv._id === addiv3 ? res.data : addiv
            ),
          }
        },
      });
      history.push("/admin/location");
    });
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-m-2">
          <AdminNav />
        </div>

        <div className="col-md-10 bg-white mt-3 mb-5">
          <h4 style={{ margin: "20px 0" }}>Location Update</h4>
          <hr />

          {loading === 1 && (
            <h4 style={{ margin: "20px 0" }}>
              <LoadingOutlined />
            </h4>
          )}

          <LocationDetails
            values={values}
            setValues={setValues}
            loading={loading}
            edit={true}
          />

          <Button
            onClick={updateSubmit}
            type="primary"
            className="mb-3"
            block
            shape="round"
            size="large"
            disabled={
              values.minorder.length === 0 ||
              values.maxorder.length === 0 ||
              values.discount.length === 0 ||
              values.servefee.length === 0 ||
              values.deltime.length === 0 ||
              loading
            }
            style={{ marginTop: "30px", width: "150px" }}
          >
            Update
          </Button>
          <br /><br />
          
          <div style={{ paddingBottom: 10 }}>
            <AddDomain />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationUpdate;
