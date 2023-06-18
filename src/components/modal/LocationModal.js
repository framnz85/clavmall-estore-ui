import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal } from "antd";
import { toast } from "react-toastify";

import CountrySelect from "./location/CountrySelect";
import Addiv1Select from "./location/Addiv1Select";
import Addiv2Select from "./location/Addiv2Select";
import Addiv3Select from "./location/Addiv3Select";

import { getAllMyCountry } from "../../functions/country";
import { createOrUpdateUser } from "../../functions/auth";

const initialAddress = {
  country: {},
  addiv1: {},
  addiv2: {},
  addiv3: {},
};

const LocationModal = ({ locModalVisible, setLocModalVisible }) => {
  let dispatch = useDispatch();

  const { estore, user, location } = useSelector((state) => ({
    ...state,
  }));

  const [countries, setCountries] = useState([]);
  const [addiv1s, setAddiv1s] = useState([]);
  const [addiv2s, setAddiv2s] = useState([]);
  const [addiv3s, setAddiv3s] = useState([]);
  const [address, setAddress] = useState(initialAddress);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAllMyCountry();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadAllMyCountry = () => {
    if (location.countries && location.countries.length > 0) {
      setCountries(location.countries);
    }else{
      getAllMyCountry().then((res) => {
        setCountries(res.data);
        dispatch({
          type: "LOCATION_LIST_III",
          payload: { countries: res.data },
        });
      });
    }
  };

  const handleModal = async () => {
    if (address.addiv3 && address.addiv3._id) {
      dispatch({
        type: "PRODUCT_LIST_IX",
        payload: [],
      });
      dispatch({
        type: "CATEGORY_LIST_XV",
        payload: [],
      });
      dispatch({
        type: "LOGGED_IN_USER_VII",
        payload: { address },
      });
      localStorage.setItem(
        "estore",
        JSON.stringify({ ...estore, userAddress: address })
      );
      dispatch({
          type: "INPUTS_OBJECT_IV",
          payload: {cart: []},
      });
      localStorage.removeItem("cart");

      if (user._id) {
          await createOrUpdateUser(user.token, { address });
      }

      window.location.reload();
    } else {
      toast.error("No location have entered");
    }
  };

  return (
    <>
      <Modal
        title="Place your location so we may know what products can be delivered to you"
        centered
        visible={locModalVisible}
        onOk={handleModal}
        onCancel={() => setLocModalVisible(false)}
      >
        <div className="form-group">
          <label>
            <b>Country</b>
          </label>
          <CountrySelect
            address={address}
            setAddress={setAddress}
            countries={countries}
            setAddiv1s={setAddiv1s}
            setAddiv2s={setAddiv2s}
            setAddiv3s={setAddiv3s}
            loading={loading}
            setLoading={setLoading}
            sourceAddress={user.address}
            setAddressSaved={() => ""}
          />
        </div>
        {estore.country && estore.country.adDivName1 && (
          <div className="form-group">
            <label>
              <b>{estore.country.adDivName1}</b>
            </label>
            <Addiv1Select
              address={address}
              setAddress={setAddress}
              countries={countries}
              addiv1s={addiv1s}
              setAddiv2s={setAddiv2s}
              loading={loading}
              setLoading={setLoading}
              setAddressSaved={() => ""}
            />
          </div>
        )}
        {estore.country && estore.country.adDivName1 && (
          <div className="form-group">
            <label>
              <b>{estore.country.adDivName2}</b>
            </label>
            <Addiv2Select
              address={address}
              setAddress={setAddress}
              countries={countries}
              addiv1s={addiv1s}
              addiv2s={addiv2s}
              setAddiv3s={setAddiv3s}
              loading={loading}
              setLoading={setLoading}
              setAddressSaved={() => ""}
            />
          </div>
        )}
        {estore.country && estore.country.adDivName1 && (
          <div className="form-group">
            <label>
              <b>{estore.country.adDivName3}</b>
            </label>
            <Addiv3Select
              address={address}
              setAddress={setAddress}
              addiv3s={addiv3s}
              loading={loading}
              setAddressSaved={() => ""}
            />
          </div>
        )}
      </Modal>
    </>
  );
};

export default LocationModal;
