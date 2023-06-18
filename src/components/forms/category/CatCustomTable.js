import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ExclamationCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { Modal, Pagination } from "antd";
import { toast } from "react-toastify";

import InputSearch from '../../common/form/InputSearch';
import CustomTable2 from "../../common/table/CustomTable2";

import { getCategories, removeCategory } from '../../../functions/category';
import { removeFileImage } from "../../../functions/admin";
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
        getCategories(user.address ? user.address : {}).then((category) => {
            setValues({
                ...values,
                itemsCount: category.data.catComplete.length
            });
            dispatch({
                type: "CATEGORY_LIST_IV",
                payload: category.data.catComplete,
            });
            dispatch({
                type: "PRODUCT_LIST_III",
                payload: category.data.products,
            });
        });
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
                        const toDelete = categories.filter(
                            (category) => category.slug === slug
                        );
                        if (toDelete[0]) {
                            for (let i = 0; i < toDelete[0].images.length; i++) {
                                removeFileImage(toDelete[0].images[i].public_id, estore, user.token);
                            }
                        }
                        const result = categories.filter(
                            (category) => category.slug !== slug
                        );
                        dispatch({
                            type: "CATEGORY_REMOVE",
                            payload: result,
                        });
                        updateChanges(
                            estore._id,
                            "categoryChange",
                            user.token
                        ).then((res) => {
                            dispatch({
                                type: "ESTORE_INFO_V",
                                payload: res.data,
                            });
                        });
                        setLoading(false);
                        toast.error(`"${res.data.name}" deleted.`);
                    })
                    .catch((error) => {
                        if ([400, 401, 404].includes(error.response.status))
                            toast.error(error.response.data);
                        else
                            toast.error(error.message);
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
                        <CustomTable2
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