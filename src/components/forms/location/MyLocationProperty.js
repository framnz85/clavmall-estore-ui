import React from "react";
import { useDispatch, useSelector } from "react-redux";
import ShowingForms from '../../common/ShowingForms';
import { getAllMyAddiv1, getAllMyAddiv2, getAllMyAddiv3 } from "../../../functions/address";

const MyLocationProperty = ({ myValues, setMyValues, setLoading }) => {
    let dispatch = useDispatch();
    const { country, countries, addiv1s, addiv2s } = myValues;

    const { admin } = useSelector((state) => ({ ...state }));

    const handleMyCountryChange = (value) => {
        const country = countries.filter((country) => country._id === value);
        const addiv1s = admin.location && admin.location.addiv1s ? admin.location.addiv1s.filter(
            (addiv1) => addiv1.couid === country[0]._id
        ) : [];

        if (addiv1s.length) {
            setMyValues({
                ...myValues,
                country: country[0],
                addiv1: {},
                addiv1s: addiv1s,
                addiv2: {},
                addiv2s: [],
                addiv3: {},
            });
        } else {
            setLoading(3);
            getAllMyAddiv1(country[0]._id, country[0].countryCode).then((res) => {
                setMyValues({
                    ...myValues,
                    country: country[0],
                    addiv1: {},
                    addiv1s: res.data,
                    addiv2: {},
                    addiv2s: [],
                    addiv3: {},
                });
                dispatch({
                    type: "ADMIN_OBJECT_V",
                    payload: {
                        location: {
                            ...admin.location,
                            addiv1s: res.data,
                        }
                    },
                });
                setLoading(0);
            });
        }
    };

    const handleMyAddiv1Change = (value) => {
        const addiv1 = addiv1s.filter((addiv1) => addiv1._id === value);
        const addiv2s = admin.location && admin.location.addiv2s ? admin.location.addiv2s.filter(
            (addiv2) => addiv2.adDivId1 === addiv1[0]._id
        ) : [];
        const country = countries.filter(
            (country) => country._id === addiv1[0].couid
        );

        if (addiv2s.length) {
            setMyValues({
                ...myValues,
                addiv1: addiv1[0],
                addiv2: {},
                addiv2s: addiv2s,
                addiv3: {},
            });
        } else {
            setLoading(3);
            getAllMyAddiv2(country[0]._id, addiv1[0]._id, country[0].countryCode).then(
                (res) => {
                    setMyValues({
                        ...myValues,
                        addiv1: addiv1[0],
                        addiv2: {},
                        addiv2s: res.data,
                        addiv3: {},
                    });
                    dispatch({
                        type: "ADMIN_OBJECT_V",
                        payload: {
                            location: {
                                ...admin.location,
                                addiv2s: res.data,
                            }
                        },
                    });
                    setLoading(0);
                }
            );
        }
    };

    const handleMyAddiv2Change = (value) => {
        const addiv2 = addiv2s.filter((addiv2) => addiv2._id === value);
        const addiv3s = admin.location && admin.location.addiv3s ? admin.location.addiv3s.filter(
            (addiv3) => addiv3.adDivId2 === addiv2[0]._id
        ) : [];
        const addiv1 = addiv1s.filter(
            (addiv1) => addiv1._id === addiv2[0].adDivId1
        );
        const country = countries.filter(
            (country) => country._id === addiv1[0].couid
        );

        if (addiv3s.length) {
            setMyValues({
                ...myValues,
                addiv2: addiv2[0],
                addiv3: {},
                addiv3s: addiv3s,
                itemsCount: addiv3s.length,
                currentPage: 1,
            });
        } else {
            setLoading(3);
            getAllMyAddiv3(
                country[0]._id,
                addiv1[0]._id,
                addiv2[0]._id,
                country[0].countryCode
            ).then((res) => {
                setMyValues({
                    ...myValues,
                    addiv2: addiv2[0],
                    addiv3: {},
                    addiv3s: res.data,
                    itemsCount: res.data.length,
                    currentPage: 1,
                });
                dispatch({
                    type: "ADMIN_OBJECT_V",
                    payload: {
                        location: {
                            ...admin.location,
                            addiv3s: res.data,
                        }
                    },
                });
                setLoading(0);
            });
        }
    };

    const formProperty = [
        {
            type: "ant select",
            name: "country",
            style: {
                width: "200px",
                float: "left",
            },
            onChange: handleMyCountryChange,
            defaultValue: "Select Country",
            options: countries.map(
                (country) =>
                (country = {
                    ...country,
                    key: country._id,
                    value: country._id,
                    text: country.name,
                })
            ),
            show: true,
        },
        {
            type: "ant select",
            name: "addiv1",
            style: {
                width: "200px",
                float: "left",
            },
            onChange: handleMyAddiv1Change,
            defaultValue: `Select ${country.adDivName1}`,
            options: addiv1s.map(
                (addiv1) =>
                (addiv1 = {
                    ...addiv1,
                    key: addiv1._id,
                    value: addiv1._id,
                    text: addiv1.name,
                })
            ),
            show: country && country.adDivName1,
        },
        {
            type: "ant select",
            name: "addiv2",
            style: {
                width: "200px",
                float: "left",
            },
            onChange: handleMyAddiv2Change,
            defaultValue: `Select ${country.adDivName2}`,
            options: addiv2s.map(
                (addiv2) =>
                (addiv2 = {
                    ...addiv2,
                    key: addiv2._id,
                    value: addiv2._id,
                    text: addiv2.name,
                })
            ),
            show: country && country.adDivName2,
        },
    ];

    return (<>
        <ShowingForms formProperty={formProperty} />
    </>);
}

export default MyLocationProperty;