import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Card, Skeleton } from "antd";

import noImage from "../../images/noimage.jpg";
import { getCategories } from "../../functions/category";

const CategoryProducts = ({ others }) => {
  let dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const { categories, products, user } = useSelector((state) => ({
    ...state,
  }));

  useEffect(() => {
    loadCategories();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadCategories = () => {
    if (typeof window !== undefined) {
      if (
        !localStorage.getItem("categories") ||
        !localStorage.getItem("products") ||
        !JSON.parse(localStorage.getItem("products")).length
      ) {
        setLoading(true);
        getCategories(user.address ? user.address : {}).then((category) => {
          dispatch({
            type: "CATEGORY_LIST_I",
            payload: category.data.categories,
          });
          dispatch({
            type: "PRODUCT_LIST_VII",
            payload: category.data.products,
          });
          setLoading(false);
        });
      }
    }
  };

  const limit = categories.length < 14 ? 7 : 14;

  const backColor = [
    { color: "#F5FFFA" },
    { color: "#fff0f2" },
    { color: "#FFFFF0" },
    { color: "#F8F8FF" },
    { color: "#F0F8FF" },
    { color: "#F5FFFA" },
    { color: "#FDF5E6" },
    { color: "#F5FFFA" },
    { color: "#fff0f2" },
    { color: "#FFFFF0" },
    { color: "#F8F8FF" },
    { color: "#F0F8FF" },
    { color: "#F5FFFA" },
    { color: "#FDF5E6" },
  ];

  const loadSkeleton = (count) => {
    let totalCards = [];

    for (let i = 0; i < count; i++) {
      totalCards.push(
        <Card.Grid
          style={{
            width: "14.28%",
            height: "180px",
          }}
          key={i}
        >
          <Skeleton active></Skeleton>
        </Card.Grid>
      );
    }

    return totalCards;
  };

  const getRandomImage = (id) => {
    const forRandomProducts = products.filter(
      (product) => product.category._id === id
    );

    const result =
      forRandomProducts[Math.floor(Math.random() * forRandomProducts.length)];

    return result && result.images[0] ? result.images[0].url : noImage;
  };

  return (
    <div className="container mt-3">
      {others ? <h5>Other Categories</h5> : <h5>Categories</h5>}
      {loading ? (
        <Card>{loadSkeleton(14)}</Card>
      ) : (
        <div style={{ marginLeft: "2px" }}>
          {categories
            .sort(() => Math.random() - 0.5)
            .slice(0, limit)
            .map((category, index) => {
              const { _id, name, slug } = category;
              const image = getRandomImage(_id);

              return (
                <Link to={`/category/${slug}`} key={_id}>
                  <Card.Grid
                    style={{
                      width: "14.23%",
                      height: "180px",
                      textAlign: "center",
                      backgroundColor: backColor[index].color,
                      cursor: "pointer",
                      margin: "0",
                    }}
                  >
                    <img
                      alt={name}
                      src={image && image.length > 0 ? image : noImage}
                      style={{ width: "100px", height: "100px" }}
                    />
                    <br />
                    {name}
                  </Card.Grid>
                </Link>
              );
            })}
        </div>
      )}
      <div style={{ clear: "both" }}></div>
    </div>
  );
};

export default CategoryProducts;
