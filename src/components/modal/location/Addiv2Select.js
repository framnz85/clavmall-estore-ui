import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { getAllMyAddiv3 } from "../../../functions/addiv3";

const Addiv2Select = ({
  address,
  setAddress,
  countries,
  addiv1s,
  addiv2s,
  setAddiv3s,
  loading,
  setLoading,
  setAddressSaved
}) => {
  let dispatch = useDispatch();

  const { location } = useSelector((state) => ({
    ...state,
  }));

  const handleMyAddiv2Change = (e) => {
    const addiv2 = addiv2s.filter((addiv2) => addiv2._id === e.target.value);
    const addiv1 = addiv1s.filter(
      (addiv1) => addiv1._id === addiv2[0].adDivId1
    );
    const country = countries.filter((country) => country._id === addiv1[0].couid);

    if (addiv2 && addiv2.length > 0) {
      setAddress({
        ...address,
        addiv2: addiv2[0],
        addiv3: {},
      });

      const addiv3s =
        location.addiv3s &&
        location.addiv3s.filter((addiv3) => addiv3.adDivId2 === addiv2[0]._id);

      if (addiv3s && addiv3s.length > 0) {
        setAddiv3s(addiv3s);
      } else {
        setLoading(true);
        getAllMyAddiv3(
          country[0]._id,
          addiv1[0]._id,
          addiv2[0]._id,
          country[0].countryCode
        ).then((res) => {
          setAddiv3s(res.data);
          dispatch({
            type: "LOCATION_LIST_V",
            payload: { addiv3s: res.data },
          });
          setLoading(false);
        });
      }
    }
    setAddressSaved(false);
  };

  return (
    <select
      name="addiv2"
      className="form-control"
      onChange={handleMyAddiv2Change}
      value={address.addiv2 && address.addiv2._id ? address.addiv2._id : ""}
      disabled={loading}
    >
      <option value="" disabled hidden>
        - choose -
      </option>
      {addiv2s.map((addiv2) => (
          <option key={addiv2._id} value={addiv2._id}>
            {addiv2.name}
          </option>
        ))}
    </select>
  );
};

export default Addiv2Select;
