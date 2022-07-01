import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { getAllMyAddiv2 } from "../../../functions/addiv2";
import { getAllMyAddiv3 } from "../../../functions/addiv3";

const Addiv1Select = ({
  address,
  setAddress,
  countries,
  addiv1s,
  setAddiv2s,
  loading,
  setLoading,
  setAddressSaved
}) => {
  let dispatch = useDispatch();

  const { location } = useSelector((state) => ({
    ...state,
  }));

  const handleMyAddiv1Change = (e) => {
    const addiv1 = addiv1s.filter((addiv1) => addiv1._id === e.target.value);
    const country = countries.filter((country) =>
      country._id === addiv1[0].couid
    );

    if (addiv1 && addiv1.length > 0) {
      setAddress({
        ...address,
        addiv1: addiv1[0],
        addiv2: {},
        addiv3: {},
      });
      const addiv2s = location.addiv2s && location.addiv2s.filter((addiv2) =>
        addiv2.adDivId1 === addiv1[0]._id
      );
      if (addiv2s && addiv2s.length > 0) {
        setAddiv2s(addiv2s);
      } else {
        setLoading(true);
        getAllMyAddiv2(
          country[0]._id,
          addiv1[0]._id,
          country[0].countryCode
        ).then((res) => {
          setAddiv2s(res.data);
          dispatch({
            type: "LOCATION_LIST_IV",
            payload: { addiv2s: res.data },
          });
          setLoading(false);
        });
      }

      getAllMyAddiv3(
        country[0]._id,
        addiv1[0]._id,
        "all",
        country[0].countryCode
      ).then((res) => {
        dispatch({
          type: "LOCATION_LIST_IV",
          payload: { addiv3s: res.data },
        });
      });
    }
    setAddressSaved(false);
  };

  return (
    <select
      name="addiv1"
      className="form-control"
      onChange={handleMyAddiv1Change}
      value={address.addiv1 && address.addiv1._id ? address.addiv1._id : ""}
      disabled={loading}
    >
      <option value="" disabled hidden>
        - choose -
      </option>
      {addiv1s.map((addiv1) => (
          <option key={addiv1._id} value={addiv1._id}>
            {addiv1.name}
          </option>
        ))}
    </select>
  );
};

export default Addiv1Select;
