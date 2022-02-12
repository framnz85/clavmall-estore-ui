import React from "react";
import { Card } from "antd";
import { Link } from "react-router-dom";
import { EditOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import noImage from "../../images/noimage.jpg";

const { Meta } = Card;

const AdminProductCard = ({ product, handleRemove, canEdit }) => {
  const { _id, title, slug, variants, images } = product;

  return (
    <Card
      style={{ height: "303px", width: "230px" }}
      cover={
        <img
          alt={title}
          src={images && images.length > 0 ? images[0].url : noImage}
          className="m-1"
          style={{ height: "150px", width: "222px", objectFit: "cover" }}
        />
      }
      actions={
        canEdit
          ? [
              <Link to={`/product/${slug}`} target="_blank">
                <EyeOutlined />
              </Link>,
              <Link to={`/admin/product/${slug}`}>
                <EditOutlined className="text-secondary" />
              </Link>,
              <DeleteOutlined
                className="text-danger"
                onClick={() => handleRemove(slug, title, images)}
              />,
            ]
          : [
              <Link to={`/product/${slug}`} target="_blank">
                <EyeOutlined />
              </Link>,
              <DeleteOutlined
                className="text-danger"
                onClick={() => handleRemove(_id)}
              />,
            ]
      }
    >
      <Meta
        title={title}
        description={
          variants[0].name.length > 25
            ? variants[0].name.substr(0, 25) + "..."
            : variants[0].name
        }
      />
    </Card>
  );
};

export default AdminProductCard;
