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
            <div
                style={{
                    float: "left",
                    borderBottom: "1px solid #666666",
                    height: "10px",
                    width: "5px",
                    margin: "3px",
                    color: "#ffffff",
                }}
            >
                a
            </div>
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
