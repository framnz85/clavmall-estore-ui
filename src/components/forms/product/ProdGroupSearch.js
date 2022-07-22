import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SearchOutlined } from "@ant-design/icons";

import ShowingForms from '../../common/ShowingForms';

import { getCategories, getCategorySubcats, getCategoryParents } from '../../../functions/category';

const ProdGroupSearch = ({ values, setValues, groupSearchSubmit }) => {
    const { sortkeys, category, subcat, } = values;
    let dispatch = useDispatch();

    const { categories, subcats, parents, user } = useSelector((state) => ({
        ...state,
    }));

    useEffect(() => {
        loadCategories();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const loadCategories = () => {
        getCategories(user.address ? user.address : {}).then((category) => {
            dispatch({
                type: "CATEGORY_LIST_V",
                payload: category.data.catComplete,
            });
            dispatch({
                type: "PRODUCT_LIST_IV",
                payload: category.data.products,
            });
        });
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

        const allSubcatExist = subcats.filter((subcat) => subcat._id === "all" && subcat.parent === value);
        if(allSubcatExist.length < 1)
            subcats.unshift({ _id: "all", name: "- All Sub-Category -", parent: value });
        
        const parentExist = parents.filter((parent) => parent.parent === value);
        if (parentExist.length < 1)
            getCategoryParents(value).then((res) => {
                dispatch({
                    type: "PARENT_LIST_IV",
                    payload: res.data,
                });
            });

        const allParentExist = parents.filter((parent) => parent._id === "all" && parent.parent === value);
        if(allParentExist.length < 1)
            parents.unshift({ _id: "all", name: "- All Parents -", parent: value });
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

    let forCatOption = [...categories]
    forCatOption.unshift({ _id: "all", name: "- All Category -" });

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
            options: forCatOption.map(
                (category) =>
                (category = {
                    ...category,
                    key: category._id,
                    value: category._id === "all" ? "" : category._id,
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
                    value: subcat._id === "all" ? "" : subcat._id,
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
            options: parents.filter(parent => parent.parent === category).map(
                (parent) =>
                (parent = {
                    ...parent,
                    key: parent._id,
                    value: parent._id === "all" ? "" : parent._id,
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