import React from "react";
import { Button } from 'antd';

const AntButton = ({ inputProperty }) => {
    const { label, onSubmit, show } = inputProperty;

    return (
    <>
        {show && (
            <>
                <Button type="primary" onClick={onSubmit}>{label}</Button>
                <br /><br />
            </>
        )}
    </>
    );
}

export default AntButton;