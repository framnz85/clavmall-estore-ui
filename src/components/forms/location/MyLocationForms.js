import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal } from "antd";
import { LoadingOutlined, ExclamationCircleOutlined } from "@ant-design/icons";

import MyLocationProperty from "./MyLocationProperty";
import InputSearch from "../../common/form/InputSearch";

import { getAllMyCountry, getNewAdded3, } from "../../../functions/address";
import { deleteAddiv2, deleteAddiv1, updateChanges } from "../../../functions/estore";

const { confirm } = Modal;

const MyLocationForm = ({
  myValues,
  setMyValues,
  loading,
  setLoading,
  keyword,
  setKeyword
}) => {
  let dispatch = useDispatch();
  const { country, addiv1, addiv2 } = myValues;

  const { user, estore, admin } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadAllMyCountry();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadAllMyCountry = () => {
    if (
      admin.location &&
      (admin.location.countries && admin.location.addiv3s)
    ) {
      setMyValues({
        ...myValues,
        country: estore.country,
        countries: admin.location.countries,
        addiv3s: admin.location.addiv3s,
        itemsCount: admin.location.addiv3s.length,
        currentPage: 1,
      });
    } else {
      setLoading(2);
      getAllMyCountry().then((res1) => {
        getNewAdded3(estore.country.countryCode, user.token).then((res2) => {
          setMyValues({
            ...myValues,
            country: estore.country,
            countries: res1.data,
            addiv3s: res2.data,
            itemsCount: res2.data.length,
            currentPage: 1,
          });
          dispatch({
            type: "ADMIN_OBJECT_IV",
            payload: {
              location: {
                ...admin.location,
                countries: res1.data,
                addiv3s: res2.data,
              }
            },
          });
          setLoading(0);
        });
      });
    }
  };

  const deleteMultiple = () => {
    if (addiv2._id) {
      confirm({
        title: "Are you sure you want to delete " + addiv2.name + "?",
        icon: <ExclamationCircleOutlined />,
        content:
          "Deleting " +
          addiv2.name +
          " will also delete all the location under it.",
        okText: "Yes",
        okType: "danger",
        cancelText: "No",
        onOk() {
          deleteAddiv2(country.countryCode, addiv2._id, user.token).then(() => {
            updateChanges(
              estore._id,
              "locationChange",
              user.token
            ).then((res) => {
              dispatch({
                type: "ESTORE_INFO_VII",
                payload: res.data,
              });
            });
            window.location.reload();
          });
        },
        onCancel() { },
      });
    } else if (addiv1._id) {
      confirm({
        title: "Are you sure you want to delete " + addiv1.name + "?",
        icon: <ExclamationCircleOutlined />,
        content:
          "Deleting " +
          addiv1.name +
          " will also delete all the location under it.",
        okText: "Yes",
        okType: "danger",
        cancelText: "No",
        onOk() {
          deleteAddiv1(country.countryCode, addiv1._id, user.token).then(() => {
            updateChanges(
              estore._id,
              "locationChange",
              user.token
            ).then((res) => {
              dispatch({
                type: "ESTORE_INFO_VII",
                payload: res.data,
              });
            });
            window.location.reload();
          });
        },
        onCancel() { },
      });
    }
  };

  return (
    <>
      <InputSearch
        keyword={keyword}
        setKeyword={setKeyword}
        placeholder="Search location"
        data={myValues}
        setData={setMyValues}
      />

      <MyLocationProperty
        myValues={myValues}
        setMyValues={setMyValues}
        setLoading={setLoading}
      />

      <Button
        type="primary"
        onClick={deleteMultiple}
        danger
        disabled={!addiv1 || !addiv1._id}
        style={{ float: "left" }}
      >
        Delete {addiv2._id ? addiv2.name : addiv1._id ? addiv1.name : ""}
      </Button>
      <div className="p-1" onClick={() => window.location.reload(false)} style={{ float: "left", cursor: "pointer" }}>
        Refresh
      </div>{" "}
      {loading === 3 && (
        <span>
          <LoadingOutlined />
        </span>
      )}
    </>
  );
};

export default MyLocationForm;
