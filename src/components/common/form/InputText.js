import React from "react";

const InputText = ({ inputProperty }) => {
  const { name, label, onChange, value, placeholder, disabled, show } =
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
            type="text"
            name={name}
            className="form-control"
            onChange={onChange}
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            autoFocus
          />
        </div>
      )}
    </>
  );
};

export default InputText;
