import React from "react";
import { useDispatch, useSelector } from "react-redux";
import ModalImage from "react-modal-image";
import { CloseOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import NumberFormat from "react-number-format";

import noImage from "../../images/noimage.jpg";
import TableHeader from "../common/table/TableHeader";
import TableBody from "../common/table/TableBody";

const CartProductTable = ({cart}) => {
    let dispatch = useDispatch();
    
    const { estore } = useSelector((state) => ({
        ...state,
    }));

    const handleQuantityChange = (value, product) => {
        let cart = [];
        if (typeof window !== undefined) {
            if (localStorage.getItem("cart")) {
                cart = JSON.parse(localStorage.getItem("cart"));
            }
            cart.map((prod, i) => {
                if (prod._id === product._id && prod.variant === product.variant) {
                    cart[i].count = value;
                }
                return cart;
            });
            dispatch({
                type: "INPUTS_OBJECT_I",
                payload: {cart},
            });
            localStorage.setItem("cart", JSON.stringify(cart));
        }
    };
    
    const handleRemove = (product) => {
        let cart = [];
        if (typeof window !== undefined) {
            if (localStorage.getItem("cart")) {
                cart = JSON.parse(localStorage.getItem("cart"));
            }
            cart.filter((prod, i) => {
                if (prod._id === product._id && prod.variant === product.variant) {
                cart.splice(i, 1);
                }
                return cart;
            });
            dispatch({
                type: "INPUTS_OBJECT_I",
                payload: {cart},
            });
            localStorage.setItem("cart", JSON.stringify(cart));
        }
    };
    
    const columns = [
        {
            key: "image",
            label: "Image",
            content: (product) =>
                <div style={{ width: "100px", height: "auto" }}>
                    {product.images.length ? (
                    <ModalImage
                        small={product.images[0].url}
                        large={product.images[0].url}
                        alt={product.images[0].public_id}
                    />
                    ) : (
                    <ModalImage small={noImage} alt="no Image" />
                    )}
                </div>,
        },
        {
            key: "title",
            label: "Title",
            content: (product) => product.title,
        },
        {
            key: "price",
            label: "Price",
            content: (product) => <NumberFormat
                    value={product.price.toFixed(2)}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={estore.country.currency}
                />,
        },
        {
            key: "quantity",
            label: "Quantity",
            content: (product) =>
                <input
                    type="number"
                    className="form-control text-center"
                    value={product.count}
                    onChange={(e) => handleQuantityChange(e.target.value, product)}
                />,
        },
        {
            key: "variant",
            label: "Variant",
            content: (product) => {
                const productVariant = product.variants.filter(v => v._id === product.variant);
                return productVariant[0] && productVariant[0].name
            },
        },
        {
            key: "action",
            label: "Action",
            content: (product) => 
            <CloseOutlined
                onClick={() => handleRemove(product)}
                className="text-danger"
                style={{ cursor: "pointer" }}
          />,
        },
    ];

    return (
        <>
            {!cart.length ? (
                <p>
                    No products in cart. <Link to="/shop">Continue Shopping.</Link>
                </p>
            ) : (
                <table className="table">
                    <TableHeader columns={columns} />
                    <TableBody
                        columns={columns}
                        data={cart}
                    />
                </table>
            )}
        </>
    );
}
 
export default CartProductTable;