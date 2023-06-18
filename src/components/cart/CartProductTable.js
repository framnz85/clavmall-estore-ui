import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  DeleteOutlined,
  MinusSquareOutlined,
  PlusSquareOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import NumberFormat from "react-number-format";
import _ from "lodash";

import ImageShow from "../common/ImageShow";
import TableHeader from "../common/table/TableHeader";
import TableBody from "../common/table/TableBody";

import { userCart } from "../../functions/user";

const CartProductTable = ({ cart }) => {
  let dispatch = useDispatch();

  const { estore, user } = useSelector((state) => ({
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
      if (user._id) {
        let unique = _.uniqWith(cart, _.isEqual);
        dispatch({
          type: "INPUTS_OBJECT_I",
          payload: { cart: unique },
        });
        localStorage.setItem("cart", JSON.stringify(cart));
        userCart(cart, user.token);
      } else {
        dispatch({
          type: "INPUTS_OBJECT_I",
          payload: { cart },
        });
        localStorage.setItem("cart", JSON.stringify(cart));
      }
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
      if (user._id) {
        userCart(cart, user.token).then((res) => {
          if (res.data.cart) {
            let unique = _.uniqWith(res.data.cart, _.isEqual);
            dispatch({
              type: "INPUTS_OBJECT_I",
              payload: { cart: unique },
            });
            localStorage.setItem("cart", JSON.stringify(cart));
          }
        });
      } else {
        dispatch({
          type: "INPUTS_OBJECT_I",
          payload: { cart },
        });
        localStorage.setItem("cart", JSON.stringify(cart));
      }
    }
  };

  const columns = [
    {
      key: "image",
      label: "Image",
      content: (product) => (
        <Link
          to={`/product/${product.slug}`}
          style={{ marginRight: 15, cursor: "pointer" }}
        >
          <ImageShow
            alt={product.title}
            imgid={
              product.images && product.images.length > 0
                ? product.images[0].url
                : ""
            }
            style={{
              width: "100px",
              height: "100px",
            }}
            type="/thumb"
          />
        </Link>
      ),
    },
    {
      key: "title",
      label: "Title",
      content: (product) => (
        <Link to={`/product/${product.slug}`}>{product.title}</Link>
      ),
    },
    {
      key: "price",
      label: "Price",
      content: (product) => (
        <NumberFormat
          value={product.price.toFixed(2)}
          displayType={"text"}
          thousandSeparator={true}
          prefix={estore.country.currency}
        />
      ),
    },
    {
      key: "quantity",
      label: "Quantity",
      content: (product) => (
        <div className="d-flex justify-content-start">
          <div>
            <MinusSquareOutlined
              style={{ fontSize: 18, color: "red", cursor: "pointer" }}
              onClick={() =>
                handleQuantityChange(
                  parseFloat(product.count) > 0
                    ? parseFloat(product.count) - 1
                    : 0,
                  product
                )
              }
            />
          </div>
          <div>
            <input
              type="text"
              className="text-center"
              value={product.count ? product.count : ""}
              onChange={(e) => handleQuantityChange(e.target.value, product)}
              style={{ border: "none", width: 40 }}
            />
          </div>
          <div>
            <PlusSquareOutlined
              style={{ fontSize: 18, color: "green", cursor: "pointer" }}
              onClick={() =>
                handleQuantityChange(
                  parseFloat(product.count ? product.count : 0) + 1,
                  product
                )
              }
            />
          </div>
        </div>
      ),
    },
    {
      key: "variant",
      label: "Variant",
      content: (product) => {
        const productVariant = product.variants.filter(
          (v) => v._id === product.variant
        );
        return productVariant[0] && productVariant[0].name;
      },
    },
    {
      key: "action",
      label: "Action",
      content: (product) => (
        <DeleteOutlined
          onClick={() => handleRemove(product)}
          className="text-danger"
          style={{ cursor: "pointer" }}
        />
      ),
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
          <TableBody columns={columns} data={cart} />
        </table>
      )}
    </>
  );
};

export default CartProductTable;
