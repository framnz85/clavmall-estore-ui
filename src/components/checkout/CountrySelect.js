import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllMyAddiv1 } from "../../functions/addiv1";
import { getAllMyAddiv2 } from "../../functions/addiv2";
import { getAllMyAddiv3 } from "../../functions/addiv3";

const CountrySelect = ({
  address,
  loading,
  setAddress,
  setAddiv1s,
  setAddiv2s,
  setAddiv3s,
  setLoading,
  setAddressSaved,
}) => {
  let dispatch = useDispatch();

  const { user, location } = useSelector((state) => ({
    ...state,
  }));

  useEffect(() => {
    if (user.address) {
      loadAllMyAddress();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadAllMyAddress = () => {
    const country = user.address.country ? user.address.country : {};
    const addiv1 = user.address.addiv1 ? user.address.addiv1 : {};
    const addiv2 = user.address.addiv2 ? user.address.addiv2 : {};
    const addiv3 = user.address.addiv3 ? user.address.addiv3 : {};
    const details = user.address.details ? user.address.details : "";

    const addiv1s =
      location.addiv1s &&
      location.addiv1s.filter((addiv1) => addiv1.couid === country._id);

    if (addiv1s && addiv1s.length > 0) {
      setAddiv1s(addiv1s);
    } else {
      getAllMyAddiv1(country._id, country.countryCode).then((res) => {
        dispatch({
          type: "LOCATION_LIST",
          payload: { addiv1s: res.data },
        });
        setAddiv1s(res.data);
      });
    }

    const addiv2s =
      location.addiv2s &&
      location.addiv2s.filter((addiv2) => addiv2.adDivId1 === addiv1._id);

    if (addiv2s && addiv2s.length > 0) {
      setAddiv2s(addiv2s);
    } else {
      setLoading(true);
      getAllMyAddiv2(country._id, addiv1._id, country.countryCode).then(
        (res) => {
          dispatch({
            type: "LOCATION_LIST",
            payload: { addiv2s: res.data },
          });
          setAddiv2s(res.data);
          setLoading(false);
        }
      );
    }

    const addiv3s =
      location.addiv3s &&
      location.addiv3s.filter((addiv3) => addiv3.adDivId2 === addiv2._id);

    if (addiv3s && addiv3s.length > 0) {
      setAddiv3s(addiv3s);

      const newAddiv3 =
        addiv3s && addiv3s.filter((newAdd) => newAdd._id === addiv3._id);

      setAddress({
        ...address,
        country,
        addiv1,
        addiv2,
        addiv3: newAddiv3[0],
        details,
      });
    } else {
      setLoading(true);
      getAllMyAddiv3(
        country._id,
        addiv1._id,
        addiv2._id,
        country.countryCode
      ).then((res) => {
        dispatch({
          type: "LOCATION_LIST",
          payload: { addiv3s: res.data },
        });
        setAddiv3s(res.data);

        const newAddiv3 =
          res.data && res.data.filter((newAdd) => newAdd._id === addiv3._id);

        setAddress({
          ...address,
          country,
          addiv1,
          addiv2,
          addiv3: newAddiv3[0],
          details,
        });

        setLoading(false);
      });
    }
  };

  const handleMyCountryChange = (e) => {
    setAddressSaved(false);

    const country =
      location.countries &&
      location.countries.filter((country) => country._id === e.target.value);

    if (country && country.length > 0) {
      setAddress({
        ...address,
        country: country[0],
        addiv1: {},
        addiv2: {},
        addiv3: {},
      });

      const addiv1s =
        location.addiv1s &&
        location.addiv1s.filter((addiv1) => addiv1.couid === country[0]._id);

      if (addiv1s && addiv1s.length > 0) {
        setAddiv1s(addiv1s);
      } else {
        setLoading(true);
        getAllMyAddiv1(country[0]._id, country[0].countryCode).then((res) => {
          dispatch({
            type: "LOCATION_LIST",
            payload: { addiv1s: res.data },
          });
          setAddiv1s(res.data);
          setLoading(false);
        });
      }

      getAllMyAddiv2(country[0]._id, "all", country[0].countryCode).then(
        (res) => {
          dispatch({
            type: "LOCATION_LIST",
            payload: { addiv2s: res.data },
          });
        }
      );
    }
  };

  return (
    <select
      name="country"
      className="form-control"
      onChange={handleMyCountryChange}
      value={address.country && address.country._id ? address.country._id : ""}
      disabled={loading}
    >
      <option value="" disabled hidden>
        - choose -
      </option>
      {location.countries &&
        location.countries.length > 0 &&
        location.countries.map((country) => (
          <option key={country._id} value={country._id}>
            {country.name}
          </option>
        ))}
    </select>
  );
};

export default CountrySelect;
