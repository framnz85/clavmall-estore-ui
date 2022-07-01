import React from "react";
import { LoadingOutlined } from "@ant-design/icons";
import ShowingForms from "../../common/ShowingForms";

const SubcatInputs = ({
    values,
    setValues,
    loading,
    categories,
    edit,
}) => {
    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const formProperty = [
        {
            type: "select",
            name: "category",
            label: "Select Category",
            onChange: (e) => setValues({
                ...values, category: e.target.value
            }),
            value: values.category,
            disabled: loading,
            options: categories.map(
                (cat) =>
                    (cat = { ...cat, key: cat._id, value: cat._id, text: cat.name })
            ),
            show: true,
            edit,
        },
        {
            type: "text",
            name: "name",
            label: "Sub-Category Name",
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

export default SubcatInputs;
