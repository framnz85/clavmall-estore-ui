import React, { useEffect } from "react";
import LocationProperty from "./LocationProperty";
import { getAllCountry, getAllAddiv1, getAllAddiv2, getAllAddiv3 } from "../../../functions/address";

const LocationInputs = ({
    initialState,
    values,
    setValues,
    loading,
    setLoading,
    edit,
}) => {
    const {
        countries,
        addiv1s,
        addiv2s,
        addiv3s
    } = values;

    useEffect(() => {
        loadAllCountry();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const loadAllCountry = () => {
        setLoading(2);
        getAllCountry().then((res) => {
            setValues({
                ...initialState,
                countries: res.data,
            });
            setLoading(0);
        });
    };

    const handleCountryChange = (e) => {
        const country = countries.filter(
            (country) => country._id === e.target.value
        );
        setLoading(2);
        getAllAddiv1(country[0]._id, country[0].countryCode).then((res) => {
            setValues({
                ...values,
                country: country[0],
                addiv1: { _id: "", name: "" },
                addiv1s: res.data,
                addiv2: { _id: "", name: "" },
                addiv2s: [],
                addiv3: { _id: "", name: "" },
                addiv3s: [],
            });
            setLoading(0);
        });
    };

    const handleAddiv1Change = (e) => {
        if (e.target.value === "1") {
            setValues({
                ...values,
                addiv1: { _id: "1", name: "all" },
                addiv2: { _id: "1", name: "all" },
                addiv2s: [],
                addiv3: { _id: "1", name: "all" },
                addiv3s: [],
            });
        } else if (e.target.value === "2") {
            setValues({
                ...values,
                addiv1: { _id: "2", name: "" },
                addiv2: { _id: "2", name: "" },
                addiv2s: [],
                addiv3: { _id: "2", name: "" },
                addiv3s: [],
            });
        } else {
            const addiv1 = addiv1s.filter((addiv1) => addiv1._id === e.target.value);
            const country = countries.filter(
                (country) => country._id === addiv1[0].couid
            );
            setLoading(2);
            getAllAddiv2(country[0]._id, addiv1[0]._id, country[0].countryCode).then(
                (res) => {
                    setValues({
                        ...values,
                        addiv1: addiv1[0],
                        addiv2: { _id: "", name: "" },
                        addiv2s: res.data,
                        addiv3: { _id: "", name: "" },
                        addiv3s: [],
                    });
                    setLoading(0);
                }
            );
        }
    };

    const handleAddiv2Change = (e) => {
        if (e.target.value === "1") {
            setValues({
                ...values,
                addiv2: { _id: "1", name: "all" },
                addiv3: { _id: "1", name: "all" },
                addiv3s: [],
            });
        } else if (e.target.value === "2") {
            setValues({
                ...values,
                addiv2: { _id: "2", name: "" },
                addiv3: { _id: "2", name: "" },
                addiv3s: [],
            });
        } else {
            const addiv2 = addiv2s.filter((addiv2) => addiv2._id === e.target.value);
            const addiv1 = addiv1s.filter(
                (addiv1) => addiv1._id === addiv2[0].adDivId1
            );
            const country = countries.filter(
                (country) => country._id === addiv1[0].couid
            );
            setLoading(2);
            getAllAddiv3(
                country[0]._id,
                addiv1[0]._id,
                addiv2[0]._id,
                country[0].countryCode
            ).then((res) => {
                setValues({
                    ...values,
                    addiv2: addiv2[0],
                    addiv3: { _id: "", name: "" },
                    addiv3s: res.data,
                });
                setLoading(0);
            });
        }
    };

    const handleAddiv3Change = (e) => {
        if (e.target.value === "1") {
            setValues({
                ...values,
                addiv3: { _id: "1", name: "all" },
            });
        } else if (e.target.value === "2") {
            setValues({
                ...values,
                addiv3: { _id: "2", name: "" },
            });
        } else {
            const addiv3 = addiv3s.filter((addiv3) => addiv3._id === e.target.value);
            setValues({
                ...values,
                addiv3: addiv3[0],
            });
        }
    };

    return (
        <>
            <LocationProperty
                values={values}
                setValues={setValues}
                loading={loading}
                setLoading={setLoading}
                edit={edit}
                handleCountryChange={handleCountryChange}
                handleAddiv1Change={handleAddiv1Change}
                handleAddiv2Change={handleAddiv2Change}
                handleAddiv3Change={handleAddiv3Change}
            />
        </>);
}

export default LocationInputs;