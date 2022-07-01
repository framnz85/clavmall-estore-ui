import React from 'react';
import ShowingForms from "../../common/ShowingForms";

const LocationProperty = ({
    values,
    setValues,
    loading,
    setLoading,
    edit,
    handleCountryChange,
    handleAddiv1Change,
    handleAddiv2Change,
    handleAddiv3Change,
}) => {
    const {
        country,
        countries,
        addiv1,
        addiv1s,
        addiv2,
        addiv2s,
        addiv3,
        addiv3s
    } = values;

    const formProperty = [
        {
            type: "select",
            name: "country",
            label: "Country",
            onChange: handleCountryChange,
            value: country && country._id ? country._id : "",
            disabled: loading === 1,
            options: countries.map(
                (country) =>
                    (country = { ...country, key: country._id, value: country._id, text: country.name })
            ),
            show: true,
            edit,
        },
        {
            type: "select",
            name: "addiv1s",
            label: country.adDivName1,
            onChange: handleAddiv1Change,
            value: addiv1 && addiv1._id,
            disabled: loading === 1,
            optgroup: [
                {
                    key: 1,
                    label: "Add All",
                    options: [{ key: 1, value: 1, text: `Add all ${country.adDivName1}` }],
                },
                {
                    key: 2,
                    label: "Create New",
                    options: [{ key: 2, value: 2, text: "+ Create" }],
                },
                {
                    key: 3,
                    label: "Created",
                },
                {
                    key: 4,
                    label: "Suggested",
                    options: addiv1s.length > 0 &&
                        addiv1s.map(
                            (addiv1) =>
                            (addiv1 = {
                                ...addiv1,
                                key: addiv1._id,
                                value: addiv1._id,
                                text: addiv1.name,
                            })
                        ),
                },
            ],
            show: country && country.adDivName1,
            edit,
        },
        {
            type: "text",
            name: "addiv1",
            onChange: (e) =>
                setValues({
                    ...values,
                    addiv1: { ...addiv1, name: e.target.value },
                })
            ,
            value: addiv1.name,
            disabled: loading === 1,
            placeholder: `Type a ${country.adDivName1} here`,
            show: addiv1 && addiv1._id === "2",
            edit,
        },
        {
            type: "select",
            name: "addiv2s",
            label: country.adDivName2,
            onChange: handleAddiv2Change,
            value: addiv2 && addiv2._id,
            disabled: loading === 1,
            optgroup: [
                {
                    key: 1,
                    label: "Add All",
                    options: (addiv1._id === "1" || addiv1._id === "2") && addiv2._id === "2" ?
                        (
                            ""
                        ) : (
                            [{ key: 1, value: 1, text: `Add all ${country.adDivName2}` }]
                        ),
                },
                {
                    key: 2,
                    label: "Create New",
                    options: (addiv1._id === "1" || addiv1._id === "2") && addiv2._id === "1" ?
                        (
                            ""
                        ) : (
                            [{ key: 2, value: 2, text: "+ Create" }]
                        ),
                },
                {
                    key: 3,
                    label: "Created",
                },
                {
                    key: 4,
                    label: "Suggested",
                    options: addiv2s.length > 0 &&
                        addiv2s.map(
                            (addiv2) =>
                            (addiv2 = {
                                ...addiv2,
                                key: addiv2._id,
                                value: addiv2._id,
                                text: addiv2.name,
                            })
                        ),
                },
            ],
            show: country && country.adDivName2,
            edit,
        },
        {
            type: "text",
            name: "addiv2",
            onChange: (e) =>
                setValues({
                    ...values,
                    addiv2: { ...addiv2, name: e.target.value },
                })
            ,
            value: addiv2.name,
            disabled: loading === 1,
            placeholder: `Type a ${country.adDivName2} here`,
            show: addiv2 && addiv2._id === "2",
            edit,
        },
        {
            type: "select",
            name: "addiv3s",
            label: country.adDivName3,
            onChange: handleAddiv3Change,
            value: addiv3 && addiv3._id,
            disabled: loading === 1,
            optgroup: [
                {
                    key: 1,
                    label: "Add All",
                    options: (addiv2._id === "1" || addiv2._id === "2") && addiv3._id === "2" ?
                        (
                            ""
                        ) : (
                            [{ key: 1, value: 1, text: `Add all ${country.adDivName3}` }]
                        ),
                },
                {
                    key: 2,
                    label: "Create New",
                    options: (addiv2._id === "1" || addiv2._id === "2") && addiv3._id === "1" ?
                        (
                            ""
                        ) : (
                            [{ key: 2, value: 2, text: "+ Create" }]
                        ),
                },
                {
                    key: 3,
                    label: "Created",
                },
                {
                    key: 4,
                    label: "Suggested",
                    options: addiv3s.length > 0 &&
                        addiv3s.map(
                            (addiv3) =>
                            (addiv3 = {
                                ...addiv3,
                                key: addiv3._id,
                                value: addiv3._id,
                                text: addiv3.name,
                            })
                        ),
                },
            ],
            show: country && country.adDivName3,
            edit,
        },
        {
            type: "text",
            name: "addiv3",
            onChange: (e) =>
                setValues({
                    ...values,
                    addiv3: { ...addiv3, name: e.target.value },
                })
            ,
            value: addiv3.name,
            disabled: loading === 1,
            placeholder: `Type a ${country.adDivName2} here`,
            show: addiv3 && addiv3._id === "2",
            edit,
        },
    ]
    return (
        <>
            <ShowingForms formProperty={formProperty} />
        </>
    );
}

export default LocationProperty;