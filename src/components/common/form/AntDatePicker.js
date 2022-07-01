import React from 'react';
import { DatePicker } from 'antd';

const AntDatePicker = ({ inputProperty }) => {
    const { label, style, value, onChange } = inputProperty;

    return (
        <>
            {label && (
                <label>
                    <b>{label}</b>
                </label>
            )}
            <br />
            <DatePicker
                value={value}
                style={style}
                onChange={onChange}
            />
        </>
    );
}

export default AntDatePicker;