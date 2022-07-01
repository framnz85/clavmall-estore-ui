import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Card } from "antd";
import NumberFormat from "react-number-format";

import noImage from "../../images/noimage.jpg";
import showAverage from "../../functions/rating";

const { Meta } = Card;

const ProductCard = ({ product, priceShow }) => {
  const { title, slug, price, variants, images } = product;
  let variantDesc = "";

  const { estore } = useSelector((state) => ({
      ...state,
  }));

  for (const value of variants) {
    variantDesc += value.name + " ";
  }

  return (
    <Link to={`/product/${slug}`}>
      <Card
        hoverable
        style={
          priceShow
            ? { height: "323px", width: "213px" }
            : { height: "210px", width: "213px" }
        }
        cover={
          <img
            alt={title}
            src={images && images.length > 0 ? images[0].url : noImage}
            className="m-1"
            style={{ height: "150px", width: "205px", objectFit: "cover" }}
          />
        }
        actions={
          priceShow
            ? [
                <div className="ml-4" style={{ color: "#ff8c00" }}>
                  {showAverage(product, "14px")}
                  <div style={{ float: "left", clear: "both" }}>
                    <NumberFormat
                      value={Number(price).toFixed(2)}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={estore.country.currency}
                  />
                  </div>
                </div>,
              ]
            : ""
        }
      >
        <Meta
          title={title}
          description={
            priceShow
              ? variantDesc.length > 20
                ? variantDesc.slice(0, 20) + "..."
                : variantDesc
              : ""
          }
        />
      </Card>
    </Link>
  );
};

export default ProductCard;
