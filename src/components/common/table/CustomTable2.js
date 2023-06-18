import React from "react";
import { Link } from "react-router-dom";
import {
  DeleteOutlined,
  EditOutlined,
  CaretRightOutlined,
} from "@ant-design/icons";

import ImageShow from "../ImageShow";

const CustomTable2 = ({ data, subname, bgColor, handleRemove, linkTo }) => {
  return (
    <div className="alert alert-success" style={{ backgroundColor: bgColor }}>
      <ImageShow
        alt={data.name}
        imgid={data.images && data.images.length > 0 ? data.images[0].url : ""}
        style={{
          height: "100px",
          width: "110px",
          objectFit: "cover",
          paddingRight: "10px",
        }}
        type="/thumb"
      />
      {data.name}{" "}
      {subname && (
        <>
          <CaretRightOutlined /> {subname}
        </>
      )}
      <span
        onClick={() => handleRemove(data.slug, data.name)}
        className="btn btn-sm float-right"
      >
        <DeleteOutlined className="text-danger" />
      </span>{" "}
      <Link to={linkTo}>
        <span className="btn btn-sm float-right">
          <EditOutlined className="text-secondary" />
        </span>
      </Link>
    </div>
  );
};

export default CustomTable2;
