import React, { useState } from "react";

import AdminNav from "../../../components/nav/AdminNav";
import LocationInputs from "../../../components/forms/location/LocationInputs";
import LocationDetails from "../../../components/forms/location/LocationDetails";
import LocationButton from "../../../components/forms/location/LocationButton";
import MyLocationForm from "../../../components/forms/location/MyLocationForms";
import MyLocationTable from "../../../components/forms/location/MyLocationTable";
import EstoreExpired from "../../../components/common/EstoreExpired";
import AddDomain from "../../../components/common/addDomain";

const initialState = {
  country: {},
  countries: [],
  addiv1: { _id: "", name: "" },
  addiv1s: [],
  addiv2: { _id: "", name: "" },
  addiv2s: [],
  addiv3: { _id: "", name: "" },
  addiv3s: [],
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

const initialMyState = {
  country: {},
  countries: [],
  addiv1: {},
  addiv1s: [],
  addiv2: {},
  addiv2s: [],
  addiv3: {},
  addiv3s: [],
  itemsCount: 0,
  pageSize: 10,
  currentPage: 1,
  sortkey: "",
  sort: -1,
  searchQuery: "",
};

const LocationCreate = () => {
  const [values, setValues] = useState(initialState);
  const [myValues, setMyValues] = useState(initialMyState);
  const [loading, setLoading] = useState(0);
  const [keyword, setKeyword] = useState("");

  return (
    <div className="container">
      <div className="row">
        <div className="col-m-2">
          <AdminNav />
        </div>

        <div className="col-md-10 bg-white mt-3 mb-5">
          <EstoreExpired />
          
          <h4 style={{ margin: "20px 0" }}>Location Create</h4>
          <hr />

          <LocationInputs
            initialState={initialState}
            values={values}
            setValues={setValues}
            loading={loading}
            setLoading={setLoading}
            edit={false}
          />

          <LocationDetails
            values={values}
            setValues={setValues}
            loading={loading}
            edit={false}
          />

          <LocationButton
            values={values}
            loading={loading}
            setLoading={setLoading}
            edit={false}
          />

          <h4 style={{ margin: "40px 0 20px 0" }}>Show My Location</h4>
          <hr />

          <MyLocationForm
            loading={loading}
            setLoading={setLoading}
            myValues={myValues}
            setMyValues={setMyValues}
            keyword={keyword}
            setKeyword={setKeyword}
          />
          <br />
          <br />
          <MyLocationTable myValues={myValues} setMyValues={setMyValues} keyword={keyword} />
          <br /><br />
          
          <div style={{ paddingBottom: 10 }}>
            <AddDomain />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationCreate;
