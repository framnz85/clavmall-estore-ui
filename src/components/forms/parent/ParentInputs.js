import React from "react";
import { LoadingOutlined } from "@ant-design/icons";
import ShowingForms from "../../common/ShowingForms";

const ParentInputs = ({
    values,
    setValues,
    loading,
    edit,
}) => {

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const formProperty = [
        {
            type: "text",
            name: "name",
            label: "Parent Name",
            onChange: handleChange,
            value: values.name,
            disabled: loading,
            show: true,
            edit,
        },
    ]

    return (
        <>
            {loading && (
                <h4 style={{ margin: "20px 0" }}>
                    <LoadingOutlined />
                </h4>
            )}

            <ShowingForms formProperty={formProperty} />
        </>
    );
};

export default ParentInputs;
