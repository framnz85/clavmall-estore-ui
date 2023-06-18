import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ExclamationCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { Modal, Pagination } from "antd";
import { toast } from "react-toastify";

import InputSearch from '../../common/form/InputSearch';
import CustomTable1 from "../../common/table/CustomTable1";
import SubGroupSearch from "./SubGroupSearch";

import { getCategories } from '../../../functions/category';
import { getSubcats, removeSubcat } from "../../../functions/subcat";
import { updateChanges } from "../../../functions/estore";

const { confirm } = Modal;

const SubCustomTable = ({ values, setValues, loading, setLoading }) => {
    let dispatch = useDispatch();
    const { currentPage, pageSize, itemsCount } = values

    const [keyword, setKeyword] = useState("");

    const { estore, user, categories, subcats } = useSelector((state) => ({
        ...state,
    }));

    useEffect(() => {
        loadCategories();
        loadSubcats();
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

    const loadSubcats = () => {
        if (typeof window !== undefined) {
            if (!localStorage.getItem("subcats")) {
                getSubcats().then((subcat) => {
                    setValues({
                        ...values,
                        itemsCount: subcat.data.length
                    });
                    dispatch({
                        type: "SUBCAT_LIST_V",
                        payload: subcat.data,
                    });
                    setLoading(false);
                });
            } else {
                setValues({
                    ...values,
                    itemsCount: subcats.length
                });
            }
        }
    };

    const handleRemove = async (parent, slug, name) => {
        confirm({
            title: "Are you sure you want to delete " + name + "?",
            icon: <ExclamationCircleOutlined />,
            content:
                "Make sure you have deleted all the products under this sub-category first.",
            okText: "Yes",
            okType: "danger",
            cancelText: "No",
            onOk() {
                setLoading(true);
                removeSubcat(parent, slug, user.token)
                    .then((res) => {
                        setLoading(false);
                        toast.error(`"${res.data.name}" deleted.`);
                        const result = subcats.filter((subcat) => subcat.slug !== slug);
                        dispatch({
                            type: "SUBCAT_REMOVE",
                            payload: result,
                        });
                        updateChanges(
                            estore._id,
                            "subcatChange",
                            user.token
                        ).then((res) => {
                            dispatch({
                                type: "ESTORE_INFO_XI",
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

    const searched = (keyword) => (subcat) =>
        subcat.name.toLowerCase().includes(keyword);

    return (
        <>
            <InputSearch
                keyword={keyword}
                setKeyword={setKeyword}
                placeholder="Search sub-category"
                data={values}
                setData={setValues}
            />

            <SubGroupSearch values={values} setValues={setValues} /><br /><br /><br />

            {loading && (
                <h4 style={{ margin: "20px 0" }}>
                    <LoadingOutlined />
                </h4>
            )}

            {subcats &&
                subcats
                    .filter(searched(keyword))
                    .filter((subcat) => values.searchedCat ? subcat.parent === values.searchedCat : subcat.parent !== values.searchedCat)
                    .sort((a, b) =>
                        a[values.sortkey] > b[values.sortkey]
                            ? values.sort
                            : b[values.sortkey] > a[values.sortkey]
                                ? -values.sort
                                : 0
                    )
                    .slice(currentPage * pageSize - pageSize, currentPage * pageSize)
                    .map((subcat) => 
                    {
                        const category = categories.length && categories.filter((c) => c._id === subcat.parent);
                        return <CustomTable1
                            key={subcat._id}
                            data={subcat}
                            subname={category[0] && category[0].name}
                            bgColor={estore.carouselColor}
                            handleRemove={handleRemove}
                            linkTo={`/admin/subcat/${category[0] && category[0].slug}/${subcat.slug}`}
                        />
                        }
                    )}

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

export default SubCustomTable;