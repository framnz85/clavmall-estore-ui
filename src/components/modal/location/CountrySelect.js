import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { getAllMyAddiv1 } from "../../../functions/addiv1";
import { getAllMyAddiv2 } from "../../../functions/addiv2";
import { getAllMyAddiv3 } from "../../../functions/addiv3";

const CountrySelect = ({
  address,
  setAddress,
  countries,
  setAddiv1s,
  setAddiv2s,
  setAddiv3s,
  loading,
  setLoading,
  sourceAddress,
  setAddressSaved,
}) => {
  let dispatch = useDispatch();

  const { location, user } = useSelector((state) => ({
    ...state,
  }));

  useEffect(() => {
    if (sourceAddress
      && sourceAddress.country && sourceAddress.country._id
      && sourceAddress.addiv1 && sourceAddress.addiv1._id
      && sourceAddress.addiv2 && sourceAddress.addiv2._id
      && sourceAddress.addiv3 && sourceAddress.addiv3._id
    ) {
      loadAllMyAddress();
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadAllMyAddress = () => {
    const country = sourceAddress.country ? sourceAddress.country : {};
    const addiv1 = sourceAddress.addiv1 ? sourceAddress.addiv1 : {};
    const addiv2 = sourceAddress.addiv2 ? sourceAddress.addiv2 : {};
    const addiv3 = sourceAddress.addiv3 ? sourceAddress.addiv3 : {};
    const details = sourceAddress.details ? sourceAddress.details : "";

    const addiv1s = location.addiv1s && location.addiv1s.filter((addiv1) =>
      addiv1.couid === country._id
    );

    if (addiv1s && addiv1s.length > 0) {
      setAddiv1s(addiv1s);
    } else {
      getAllMyAddiv1(country._id, country.countryCode).then((res) => {
        setAddiv1s(res.data);
        dispatch({
          type: "LOCATION_LIST_VI",
          payload: { addiv1s: res.data },
        });
      });
    }

    const addiv2s = location.addiv2s && location.addiv2s.filter((addiv2) =>
      addiv2.adDivId1 === addiv1._id
    );

    if (addiv2s && addiv2s.length > 0) {
      setAddiv2s(addiv2s);
    } else {
      setLoading(true);
      getAllMyAddiv2(country._id, addiv1._id, country.countryCode).then(
        (res) => {
          setAddiv2s(res.data);
          dispatch({
            type: "LOCATION_LIST_VI",
            payload: { addiv2s: res.data },
          });
          setLoading(false);
        }
      );
    }

    const addiv3s = location.addiv3s && location.addiv3s.filter((addiv3) =>
      addiv3.adDivId2 === addiv2._id
    );

    if (addiv3s && addiv3s.length > 0) {
      setAddiv3s(addiv3s);
      const newAddiv3 = addiv3s.filter((newAdd) => newAdd._id === addiv3._id);
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
        const newAddiv3 = res.data.filter((newAdd) => newAdd._id === addiv3._id);
        setAddress({
          ...address,
          country,
          addiv1,
          addiv2,
          addiv3: newAddiv3[0],
          details,
        });
        setAddiv3s(res.data);
        dispatch({
          type: "LOCATION_LIST_VI",
          payload: { addiv3s: res.data },
        });
        setLoading(false);
      });
    }
  };

  const handleMyCountryChange = (e) => {
    const country = countries && countries.filter((country) =>
      country._id === e.target.value
    );

    if (country && country.length > 0) {
      setAddress({
        ...address,
        country: country[0],
        addiv1: {},
        addiv2: {},
        addiv3: {},
      });
      const addiv1s = location.addiv1s && location.addiv1s.filter((addiv1) =>
        addiv1.couid === country[0]._id
      );
      if (addiv1s && addiv1s.length > 0) {
        setAddiv1s(addiv1s);
      } else {
        setLoading(true);
        getAllMyAddiv1(country[0]._id, country[0].countryCode).then((res) => {
          setAddiv1s(res.data);
          dispatch({
            type: "LOCATION_LIST_VI",
            payload: { addiv1s: res.data },
          });
          setLoading(false);
        });
      }

      getAllMyAddiv2(country[0]._id, "all", country[0].countryCode).then((res) => {
        dispatch({
          type: "LOCATION_LIST_VI",
          payload: { addiv2s: res.data },
        });
      });
    }
    setAddressSaved(false);
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
      {countries.map((country) => (
          <option key={country._id} value={country._id}>
            {country.name}
          </option>
        ))}
    </select>
  );
};

export default CountrySelect;
