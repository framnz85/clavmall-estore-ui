import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Modal, Pagination } from "antd";
import { toast } from "react-toastify";
import { ExclamationCircleOutlined, LoadingOutlined } from "@ant-design/icons";

import AdminProdCard from "../../cards/AdminProdCard";

import { removeProduct } from "../../../functions/product";
import { updateChanges } from "../../../functions/estore";
import { removeFileImage } from '../../../functions/admin';

const { confirm } = Modal;

const ProdShowCards = ({ values, setValues, loading }) => {
    let dispatch = useDispatch();
    const { products, itemsCount, pageSize, currentPage } = values;

    const { user, admin, estore } = useSelector((state) => ({ ...state }));

    const handleRemove = (slug, title, images) => {
        confirm({
            title: "Are you sure you want to delete " + title + "?",
            icon: <ExclamationCircleOutlined />,
            content: "Deleting this product will also delete all its images.",
            okText: "Yes",
            okType: "danger",
            cancelText: "No",
            onOk() {
                removeProduct(slug, user.token)
                    .then(async (res) => {
                        for (let i = 0; i < images.length; i++) {
                            await removeFileImage(images[i].public_id, estore, user.token);
                        }

                        toast.error(`${res.data.title} is deleted`);

                        const newAdminProducts = admin.products.values.filter(
                            (product) => product.slug !== slug
                        );

                        const newProdCount = parseInt(admin.products.itemsCount) - 1;

                        setValues({
                            ...values,
                            products: newAdminProducts,
                            itemsCount: newProdCount
                        });

                        dispatch({
                            type: "ADMIN_OBJECT_IX",
                            payload: {
                                products: {
                                    ...admin.products,
                                    values: newAdminProducts,
                                    itemsCount: newProdCount
                                }
                            },
                        });

                        updateChanges(
                            process.env.REACT_APP_ESTORE_ID,
                            "productChange",
                            user.token
                        ).then((res) => {
                            dispatch({
                                type: "ESTORE_INFO_IX",
                                payload: res.data,
                            });
                        });
                    })
                    .catch((error) => {
                        if (error.response.status === 400 || 404)
                            toast.error(error.response.data);
                        else toast.error(error.message);
                    });
            },
            onCancel() { },
        });
    };

    return (
        <div>
            {products
                .filter(product => product.page === currentPage)
                .map((product) => (
                    <div
                        key={product._id}
                    >
                        <AdminProdCard
                            product={product}
                            handleRemove={handleRemove}
                            canEdit={true}
                        />
                    </div>
                ))}
            {loading && <div align="center"><LoadingOutlined /><br /></div>}
            <Pagination
                className="text-center pt-3"
                onChange={(value) => setValues({ ...values, currentPage: value })}
                current={currentPage}
                pageSize={pageSize}
                total={itemsCount}
            />
            <br />
        </div>
    );
}

export default ProdShowCards;