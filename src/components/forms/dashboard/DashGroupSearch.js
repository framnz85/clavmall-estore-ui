import React from "react";
import { SearchOutlined } from "@ant-design/icons";
import { isMobile } from 'react-device-detect';

import ShowingForms from '../../common/ShowingForms';

const DashGroupSearch = ({ values, setValues, groupSearchSubmit }) => {
    const { statusOption, paymentOption, } = values;

    const handleMinimum = (e) => {
        setValues({
            ...values,
            minPrice: e.target.value,
        });
    }

    const handleMaximum = (e) => {
        setValues({
            ...values,
            maxPrice: e.target.value,
        });
    }

    const handleDateChange = (value) => {
        setValues({
            ...values,
            dateFrom: value[0]._d,
            dateTo: value[1]._d,
        });
    }

    const handleStatusChange = (value) => {
        setValues({
            ...values,
            status: value,
        });
    }

    const handlePaymentChange = (value) => {
        setValues({
            ...values,
            payment: paymentOption.filter(payment => payment.num === value)[0].desc,
        });
    }

    const formProperty = [
        {
            type: "ant select",
            name: "orderStatus",
            style: {
                width: isMobile ? "100%" : "140px",
                float: "left",
            },
            onChange: handleStatusChange,
            defaultValue: "- All Status -",
            disabled: false,
            options: statusOption.map(
                (status) =>
                (status = {
                    ...status,
                    key: status,
                    value: status,
                    text: status,
                })
            ),
            show: true,
        },
        {
            type: "ant select",
            name: "paymentOption",
            style: {
                width: isMobile ? "100%" : "140px",
                float: "left",
            },
            onChange: handlePaymentChange,
            defaultValue: "- All Payment -",
            disabled: false,
            options: paymentOption.map(
                (payment) =>
                (payment = {
                    ...payment,
                    key: payment.num,
                    value: payment.num,
                    text: payment.desc,
                })
            ),
            show: true,
        },
        {
            type: "ant datepicker",
            name: "createdAt",
            style: {
                width: isMobile ? "100%" : "240px",
                float: "left",
            },
            onChange: handleDateChange,
        },
        {
            type: "numberrange",
            name: "grandTotal",
            style: {
                width: isMobile ? "100%" : "140px",
                float: "left",
            },
            onChangeMinimum: handleMinimum,
            onChangeMaximum: handleMaximum,
            defaultValue: "- Sort By -",
            placeholder: ["min price", "max price"],
            disabled: false,
            show: true,
        },
    ];

    return (
        <>
            <ShowingForms formProperty={formProperty} />
            <SearchOutlined
                style={{ cursor: "pointer", fontSize: "22px", float: "left", padding: "5px 5px 5px 8px" }}
                onClick={groupSearchSubmit}
            />
            <div className="p-1" onClick={() => window.location.reload(false)} style={{ float: "left", cursor: "pointer" }}>
                Refresh
            </div>
        </>
    );
}

export default DashGroupSearch;