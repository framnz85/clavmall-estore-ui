import React from "react";
import { Radio } from "antd";

const InputNumber = ({ inputProperty }) => {
  const { name, label, onChange, value, radio, placeholder, disabled, show } =
    inputProperty;

  return (
    <>
      {show && (
        <div className="form-group">
          {label && (
            <label>
              <b>{label}</b>
            </label>
          )}

          <input
            type="number"
            name={name}
            className="form-control"
            onChange={onChange}
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            autoFocus
          />
          {radio && <>
            {radio.label}
            <Radio.Group
              options={radio.options}
              onChange={radio.onChange}
              value={radio.value}
            />
          </>}
        </div>
      )}
    </>
  );
};

export default InputNumber;
