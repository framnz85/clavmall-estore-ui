import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Tooltip, Button } from "antd";
import {
  HeartOutlined,
  ShoppingCartOutlined,
  DeploymentUnitOutlined,
} from "@ant-design/icons";
import { Carousel } from "react-responsive-carousel";
import StarRatings from "react-star-ratings";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import _ from "lodash";
import noImage from "../../images/noimage.jpg";
import ProductListItems from "./ProductListItems";
import RatingModal from "../modal/RatingModal";
import showAverage from "../../functions/rating";
import { addToWishlist } from "../../functions/user";
import { toast } from "react-toastify";

const SingleProduct = ({ product, onStarClick, star }) => {
  const dispatch = useDispatch();
  const { _id, title, images, variants } = product;

  const [variant, setVariant] = useState();
  const [tooltip, setTooltip] = useState("Click to add");

  const { user } = useSelector((state) => ({ ...state }));

  const handleAddToCart = () => {
    let cart = [];
    if (typeof window !== undefined) {
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }

      cart.push({
        ...product,
        count: 1,
        variant: variant ? variant : variants[0]._id,
      });

      let unique = _.uniqWith(cart, _.isEqual);
      localStorage.setItem("cart", JSON.stringify(unique));
      setTooltip("Added");

      dispatch({
        type: "ADD_TO_CART",
        payload: unique,
      });

      dispatch({
        type: "SET_VISIBLE",
        payload: true,
      });
    }
  };

  const handleAddToWishlist = (e) => {
    e.preventDefault();

    addToWishlist(product._id, user.token).then((res) => {
      let newWishlist = user.wishlist ? user.wishlist : [];

      newWishlist.push(product);

      dispatch({
        type: "USER_WISHLIST",
        payload: { ...user, wishlist: newWishlist },
      });

      toast.success("Added to wishlist");
    });
  };

  return (
    <>
      <div className="col-md-6">
        {images && images.length ? (
          <Carousel showArrows={true} showThumbs={true} autoPlay infiniteLoop>
            {images &&
              images.map((img) => (
                <div key={img.public_id}>
                  <img src={img.url} alt={img.public_id} />
                </div>
              ))}
          </Carousel>
        ) : (
          <Card
            cover={<img src={noImage} alt="eStore" className="mb-3" />}
          ></Card>
        )}
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
            <>
              <DeploymentUnitOutlined className="text-success" /> <br /> Connect
            </>,
          ]}
        >
          <ProductListItems product={product} setVariant={setVariant} />

          <Tooltip title={tooltip}>
            <Button
              type="primary"
              size="large"
              onClick={handleAddToCart}
              style={{ width: "100%" }}
              disabled={product.quantity < 1}
            >
              <ShoppingCartOutlined />{" "}
              {product.quantity < 1 ? "Out of stock" : "Add to Cart"}
            </Button>
          </Tooltip>

          <Button
            onClick={() => {
              dispatch({
                type: "SET_VISIBLE",
                payload: true,
              });
            }}
            type="secondary"
            style={{ width: "100%", marginTop: "15px" }}
          >
            Show Cart Drawer
          </Button>
        </Card>
      </div>
    </>
  );
};

export default SingleProduct;
