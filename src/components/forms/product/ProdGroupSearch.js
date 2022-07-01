import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SearchOutlined } from "@ant-design/icons";

import ShowingForms from '../../common/ShowingForms';

import { getCategories, getCategorySubcats } from '../../../functions/category';
import { getParents } from "../../../functions/parent";

const ProdGroupSearch = ({ values, setValues, groupSearchSubmit }) => {
    const { sortkeys, category, subcat, } = values;
    let dispatch = useDispatch();

    const { categories, subcats, parents } = useSelector((state) => ({
        ...state,
    }));

    useEffect(() => {
        loadCategories();
        loadParents();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const loadCategories = () => {
        if (typeof window !== undefined) {
            if (!localStorage.getItem("categories")) {
                getCategories().then((category) => {
                    dispatch({
                        type: "CATEGORY_LIST_V",
                        payload: category.data.categories,
                    });
                    dispatch({
                        type: "PRODUCT_LIST_IV",
                        payload: category.data.products,
                    });
                });
            }
        }
    };

    const loadParents = () => {
        if (typeof window !== undefined) {
            if (!localStorage.getItem("parents")) {
                getParents().then((parent) => {
                    dispatch({
                        type: "PARENT_LIST_IV",
                        payload: parent.data,
                    });
                });
            }
        }
    };

    const handleSortkeyChange = (value) => {
        setValues({
            ...values,
            sortkey: sortkeys.filter(sortkey => sortkey.id === value)[0].value,
            sort: sortkeys.filter(sortkey => sortkey.id === value)[0].sort
        });
        dispatch({
            type: "ADMIN_OBJECT_VIII",
            payload: {
                products: { values: [], pages: [], itemsCount: 0 }
            },
        });
    }

    const handleCategoryChange = (value) => {
        setValues({
            ...values,
            category: value,
            subcat: "",
        });
        dispatch({
            type: "ADMIN_OBJECT_VIII",
            payload: {
                products: { values: [], pages: [], itemsCount: 0 }
            },
        });

        const subcatExist = subcats.filter((subcat) => subcat.parent === value);
        if (subcatExist.length < 1)
            getCategorySubcats(value).then((res) => {
                dispatch({
                    type: "SUBCAT_LIST_III",
                    payload: res.data,
                });
            });
    }

    const handleSubcatChange = (value) => {
        setValues({
            ...values,
            subcat: value,
        });
        dispatch({
            type: "ADMIN_OBJECT_VIII",
            payload: {
                products: { values: [], pages: [], itemsCount: 0 }
            },
        });
    }

    const handleParentChange = (value) => {
        setValues({
            ...values,
            parent: value,
        });
        dispatch({
            type: "ADMIN_OBJECT_VIII",
            payload: {
                products: { values: [], pages: [], itemsCount: 0 }
            },
        });
    }

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
            options: sortkeys.map(
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
            defaultValue: "- All Category -",
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
        {
            type: "ant select",
            name: "subcat",
            style: {
                width: "180px",
                float: "left",
            },
            onChange: handleSubcatChange,
            defaultValue: subcat ? subcat : "- All Sub-Category -",
            disabled: false,
            options: subcats.filter(subcat => subcat.parent === category).map(
                (subcat) =>
                (subcat = {
                    ...subcat,
                    key: subcat._id,
                    value: subcat._id,
                    text: subcat.name,
                })
            ),
            show: true,
        },
        {
            type: "ant select",
            name: "parent",
            style: {
                width: "180px",
                float: "left",
            },
            onChange: handleParentChange,
            defaultValue: "- All Parent -",
            disabled: false,
            options: parents.map(
                (parent) =>
                (parent = {
                    ...parent,
                    key: parent._id,
                    value: parent._id,
                    text: parent.name,
                })
            ),
            show: true,
        },
    ]

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

export default ProdGroupSearch;