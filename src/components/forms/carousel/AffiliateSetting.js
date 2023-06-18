import React from "react";
import ShowingForms from "../../common/ShowingForms";

const OtherSettings = ({ values, setValues }) => {

    const { allowAffiliateUser } = values;

    const handleChange = (value, prop) => {
        setValues({
            ...values,
            [prop]: value,
        })
    }

    const formProperty = [
        {
            type: "ant checked",
            name: "allowAffiliateUser",
            label: "Allow customers to build thier own online grocery",
            style: { marginBottom: "10px" },
            onChange: (e) => handleChange(e.target.checked, "allowAffiliateUser"),
            value: allowAffiliateUser,
            breakLine: true,
        },
    ];

    return (
        <>
            <div className="pl-3">
                <label>
                    <b>Other Settings</b>
                </label>
                <br />
                <br />
            </div>
            <div className="pl-3">

                <ShowingForms formProperty={formProperty} />

            </div>
        </>
    );
}

export default OtherSettings;