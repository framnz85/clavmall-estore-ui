import React, { useEffect, useState } from "react";
import { Modal, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  ShoppingCartOutlined,
  CaretRightOutlined,
  MinusSquareOutlined,
  PlusSquareOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import _ from "lodash";
import { toast } from "react-toastify";
import NumberFormat from "react-number-format";

import RelatedProducts from "../product/RelatedProducts";
import ImageShow from "../common/ImageShow";
import noImage from "../../images/noimage.jpg";

import { userCart } from "../../functions/user";

const AddToCart = ({ product, addToCart, setAddToCart }) => {
  let dispatch = useDispatch();

  const { inputs, estore, user } = useSelector((state) => ({ ...state }));
  const { cart } = inputs;

  const [cartProd, setCartProd] = useState({});
  const [variant, setVariant] = useState({});

  useEffect(() => {
    const prod = cart.filter((prod) => prod._id === product._id);
    if (prod[0]) {
      setCartProd(prod[0]);
      const pVariant = prod[0].variants.filter(
        (v) => v._id === prod[0].variant
      );
      if (pVariant[0]) {
        setVariant(pVariant[0]);
      }
    }
    if (estore.status !== "active" && user.role === "admin") {
      toast.warning(
        "NOTE: Your website is no longer active but since you are an admin you can still do ordering. However, your customer cannot order if your website is not active."
      );
    }
  }, [cart]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const imageStyle = {
    width: "100px",
    height: "100px",
    objectFit: "cover",
  };

  return (
    <Modal
      title={
        estore.status === "active" ? (
          <span style={{ color: "green" }}>Successfully Added To Cart</span>
        ) : (
          <span style={{ color: "red" }}>"Store Inactive"</span>
        )
      }
      centered
      visible={addToCart}
      onOk={() => ""}
      onCancel={() => setAddToCart(false)}
      footer={[
        <Button
          key="1"
          onClick={() => {
            setAddToCart(false);
          }}
          className="text-center btn btn-primary btn-raised"
          style={{ marginRight: 5 }}
        >
          <ShoppingOutlined /> Continue
        </Button>,
        <Link key="2" to="/cart">
          <Button
            onClick={() => {
              setAddToCart(false);
            }}
            className="text-center btn btn-default btn-raised"
          >
            <ShoppingCartOutlined /> Go To Cart
          </Button>
        </Link>,
      ]}
    >
      {estore.status === "active" || user.role === "admin" ? (
        <div>
          <div className="row p-2 pl-4">
            {cartProd.images && cartProd.images[0] ? (
              <>
                <div style={{ float: "left", width: "30%" }}>
                  <ImageShow
                    alt={cartProd.title}
                    imgid={
                      cartProd.images && cartProd.images.length > 0
                        ? cartProd.images[0].url
                        : ""
                    }
                    style={imageStyle}
                    type="/thumb"
                  />
                </div>
                <div style={{ float: "left", width: "70%", paddingTop: 10 }}>
                  <div className="text-left">
                    {cartProd.title && cartProd.title.length > 28
                      ? cartProd.title.slice(0, 28)
                      : cartProd.title}{" "}
                    <CaretRightOutlined />({variant && variant.name})
                  </div>
                  <div style={{ clear: "both", marginTop: 3 }}>
                    <NumberFormat
                      value={Number(cartProd.price).toFixed(2)}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={estore.country.currency}
                    />
                  </div>
                  <div
                    className="d-flex justify-content-start"
                    style={{ marginTop: 3 }}
                  >
                    <div style={{ marginRight: 10 }}>Qty.</div>
                    <div>
                      <MinusSquareOutlined
                        style={{
                          fontSize: 18,
                          color: "red",
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          handleQuantityChange(
                            parseFloat(cartProd.count) > 0
                              ? parseFloat(cartProd.count) - 1
                              : 0,
                            cartProd
                          )
                        }
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        className="text-center"
                        value={cartProd.count ? cartProd.count : ""}
                        onChange={(e) =>
                          handleQuantityChange(e.target.value, cartProd)
                        }
                        style={{ border: "none", width: 40 }}
                      />
                    </div>
                    <div>
                      <PlusSquareOutlined
                        style={{
                          fontSize: 18,
                          color: "green",
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          handleQuantityChange(
                            parseFloat(cartProd.count ? cartProd.count : 0) + 1,
                            cartProd
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div style={{ float: "left", width: "40%" }}>
                  <img src={noImage} style={imageStyle} alt="eStore" />
                </div>
                <div style={{ float: "left", width: "60%", paddingTop: 10 }}>
                  <p className="text-left p-1">
                    {cartProd.title && cartProd.title.length > 28
                      ? cartProd.title.slice(0, 28)
                      : cartProd.title}{" "}
                    <CaretRightOutlined />({variant && variant.name}) x{" "}
                  </p>
                  <div
                    className="d-flex justify-content-start"
                    style={{ marginTop: 10 }}
                  >
                    <div style={{ marginRight: 10 }}>Qty.</div>
                    <div>
                      <MinusSquareOutlined
                        style={{
                          fontSize: 18,
                          color: "red",
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          handleQuantityChange(
                            parseFloat(cartProd.count) > 0
                              ? parseFloat(cartProd.count) - 1
                              : 0,
                            cartProd
                          )
                        }
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        className="text-center"
                        value={cartProd.count ? cartProd.count : 0}
                        onChange={(e) =>
                          handleQuantityChange(e.target.value, cartProd)
                        }
                        style={{ border: "none", width: 40 }}
                      />
                    </div>
                    <div>
                      <PlusSquareOutlined
                        style={{
                          fontSize: 18,
                          color: "green",
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          handleQuantityChange(
                            parseFloat(cartProd.count) + 1,
                            cartProd
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div align="center" style={{ color: "red" }}>
          This store is not active as of the moment. Contact administrator.
        </div>
      )}
      <RelatedProducts product={product} addCart={true} />
    </Modal>
  );
};

export default AddToCart;
