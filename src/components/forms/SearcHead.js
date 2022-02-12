import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Input } from "antd";

const { Search } = Input;

const SearcHead = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { search } = useSelector((state) => ({ ...state }));
  const { text } = search;

  const [searchTxt, setSearchTxt] = useState(text);

  const handleChange = (e) => {
    setSearchTxt(e.target.value);
  };

  const handleSubmit = (value) => {
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: value },
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
      style={{ width: 200 }}
    />
  );
};

export default SearcHead;
