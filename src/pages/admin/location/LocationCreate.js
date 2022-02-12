import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import AdminNav from "../../../components/nav/AdminNav";
import { getAllCountry, getAllMyCountry } from "./../../../functions/country";
import { getAllAddiv1, getAllMyAddiv1 } from "./../../../functions/addiv1";
import { getAllAddiv2, getAllMyAddiv2 } from "./../../../functions/addiv2";
import {
  getNewAdded3,
  getAllAddiv3,
  getAllMyAddiv3,
} from "./../../../functions/addiv3";
import LocationForm from "./../../../components/forms/LocationForms";
import MyLocationForm from "./../../../components/forms/MyLocationForms";
import MyLocationCard from "./../../../components/cards/MyLocationCard";
import {
  copyAllAddiv1,
  saveCreatedLocation1,
  copyAllAddiv2,
  saveCreatedLocation2,
  copyAllAddiv3,
  saveCreatedLocation3,
  saveLocation3,
} from "./../../../functions/estore";

const initialState = {
  country: {},
  countries: [],
  addiv1: { _id: "", name: "" },
  addiv1s: [],
  addiv2: { _id: "", name: "" },
  addiv2s: [],
  addiv3: { _id: "", name: "" },
  addiv3s: [],
  minorder: "100",
  maxorder: "2500",
  delfee: "5",
  delfeetype: "%",
  discount: "1",
  discounttype: "%",
  servefee: "5",
  servefeetype: "%",
  deltime: "1",
  deltimetype: "days",
};

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

const LocationCreate = () => {
  const [values, setValues] = useState(initialState);
  const [myValues, setMyValues] = useState(initialMyState);
  const [loading, setLoading] = useState(0);

  const { user, estore } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadAllCountry();
    loadAllMyCountry();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadAllCountry = () => {
    setLoading(2);
    getAllCountry().then((res) => {
      setValues({
        ...initialState,
        countries: res.data,
      });
      setLoading(0);
    });
  };

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
        setLoading(0);
      });
    });
  };

  const handleCountryChange = (e) => {
    const country = values.countries.filter(
      (country) => country._id === e.target.value
    );
    setLoading(2);
    getAllAddiv1(country[0]._id, country[0].countryCode).then((res) => {
      setValues({
        ...values,
        country: country[0],
        addiv1: { _id: "", name: "" },
        addiv1s: res.data,
        addiv2: { _id: "", name: "" },
        addiv2s: [],
        addiv3: { _id: "", name: "" },
        addiv3s: [],
      });
      setLoading(0);
    });
  };

  const handleAddiv1Change = (e) => {
    if (e.target.value === "1") {
      setValues({
        ...values,
        addiv1: { _id: "1", name: "all" },
        addiv2: { _id: "1", name: "all" },
        addiv2s: [],
        addiv3: { _id: "1", name: "all" },
        addiv3s: [],
      });
    } else if (e.target.value === "2") {
      setValues({
        ...values,
        addiv1: { _id: "2", name: "" },
        addiv2: { _id: "2", name: "" },
        addiv2s: [],
        addiv3: { _id: "2", name: "" },
        addiv3s: [],
      });
    } else {
      const addiv1 = values.addiv1s.filter(
        (addiv1) => addiv1._id === e.target.value
      );
      const country = values.countries.filter(
        (country) => country._id === addiv1[0].couid
      );
      setLoading(2);
      getAllAddiv2(country[0]._id, addiv1[0]._id, country[0].countryCode).then(
        (res) => {
          setValues({
            ...values,
            addiv1: addiv1[0],
            addiv2: { _id: "", name: "" },
            addiv2s: res.data,
            addiv3: { _id: "", name: "" },
            addiv3s: [],
          });
          setLoading(0);
        }
      );
    }
  };

  const handleAddiv2Change = (e) => {
    if (e.target.value === "1") {
      setValues({
        ...values,
        addiv2: { _id: "1", name: "all" },
        addiv3: { _id: "1", name: "all" },
        addiv3s: [],
      });
    } else if (e.target.value === "2") {
      setValues({
        ...values,
        addiv2: { _id: "2", name: "" },
        addiv3: { _id: "2", name: "" },
        addiv3s: [],
      });
    } else {
      const addiv2 = values.addiv2s.filter(
        (addiv2) => addiv2._id === e.target.value
      );
      const addiv1 = values.addiv1s.filter(
        (addiv1) => addiv1._id === addiv2[0].adDivId1
      );
      const country = values.countries.filter(
        (country) => country._id === addiv1[0].couid
      );
      setLoading(2);
      getAllAddiv3(
        country[0]._id,
        addiv1[0]._id,
        addiv2[0]._id,
        country[0].countryCode
      ).then((res) => {
        setValues({
          ...values,
          addiv2: addiv2[0],
          addiv3: { _id: "", name: "" },
          addiv3s: res.data,
        });
        setLoading(0);
      });
    }
  };

  const handleAddiv3Change = (e) => {
    if (e.target.value === "1") {
      setValues({
        ...values,
        addiv3: { _id: "1", name: "all" },
      });
    } else if (e.target.value === "2") {
      setValues({
        ...values,
        addiv3: { _id: "2", name: "" },
      });
    } else {
      const addiv3 = values.addiv3s.filter(
        (addiv3) => addiv3._id === e.target.value
      );
      setValues({
        ...values,
        addiv3: addiv3[0],
      });
    }
  };

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
      deltime,
      deltimetype,
    };

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
  };

  const handleMyCountryChange = (value) => {
    const country = myValues.countries.filter(
      (country) => country._id === value
    );
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
      setLoading(0);
    });
  };

  const handleMyAddiv1Change = (value) => {
    const addiv1 = myValues.addiv1s.filter((addiv1) => addiv1._id === value);
    const country = myValues.countries.filter(
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
        setLoading(0);
      }
    );
  };

  const handleMyAddiv2Change = (value) => {
    const addiv2 = myValues.addiv2s.filter((addiv2) => addiv2._id === value);
    const addiv1 = myValues.addiv1s.filter(
      (addiv1) => addiv1._id === addiv2[0].adDivId1
    );
    const country = myValues.countries.filter(
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
      setLoading(0);
    });
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-m-2">
          <AdminNav />
        </div>

        <div className="col-md-10 bg-white mt-3 mb-5 pb-5">
          <h4 style={{ margin: "20px 0" }}>Location Create</h4>
          <hr />

          <LocationForm
            values={values}
            setValues={setValues}
            handleCountryChange={handleCountryChange}
            handleAddiv1Change={handleAddiv1Change}
            handleAddiv2Change={handleAddiv2Change}
            handleAddiv3Change={handleAddiv3Change}
            handleSubmit={handleSubmit}
            loading={loading}
          />

          <h4 style={{ margin: "40px 0 20px 0" }}>Show My Location</h4>
          <hr />

          <MyLocationForm
            myValues={myValues}
            setMyValues={setMyValues}
            handleMyCountryChange={handleMyCountryChange}
            handleMyAddiv1Change={handleMyAddiv1Change}
            handleMyAddiv2Change={handleMyAddiv2Change}
            loading={loading}
          />
          <br />
          <br />
          <MyLocationCard myValues={myValues} setMyValues={setMyValues} />
        </div>
      </div>
    </div>
  );
};

export default LocationCreate;
