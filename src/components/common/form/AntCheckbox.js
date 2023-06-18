import React from "react";
import { Checkbox } from "antd";

const AntCheckbox = ({ inputProperty }) => {
    const { label, style, onChange, value, breakLine } = inputProperty;

    return (
        <>
            <Checkbox
                onChange={onChange}
                checked={value}
                style={style}
            >
                {label}
            </Checkbox>
            {breakLine && <br />}
        </>
    );
}

export default AntCheckbox;