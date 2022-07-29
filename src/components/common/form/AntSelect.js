import React from "react";
import { Select } from "antd";

const { Option, OptGroup  } = Select;

const AntSelect = ({ inputProperty }) => {
  const { label, style, mode, onChange, value, defaultValue, options, optgroup } =
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
          ))
        }
        {optgroup &&
          optgroup.map((opt) => (
            <OptGroup key={opt.key} label={opt.label}>
              {opt.options &&
                opt.options.map((option) => (
                  <Option key={option.key} value={option.value}>
                    {option.text}
                  </Option>
                ))}
            </OptGroup>
          ))
        }
      </Select>
    </>
  );
};

export default AntSelect;
