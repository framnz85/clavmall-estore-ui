import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    ExclamationCircleOutlined,
    LoadingOutlined,
} from "@ant-design/icons";
import { Modal, Pagination } from "antd";
import { toast } from "react-toastify";

import InputSearch from '../../common/form/InputSearch';
import CustomTable1 from "../../common/table/CustomTable1";
import ParGroupSearch from "./ParGroupSearch";

import { getCategories } from '../../../functions/category';
import { getParents, removeParent } from '../../../functions/parent';
import { updateChanges } from "../../../functions/estore";

const { confirm } = Modal;

const ParCustomTable = ({ values, setValues, loading, setLoading }) => {
    let dispatch = useDispatch();
    const { currentPage, pageSize, itemsCount } = values

    const [keyword, setKeyword] = useState("");

    const { estore, user, categories, parents } = useSelector((state) => ({
        ...state,
    }));

    useEffect(() => {
        loadCategories();
        loadParents();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const loadCategories = () => {
        getCategories(user.address ? user.address : {}).then((category) => {
            dispatch({
                type: "CATEGORY_LIST_VII",
                payload: category.data.catComplete,
            });
            dispatch({
                type: "PRODUCT_LIST_VI",
                payload: category.data.products,
            });
        });
    };

    const loadParents = () => {
        if (typeof window !== undefined) {
            if (!localStorage.getItem("parents")) {
                setLoading(true);
                getParents().then((parent) => {
                    setValues({
                        ...values,
                        itemsCount: parent.data.length
                    });
                    dispatch({
                        type: "PARENT_LIST_III",
                        payload: parent.data,
                    });
                    setLoading(false);
                });
            } else {
                setValues({
                    ...values,
                    itemsCount: parents.length
                });
            }
        }
    };

    const handleRemove = async (parent, slug, name) => {
        confirm({
            title: "Are you sure you want to delete " + name + "?",
            icon: <ExclamationCircleOutlined />,
            content:
                "Make sure you have deleted all the products under this parent product first.",
            okText: "Yes",
            okType: "danger",
            cancelText: "No",
            onOk() {
                setLoading(true);
                removeParent(parent, slug, user.token)
                    .then((res) => {
                        setLoading(false);
                        toast.error(`"${res.data.name}" deleted.`);
                        const result = parents.filter((parent) => parent.slug !== slug);
                        dispatch({
                            type: "PARENT_REMOVE",
                            payload: result,
                        });
                        updateChanges(
                            estore._id,
                            "parentChange",
                            user.token
                        ).then((res) => {
                            dispatch({
                                type: "ESTORE_INFO_VIII",
                                payload: res.data,
                            });
                        });
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

    const searched = (keyword) => (parent) =>
        parent.name.toLowerCase().includes(keyword);

    return (
        <>
            <InputSearch
                keyword={keyword}
                setKeyword={setKeyword}
                placeholder="Search parent"
                data={values}
                setData={setValues}
            />
            
            <ParGroupSearch values={values} setValues={setValues} /><br /><br /><br />

            {loading && (
                <h4 style={{ margin: "20px 0" }}>
                    <LoadingOutlined />
                </h4>
            )}

            {parents &&
                parents
                    .filter(searched(keyword))
                    .filter((parent) => values.searchedCat ? parent.parent === values.searchedCat : parent.parent !== values.searchedCat)
                    .sort((a, b) =>
                        a[values.sortkey] > b[values.sortkey]
                            ? values.sort
                            : b[values.sortkey] > a[values.sortkey]
                                ? -values.sort
                                : 0
                    )
                    .slice(currentPage * pageSize - pageSize, currentPage * pageSize)
                    .map((parent) => {
                        const category = categories.length && categories.filter((c) => c._id === parent.parent);
                        return <CustomTable1
                            key={parent._id}
                            data={parent}
                            subname={category[0] && category[0].name}
                            bgColor={estore.carouselColor}
                            handleRemove={handleRemove}
                            linkTo={`/admin/parent/${category[0] && category[0].slug}/${parent.slug}`}
                        />
                    })}

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

export default ParCustomTable;