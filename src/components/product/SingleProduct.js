import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Card, Tooltip, Button } from "antd";
import { HeartOutlined, PlusOutlined } from "@ant-design/icons";
import StarRatings from "react-star-ratings";
import _ from "lodash";
import { toast } from "react-toastify";

import ProductListItems from "./ProductListItems";
import RatingModal from "../modal/RatingModal";
import showAverage from "../../functions/rating";
import LocationModal from "../modal/LocationModal";
import AddToCart from "../modal/AddToCart";
import BuyButton from "../../components/nav/BuyButton";
import ImagesShow from "../common/ImagesShow";

import { addToWishlist } from "../../functions/user";
import { userCart } from "../../functions/user";

import "react-responsive-carousel/lib/styles/carousel.min.css";

const SingleProduct = ({ product, onStarClick, star, unavailable }) => {
  let dispatch = useDispatch();
  let history = useHistory();

  const { _id, slug, title, images, variants } = product;

  const [variant, setVariant] = useState();
  const [tooltip, setTooltip] = useState(
    unavailable ? "Unavailable" : "Click to add"
  );
  const [addToCart, setAddToCart] = useState(false);
  const [locModalVisible, setLocModalVisible] = useState(false);

  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    setVariant(variants[0] && variants[0]._id);
    setAddToCart(false);
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAddToCart = () => {
    let cart = [];
    const variantSelect = variant ? variant : variants[0]._id;
    if (user.address && user.address.addiv3) {
      if (typeof window !== undefined) {
        if (localStorage.getItem("cart")) {
          cart = JSON.parse(localStorage.getItem("cart"));
        }
        const existProduct = cart.filter(
          (product) => product._id === _id && product.variant === variantSelect
        );
        if (existProduct[0]) {
          cart = cart.map((product) =>
            product._id === _id && product.variant === variantSelect
              ? { ...product, count: parseFloat(product.count) + 1 }
              : product
          );
        } else {
          cart.push({
            ...product,
            count: 1,
            variant: variantSelect,
          });
        }
        if (user._id) {
          let unique = _.uniqWith(cart, _.isEqual);
          dispatch({
            type: "INPUTS_OBJECT_IX",
            payload: { cart: unique },
          });
          localStorage.setItem("cart", JSON.stringify(cart));
          userCart(cart, user.token);
        } else {
          let unique = _.uniqWith(cart, _.isEqual);
          dispatch({
            type: "INPUTS_OBJECT_IX",
            payload: { cart: unique },
          });
          localStorage.setItem("cart", JSON.stringify(cart));
        }

        setAddToCart(true);
        setTooltip("Added");
      }
    } else {
      setLocModalVisible(true);
    }
  };

  const handleAddToWishlist = (e) => {
    e.preventDefault();

    if (user && user.token) {
      const existWishlist = user.wishlist.filter((p) => p._id === product._id);

      if (existWishlist.length > 0) {
        toast.warning("Product already in wishlist");
      } else {
        addToWishlist(product._id, user.token).then((res) => {
          dispatch({
            type: "LOGGED_IN_USER_IV",
            payload: { wishlist: res.data.wishlist },
          });
          toast.success("Added to wishlist");
        });
      }
    } else {
      history.push({
        pathname: "/login",
        state: { from: `/product/${slug}` },
      });
    }
  };

  return (
    <>
      <div className="col-md-6">
        <ImagesShow imgArray={images} prodName={product.title} />
      </div>
      <div className="col-md-6">
        <h3 className="pt-3 pl-3 m-0">{title}</h3>

        <div className="pb-3 pl-2 m-1">{showAverage(product, "18px")}</div>
        <Card
          actions={[
            <div onClick={handleAddToWishlist}>
              {(user.wishlist
                ? user.wishlist.filter((p) => p._id === product._id)
                : []
              ).length > 0 ? (
                <HeartOutlined style={{ color: "red" }} />
              ) : (
                <HeartOutlined />
              )}{" "}
              <br />
              Add to Wishlist
            </div>,
            <RatingModal>
              <StarRatings
                name={_id}
                numberOfStars={5}
                rating={star}
                changeRating={onStarClick}
                isSelectable={true}
                starRatedColor="red"
              />
            </RatingModal>,
          ]}
        >
          <ProductListItems product={product} setVariant={setVariant} />

          <Tooltip title={tooltip}>
            {product.quantity < 1 || unavailable ? (
              <div
                align="center"
                style={{
                  width: "100%",
                  border: "1px solid #999",
                  padding: "5px",
                  color: "#999",
                }}
              >
                {product.quantity < 1
                  ? "Out of stock"
                  : unavailable
                  ? "Unavailable"
                  : ""}
              </div>
            ) : (
              <Button
                type="primary"
                size="large"
                onClick={handleAddToCart}
                style={{ width: "100%" }}
              >
                <PlusOutlined /> Add to Cart
              </Button>
            )}
          </Tooltip>
        </Card>
      </div>
      <AddToCart
        product={product}
        addToCart={addToCart}
        setAddToCart={setAddToCart}
      />
      <LocationModal
        locModalVisible={locModalVisible}
        setLocModalVisible={setLocModalVisible}
      />
      <BuyButton handleAddToCart={handleAddToCart} />
    </>
  );
};

export default SingleProduct;
