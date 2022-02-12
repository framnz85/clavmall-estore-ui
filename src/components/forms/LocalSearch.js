import React from "react";

const LocalSearch = ({ keyword, setKeyword, placeholder }) => {
  const handleSeachChange = (e) => {
    e.preventDefault();
    setKeyword(e.target.value.toLowerCase());
  };

  return (
    <input
      type="search"
      placeholder={placeholder}
      value={keyword}
      onChange={handleSeachChange}
      className="form-control mb-4"
    />
  );
};

export default LocalSearch;
