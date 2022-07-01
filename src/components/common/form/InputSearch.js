import React from "react";

const InputSearch = ({ keyword, setKeyword, placeholder, data, setData }) => {
  const handleSeachChange = (e) => {
    e.preventDefault();
    setKeyword(e.target.value.toLowerCase());
    setData({ ...data, currentPage: 1, sort: -1 });
  };

  return (
    <input
      type="search"
      name="search"
      className="form-control mb-4"
      onChange={handleSeachChange}
      value={keyword}
      placeholder={placeholder}
    />
  );
};

export default InputSearch;
