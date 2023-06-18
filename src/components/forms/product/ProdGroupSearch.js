import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SearchOutlined } from "@ant-design/icons";

import ShowingForms from '../../common/ShowingForms';
import PriceModal from "../../modal/PriceModal";
import MarkupModal from "../../modal/MarkupModal";
import DeleteModal from "../../modal/DeleteModal";
import StatusModal from "../../modal/StatusModal";
import ReferralModal from "../../modal/ReferralModal";

import { getCategories, getCategorySubcats, getCategoryParents } from '../../../functions/category';

const ProdGroupSearch = ({ values, setValues, groupSearchSubmit }) => {
    const { sortkeys, category, subcat, bulkAction } = values;
    let dispatch = useDispatch();
    
    const [changePriceModal, setChangePriceModal] = useState(false);
    const [changeMarkupModal, setChangeMarkupModal] = useState(false);
    const [multiDeleteModal, setMultiDeleteModal] = useState(false);
    const [changeStatusModal, setChangeStatusModal] = useState(false);
    const [changeReferralModal, setChangeReferralModal] = useState(false);
    const [bulkActionValue, setBulkActionValue] = useState(false);

    const { categories, subcats, parents, user } = useSelector((state) => ({
        ...state,
    }));

    useEffect(() => {
        loadCategories();
        if (changePriceModal === false) setBulkActionValue("- Bulk Change -");
    }, [changePriceModal]); // eslint-disable-line react-hooks/exhaustive-deps

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

        getCategorySubcats(value).then((res) => {
            dispatch({
                type: "SUBCAT_LIST_III",
                payload: res.data,
            });
        });

        const allSubcatExist = subcats.filter((subcat) => subcat._id === "all" && subcat.parent === value);
        if(allSubcatExist.length < 1)
            subcats.unshift({ _id: "all", name: "- All Sub-Category -", parent: value });
        
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

    const handleBulkAction = (value) => {
        if (value === "1") {
            setChangePriceModal(true);
        } else if (value === "2") {
            setMultiDeleteModal(true);
        } else if (value === "3") {
            setChangeStatusModal(true);
        } else if (value === "4") {
            setChangeReferralModal(true);
        } else if (value === "5") {
            setChangeMarkupModal(true);
        }
    }

    const formProperty = [
        {
            type: "ant select",
            name: "sortkey",
            style: {
                width: "158px",
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
                width: "158px",
                float: "left",
            },
            onChange: handleCategoryChange,
            defaultValue: "- All Category -",
            disabled: false,
            options: forCatOption
                .sort((a, b) => a.name > b.name ? 1 : b.name > a.name ? -1 : 0)
                .map(
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
                width: "158px",
                float: "left",
            },
            onChange: handleSubcatChange,
            defaultValue: subcat ? subcat : "- All Sub-Category -",
            disabled: false,
            options: subcats.filter(subcat => subcat.parent === category)
                .sort((a, b) => a.name > b.name ? 1 : b.name > a.name ? -1 : 0)
                .map(
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
                width: "158px",
                float: "left",
            },
            onChange: handleParentChange,
            defaultValue: "- All Parent -",
            disabled: false,
            options: parents.filter(parent => parent.parent === category)
                .sort((a, b) => a.name > b.name ? 1 : b.name > a.name ? -1 : 0)
                .map(
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
        {
            type: "ant select",
            name: "bulkAction",
            style: {
                width: "158px",
                float: "left",
            },
            onChange: handleBulkAction,
            value: bulkActionValue,
            disabled: false,
            options: bulkAction.map(
                (bulk) =>
                (bulk = {
                    ...bulk,
                    key: bulk.id,
                    value: bulk.value,
                    text: bulk.label,
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
            <PriceModal
                values={values}
                changePriceModal={changePriceModal}
                setChangePriceModal={setChangePriceModal}
                handleCategoryChange={handleCategoryChange}
                handleSubcatChange={handleSubcatChange}
                handleParentChange={handleParentChange}
            />
            <MarkupModal
                values={values}
                changeMarkupModal={changeMarkupModal}
                setChangeMarkupModal={setChangeMarkupModal}
                handleCategoryChange={handleCategoryChange}
                handleSubcatChange={handleSubcatChange}
                handleParentChange={handleParentChange}
            />
            <DeleteModal
                values={values}
                multiDeleteModal={multiDeleteModal}
                setMultiDeleteModal={setMultiDeleteModal}
                handleCategoryChange={handleCategoryChange}
                handleSubcatChange={handleSubcatChange}
                handleParentChange={handleParentChange}
            />
            <StatusModal
                values={values}
                changeStatusModal={changeStatusModal}
                setChangeStatusModal={setChangeStatusModal}
                handleCategoryChange={handleCategoryChange}
                handleSubcatChange={handleSubcatChange}
                handleParentChange={handleParentChange}
            />
            <ReferralModal
                values={values}
                changeReferralModal={changeReferralModal}
                setChangeReferralModal={setChangeReferralModal}
                handleCategoryChange={handleCategoryChange}
                handleSubcatChange={handleSubcatChange}
                handleParentChange={handleParentChange}
            />
        </>
    );
}

export default ProdGroupSearch;