import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Input } from "antd";
import { isMobile } from 'react-device-detect';

const { Search } = Input;

const SearchHead = () => {
  const history = useHistory();
  let dispatch = useDispatch();

  const { inputs } = useSelector(
    (state) => ({
      ...state,
    })
  );

  const [searchTxt, setSearchTxt] = useState(inputs.searchText);

  const handleChange = (e) => {
    setSearchTxt(e.target.value);
  };

  const handleSubmit = (value) => {
    dispatch({
        type: "INPUTS_OBJECT_V",
        payload: { searchText: value },
    });
    history.push(`/shop?text=${value}`);
  };

  return (
    <Search
      className="bg-secondary"
      placeholder="Search"
      value={searchTxt}
      onChange={handleChange}
      onSearch={(value) => handleSubmit(value)}
      style={{ width: isMobile ? window.innerWidth-72 : "300px" }}
    />
  );
};

export default SearchHead;
