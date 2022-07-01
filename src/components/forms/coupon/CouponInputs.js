import React from "react";
import { LoadingOutlined } from "@ant-design/icons";
import ShowingForms from "../../common/ShowingForms";

const CouponInputs = ({
    values,
    setValues,
    loading,
    edit,
}) => {
    const { name, code, discount, expiry } = values;

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const formProperty = [
        {
            type: "text",
            name: "name",
            label: "Name",
            onChange: handleChange,
            value: name,
            disabled: loading,
            show: true,
            edit,
        },
        {
            type: "text",
            name: "code",
            label: "Code",
            onChange: handleChange,
            value: code,
            disabled: loading,
            show: true,
            edit,
        },
        {
            type: "text",
            name: "discount",
            label: "Discount %",
            onChange: handleChange,
            value: discount,
            placeholder: "0%",
            disabled: loading,
            show: true,
            edit,
        },
        {
            type: "datepicker",
            name: "expiry",
            label: "Expiry",
            onChange: (date) => setValues({ ...values, expiry: date }),
            value: expiry && expiry.toLocaleDateString(),
            showTimeSelect: true,
            disabled: loading,
            show: true,
            edit,
        },
    ];

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
}

export default CouponInputs;