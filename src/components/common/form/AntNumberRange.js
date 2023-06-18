import React from "react";
import { Input } from "antd";

const AntNumberRange = ({ inputProperty }) => {
    const { label, style, onChangeMinimum, onChangeMaximum, placeholder } =
        inputProperty;

    return (
        <>
            {label && (
                <label>
                    <b>{label}</b>
                </label>
            )}
            <Input
                type="number"
                placeholder={placeholder[0]}
                size="middle"
                style={style}
                onChange={onChangeMinimum}
            />
            <Input
                type="number"
                placeholder={placeholder[1]}
                size="middle"
                style={style}
                onChange={onChangeMaximum}
            />
        </>
    );
};

export default AntNumberRange;
