import React from "react";
import { useSelector, useDispatch } from "react-redux";

import ShowingForms from '../../common/ShowingForms';

import {
    getCategorySubcats,
    getCategoryParents
} from "../../../functions/category";

const ParGroupSearch = ({ values, setValues }) => {
    let dispatch = useDispatch();

    const { categories } = useSelector((state) => ({
        ...state,
    }));

    const handleSortkeyChange = (value) => {
        setValues({
            ...values,
            sortkey: values.sortkeys.filter(sortkey => sortkey.id === value)[0].value,
            sort: values.sortkeys.filter(sortkey => sortkey.id === value)[0].sort
        });
    }

    const handleCategoryChange = (value) => {
        getCategorySubcats(value).then((res) => {
            dispatch({
                type: "SUBCAT_LIST_IV",
                payload: res.data,
            });
        });
        getCategoryParents(value).then((res) => {
            dispatch({
                type: "PARENT_LIST_XI",
                payload: res.data,
            });
            setValues({
                ...values,
                searchedCat: value,
                currentPage: 1,
                itemsCount: res.data.length
            });
        });
    };

    const formProperty = [
        {
            type: "ant select",
            name: "sortkey",
            style: {
                width: "180px",
                float: "left",
            },
            onChange: handleSortkeyChange,
            defaultValue: "- Sort By -",
            disabled: false,
            options: values.sortkeys.map(
                (sortkey) =>
                (sortkey = {
                    ...sortkey,
                    key: sortkey.id,
                    value: sortkey.id,
                    text: sortkey.label,
                })
            ),
            show: true,
        },
        {
            type: "ant select",
            name: "category",
            style: {
                width: "180px",
                float: "left",
            },
            onChange: handleCategoryChange,
            defaultValue: "Search by category",
            disabled: false,
            options: categories.map(
                (category) =>
                (category = {
                    ...category,
                    key: category._id,
                    value: category._id,
                    text: category.name,
                })
            ),
            show: true,
        },
    ]

    return (
        <>
            <ShowingForms formProperty={formProperty} />
            <div
                className="p-1"
                onClick={() => setValues({
                    ...values,
                    searchedCat: "",
                })}
                style={{ float: "left", cursor: "pointer" }}
            >
                Show All
            </div>
        </>
    );
}

export default ParGroupSearch;