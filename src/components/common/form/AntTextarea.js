import React from 'react';
import { Input } from 'antd';

const { TextArea } = Input;

const AntTextarea = ({ inputProperty }) => {
    const { label, value, onChange } = inputProperty;

    return (
        <>
            {label && (
                <label>
                    <b>{label}</b>
                </label>
            )}
            <TextArea rows={4} value={value} onChange={onChange} />
        </>
    );
}

export default AntTextarea;