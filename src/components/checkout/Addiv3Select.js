import React from "react";

const Addiv3Select = ({
  address,
  loading,
  addiv3s,
  setAddress,
  setAddressSaved,
}) => {
  const handleMyAddiv3Change = (e) => {
    setAddressSaved(false);

    const addiv3 = addiv3s.filter((addiv3) => addiv3._id === e.target.value);

    if (addiv3 && addiv3.length > 0) {
      setAddress({
        ...address,
        addiv3: addiv3[0],
      });
    }
  };

  return (
    <select
      name="addiv3"
      className="form-control"
      onChange={handleMyAddiv3Change}
      value={address.addiv3 && address.addiv3._id ? address.addiv3._id : ""}
      disabled={loading}
    >
      <option value="" disabled hidden>
        - choose -
      </option>
      {addiv3s.length > 0 &&
        addiv3s.map((addiv3) => (
          <option key={addiv3._id} value={addiv3._id}>
            {addiv3.name}
          </option>
        ))}
    </select>
  );
};

export default Addiv3Select;
