import React from "react";
import { Select } from "antd";

const { Option } = Select;

const AntSelect = ({ inputProperty }) => {
  const { label, style, mode, onChange, value, defaultValue, options } =
    inputProperty;

  return (
    <>
      {label && (
        <label>
          <b>{label}</b>
        </label>
      )}
      <Select
        mode={mode}
        style={style}
        onChange={onChange}
        value={value}
        defaultValue={defaultValue}
      >
        {options &&
          options.map((option) => (
            <Option key={option.key} value={option.value}>
              {option.text}
            </Option>
          ))}
      </Select>
    </>
  );
};

export default AntSelect;
