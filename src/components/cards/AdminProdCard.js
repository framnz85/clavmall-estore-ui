import React from "react";
import { Link } from "react-router-dom";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
} from "@ant-design/icons";

import ImageShow from "../common/ImageShow";

const AllProductsCard = ({
  product,
  handleDuplicate,
  handleRemove,
  canEdit,
}) => {
  const { _id, title, slug, price, variants, images, activate } = product;

  return (
    <div className="row alert alert-light">
      <div className="col-m-2">
        <Link
          to={canEdit ? `/admin/product/${slug}` : `/product/${slug}`}
          target="_blank"
        >
          <ImageShow
            alt={title}
            imgid={images && images.length > 0 ? images[0].url : ""}
            style={{ height: "150px", width: "150px", objectFit: "cover" }}
            type="/thumb"
          />
        </Link>
      </div>
      <div className="col mt-3">
        <div style={{ float: "right", fontSize: "16px" }}>
          {canEdit ? (
            <>
              <Link to={`/product/${slug}`} target="_blank">
                <EyeOutlined className="text-secondary" />
              </Link>{" "}
              <Link to={`/admin/product/${slug}`} target="_blank">
                <EditOutlined className="text-secondary" />
              </Link>{" "}
              <CopyOutlined onClick={() => handleDuplicate(product)} />{" "}
              <DeleteOutlined
                className="text-danger"
                onClick={() => handleRemove(slug, title, images)}
              />
            </>
          ) : (
            <>
              <DeleteOutlined
                className="text-danger"
                onClick={() => handleRemove(_id)}
              />
            </>
          )}
        </div>
        <h6>
          <Link
            to={canEdit ? `/admin/product/${slug}` : `/product/${slug}`}
            style={{ color: "#333333" }}
            target="_blank"
          >
            {title}
          </Link>
        </h6>
        <hr />
        <b>Price:</b> &#8369;{price.toFixed(2)} <b>Variants:</b>{" "}
        {variants && variants.map((variant) => variant.name + ", ")}{" "}
        <b>Active:</b>{" "}
        <span style={{ fontSize: "12px", color: activate ? "green" : "red" }}>
          {activate ? "On" : "Off"}
        </span>
      </div>
    </div>
  );
};

export default AllProductsCard;
