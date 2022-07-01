import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import _ from "lodash";
import { toast } from "react-toastify";
import NoAvailableProperty from "./NoAvailableProperty";
import { getAllMyCountry } from "../../functions/country";
import { getAllMyAddiv1 } from "../../functions/addiv1";
import { getAllMyAddiv2 } from "../../functions/addiv2";
import { getNewAdded3, getAllMyAddiv3 } from "../../functions/addiv3";

const initialMyState = {
  country: {},
  countries: [],
  addiv1: {},
  addiv1s: [],
  addiv2: {},
  addiv2s: [],
  addiv3: {},
  addiv3s: [],
};

const NotAvailableForms = ({ values, setValues }) => {
  const [loading, setLoading] = useState(false);
  const [myValues, setMyValues] = useState(initialMyState);

  const { user, estore } = useSelector((state) => ({ ...state }));

  const {
    country,
    countries,
    addiv1,
    addiv1s,
    addiv2,
    addiv2s,
    addiv3,
    addiv3s,
  } = myValues;

  useEffect(() => {
    loadAllMyCountry();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadAllMyCountry = () => {
    setLoading(2);
    getAllMyCountry().then((res1) => {
      getNewAdded3(estore.country.countryCode, user.token).then((res2) => {
        setMyValues({
          ...initialMyState,
          country: estore.country,
          countries: res1.data,
          addiv3s: res2.data,
        });
        setLoading();
      });
    });
  };

  const handleMyCountryChange = (value) => {
    const country = countries.filter((country) => country._id === value);
    setLoading(3);
    getAllMyAddiv1(country[0]._id, country[0].countryCode).then((res) => {
      setMyValues({
        ...myValues,
        country: country[0],
        addiv1: {},
        addiv1s: res.data,
        addiv2: {},
        addiv2s: [],
        addiv3: {},
      });
      setLoading();
    });
  };

  const handleMyAddiv1Change = (value) => {
    const addiv1 = addiv1s.filter((addiv1) => addiv1._id === value);
    const country = countries.filter(
      (country) => country._id === addiv1[0].couid
    );
    setLoading(3);
    getAllMyAddiv2(country[0]._id, addiv1[0]._id, country[0].countryCode).then(
      (res) => {
        setMyValues({
          ...myValues,
          addiv1: addiv1[0],
          addiv2: {},
          addiv2s: res.data,
          addiv3: {},
        });
        setLoading();
      }
    );
  };

  const handleMyAddiv2Change = (value) => {
    if (value === 1) {
      setMyValues({
        ...myValues,
        addiv2: {},
        addiv3: {},
        addiv3s: [],
      });
    } else {
      const addiv2 = addiv2s.filter((addiv2) => addiv2._id === value);
      const addiv1 = addiv1s.filter(
        (addiv1) => addiv1._id === addiv2[0].adDivId1
      );
      const country = countries.filter(
        (country) => country._id === addiv1[0].couid
      );
      setLoading(3);
      getAllMyAddiv3(
        country[0]._id,
        addiv1[0]._id,
        addiv2[0]._id,
        country[0].countryCode
      ).then((res) => {
        setMyValues({
          ...myValues,
          addiv2: addiv2[0],
          addiv3: {},
          addiv3s: res.data,
        });
        setLoading();
      });
    }
  };

  const handleMyAddiv3Change = (value) => {
    if (value === 1) {
      setMyValues({
        ...myValues,
        addiv3: {},
      });
    } else {
      const addiv3 = addiv3s.filter((addiv3) => addiv3._id === value);
      const addiv2 = addiv2s.filter(
        (addiv2) => addiv2._id === addiv3[0].adDivId2
      );
      const addiv1 = addiv1s.filter(
        (addiv1) => addiv1._id === addiv2[0].adDivId1
      );
      const country = countries.filter(
        (country) => country._id === addiv1[0].couid
      );
      setLoading(3);
      getAllMyAddiv3(
        country[0]._id,
        addiv1[0]._id,
        addiv2[0]._id,
        country[0].countryCode
      ).then((res) => {
        setMyValues({
          ...myValues,
          addiv3: addiv3[0],
        });
        setLoading();
      });
    }
  };

  const addMultiple = () => {
    if (addiv3._id) {
      const unique = _.uniqWith(
        [
          ...values.noAvail,
          {
            couid: country._id,
            country: country.name,
            addiv1: addiv1._id,
            addiv1Name: addiv1.name,
            addiv2: addiv2._id,
            addiv2Name: addiv2.name,
            addiv3: addiv3._id,
            addiv3Name: addiv3.name,
          },
        ],
        _.isEqual
      );
      setValues({
        ...values,
        noAvail: unique,
      });
      toast.success(
        `This item will no longer be available in ${addiv3.name}, ${addiv2.name}, ${addiv1.name}, ${country.name}`
      );
      toast.warning(
        "Make sure to hit the Update button below before you proceed"
      );
    } else if (addiv2._id) {
      const unique = _.uniqWith(
        [
          ...values.noAvail,
          {
            couid: country._id,
            country: country.name,
            addiv1: addiv1._id,
            addiv1Name: addiv1.name,
            addiv2: addiv2._id,
            addiv2Name: addiv2.name,
          },
        ],
        _.isEqual
      );
      setValues({
        ...values,
        noAvail: unique,
      });
      toast.success(
        `This item will no longer be available in all areas of ${addiv2.name}, ${addiv1.name}, ${country.name}`
      );
      toast.warning(
        "Make sure to hit the Update button below before you proceed"
      );
    } else if (addiv1._id) {
      const unique = _.uniqWith(
        [
          ...values.noAvail,
          {
            couid: country._id,
            country: country.name,
            addiv1: addiv1._id,
            addiv1Name: addiv1.name,
          },
        ],
        _.isEqual
      );
      setValues({
        ...values,
        noAvail: unique,
      });
      toast.success(
        `This item will no longer be available in all areas of ${addiv1.name}, ${country.name}`
      );
      toast.warning(
        "Make sure to hit the Update button below before you proceed"
      );
    }
  };

  return (
    <>
      {country._id && (
        <NoAvailableProperty
          myValues={myValues}
          loading={loading}
          handleMyCountryChange={handleMyCountryChange}
          handleMyAddiv1Change={handleMyAddiv1Change}
          handleMyAddiv2Change={handleMyAddiv2Change}
          handleMyAddiv3Change={handleMyAddiv3Change}
        />
      )}
      <Button
        type="primary"
        onClick={addMultiple}
        danger
        disabled={!addiv1 || !addiv1._id}
      >
        + All{" "}
        {addiv3._id
          ? addiv3.name
          : addiv2._id
          ? addiv2.name
          : addiv1._id
          ? addiv1.name
          : ""}
      </Button>{" "}
      {loading === 3 && (
        <span>
          <LoadingOutlined />
        </span>
      )}
    </>
  );
};

export default NotAvailableForms;
