import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Modal, Pagination } from "antd";
import { toast } from "react-toastify";
import Joi from "joi-browser";
import { ExclamationCircleOutlined, LoadingOutlined } from "@ant-design/icons";

import AdminProdCard from "../../cards/AdminProdCard";

import { createProduct, removeProduct } from "../../../functions/product";
import { updateChanges } from "../../../functions/estore";
import { removeFileImage, checkImageUser } from '../../../functions/admin';

const { confirm } = Modal;

const ProdShowCards = ({ values, setValues, loading, setLoading }) => {
    let dispatch = useDispatch();
    const { products, itemsCount, pageSize, currentPage } = values;

    const { user, admin, estore } = useSelector((state) => ({ ...state }));

    const schema = {
        title: Joi.string().max(128).required(),
        description: Joi.string().max(2000),
        supplierPrice: Joi.number(),
        markup: Joi.number(),
        markuptype: Joi.string(),
        price: Joi.number().required(),
        category: Joi.string().required(),
        subcats: Joi.array(),
        parent: Joi.string().required(),
        quantity: Joi.number(),
        variants: Joi.array(),
        images: Joi.array(),
    };

    const handleDuplicate = (product) => {
        if (product) {
            const copyProduct = {
                ...product,
                title: product.title + " - copy",
                category: product.category._id ? product.category._id : product.category,
                subcats: product.subcats && product.subcats.map(subcat => subcat._id ? subcat._id : subcat),
                parent: product.parent._id ? product.parent._id : product.parent,
                variants: product.variants && product.variants.map(variant => { return { name: variant.name, quantity: variant.quantity } })
            };
            handleCopying(copyProduct);
        } else {
            toast.error("Product cannot be copied");
        }
    }

    const handleCopying = async (product) => {
        delete product._id;
        delete product.__v;
        delete product.createdAt;
        delete product.updatedAt;
        delete product.page;
        delete product.noAvail;
        delete product.ratings;
        delete product.sold;
        delete product.activate;
        delete product.slug;

        const validate = Joi.validate(product,
            schema,
            {
                abortEarly: false,
            }
        );

        if (validate.error) {
            for (let item of validate.error.details) toast.error(item.message);
            return;
        }

        setLoading(true);

        createProduct( product, user.token ).then((res) => {
            toast.success(`${res.data.ops[0].title} is copied`);
            setLoading(false);

            if (admin.products.values.length > 0) {
                admin.products.values.unshift({ ...res.data.ops[0], page: 1 });

                const newProdCount = parseInt(admin.products.itemsCount) + 1;
                
                setValues({
                    ...values,
                    products: admin.products.values,
                    itemsCount: newProdCount
                });

                dispatch({
                    type: "ADMIN_OBJECT_XVIII",
                    payload: {
                        products: {
                            ...admin.products,
                            itemsCount: newProdCount
                        }
                    },
                });

                updateChanges( estore._id, "productChange", user.token ).then((res) => {
                    dispatch({
                        type: "ESTORE_INFO_XIX",
                        payload: res.data,
                    });
                });
            }
        })
        .catch((error) => {
            if (error.response.status === 400 || 404)
                toast.error(error.response.data);
            else
                toast.error(error.message);
            setLoading(false);
        });
    };
    
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
                            await checkImageUser(images[i].public_id, user.token).then(async (res) => {
                                if (!res.data)
                                    await removeFileImage(images[i].public_id, estore, user.token);
                            })
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
                            estore._id,
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
                            handleDuplicate={handleDuplicate}
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