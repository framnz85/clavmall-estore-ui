import React from "react";
import { DatePicker } from "antd";

const { RangePicker } = DatePicker;

const AntRangePicker = ({ inputProperty }) => {
    const { label, style, onChange } = inputProperty;

    return (
        <>
            {label && (
                <label>
                    <b>{label}</b>
                </label>
            )}
            <RangePicker
                style={style}
                onChange={onChange}
            />
        </>
    );
};

export default AntRangePicker;
