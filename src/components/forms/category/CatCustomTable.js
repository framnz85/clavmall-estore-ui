import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ExclamationCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { Modal, Pagination } from "antd";
import { toast } from "react-toastify";

import InputSearch from '../../common/form/InputSearch';
import CustomTable1 from "../../common/table/CustomTable1";

import { getCategories, removeCategory } from '../../../functions/category';
import { updateChanges } from "../../../functions/estore";

const { confirm } = Modal;

const CatCustomTable = ({ values, setValues, loading, setLoading }) => {
    let dispatch = useDispatch();
    const { currentPage, pageSize, itemsCount } = values

    const [keyword, setKeyword] = useState("");

    const { estore, user, categories } = useSelector((state) => ({
        ...state,
    }));

    useEffect(() => {
        loadCategories();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const loadCategories = () => {
        if (typeof window !== undefined) {
            if (!localStorage.getItem("categories")) {
                setLoading(true);
                getCategories({}).then((category) => {
                    setValues({
                        ...values,
                        itemsCount: category.data.categories.length
                    });
                    dispatch({
                        type: "CATEGORY_LIST_IV",
                        payload: category.data.categories,
                    });
                    dispatch({
                        type: "PRODUCT_LIST_III",
                        payload: category.data.products,
                    });
                    setLoading(false);
                });
            } else {
                setValues({
                    ...values,
                    itemsCount: categories.length
                });
            }
        }
    };

    const handleRemove = async (slug, name) => {
        confirm({
            title: "Are you sure you want to delete " + name + "?",
            icon: <ExclamationCircleOutlined />,
            content:
                "Make sure you have deleted all the products under this category first.",
            okText: "Yes",
            okType: "danger",
            cancelText: "No",
            onOk() {
                setLoading(true);
                removeCategory(slug, user.token)
                    .then((res) => {
                        setLoading(false);
                        toast.error(`"${res.data.name}" deleted.`);
                        const result = categories.filter(
                            (category) => category.slug !== slug
                        );
                        dispatch({
                            type: "CATEGORY_LIST_IV",
                            payload: result,
                        });
                        updateChanges(
                            process.env.REACT_APP_ESTORE_ID,
                            "categoryChange",
                            user.token
                        ).then((res) => {
                            dispatch({
                                type: "ESTORE_INFO_V",
                                payload: res.data,
                            });
                        });
                    })
                    .catch((error) => {
                        if (error.response.status === 400) toast.error(error.response.data);
                        else toast.error(error.message);
                        setLoading(false);
                    });
            },
            onCancel() { },
        });
    };

    const handlePageChange = async (page) => {
        setValues({
            ...values,
            currentPage: page,
        });
    };

    const searched = (keyword) => (category) =>
        category.name.toLowerCase().includes(keyword);

    return (
        <>
            <InputSearch
                keyword={keyword}
                setKeyword={setKeyword}
                placeholder="Search category"
                data={values}
                setData={setValues}
            />

            {loading && (
                <h4 style={{ margin: "20px 0" }}>
                    <LoadingOutlined />
                </h4>
            )}

            {categories &&
                categories
                    .filter(searched(keyword))
                    .slice(currentPage * pageSize - pageSize, currentPage * pageSize)
                    .map((category) => (
                        <CustomTable1
                            key={category._id}
                            data={category}
                            bgColor={estore.carouselColor}
                            handleRemove={handleRemove}
                            linkTo={`/admin/category/${category.slug}`}
                        />
                    ))}

            <Pagination
                className="text-center pt-3"
                onChange={handlePageChange}
                current={currentPage}
                pageSize={pageSize}
                total={itemsCount}
            />

            <br />
        </>
    );
}

export default CatCustomTable;