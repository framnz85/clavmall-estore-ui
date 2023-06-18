import React from "react";
import DatePicker from "react-datepicker";

const InputDatePicker = ({ inputProperty }) => {
    const { label, value, onChange, disabled, showTimeSelect, show } = inputProperty;

    return (
        <>
            {show && (
                <div className="form-group">
                    {label && (
                        <label>
                            <b>{label}</b>
                        </label>
                    )}

                    <DatePicker
                        className="form-control"
                        selected={new Date()}
                        value={value}
                        onChange={onChange}
                        disabled={disabled}
                        showTimeSelect={showTimeSelect}
                        required
                    />
                </div>
            )}
        </>
    );
}

export default InputDatePicker;