import React from "react";

const InputSelect = ({ inputProperty }) => {
  const { label, onChange, value, disabled, optgroup, options, show } =
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

          <select
            name="category"
            className="form-control"
            onChange={onChange}
            value={value}
            disabled={disabled}
          >
            <option value="" disabled hidden>
              - choose -
            </option>
            {options &&
              options.map((option) => (
                <option key={option.key} value={option.value}>
                  {option.text}
                </option>
              ))}
            {optgroup &&
              optgroup.map((opt) => (
                <optgroup key={opt.key} label={opt.label}>
                  {opt.options &&
                    opt.options.map((option) => (
                      <option key={option.key} value={option.value}>
                        {option.text}
                      </option>
                    ))}
                </optgroup>
              ))}
          </select>
        </div>
      )}
    </>
  );
};

export default InputSelect;
