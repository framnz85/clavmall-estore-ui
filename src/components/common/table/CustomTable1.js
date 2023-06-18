import React from 'react';
import { Link } from "react-router-dom";
import {
    DeleteOutlined,
    EditOutlined,
    CaretRightOutlined,
} from "@ant-design/icons";

const CustomTable1 = ({ data, subname, bgColor, handleRemove, linkTo }) => {
    return (
        <div
            className="alert alert-success"
            style={{ backgroundColor: bgColor }}
        >
            {data.name}{" "} {subname && <><CaretRightOutlined /> {subname}</>}
            <span
                onClick={() => handleRemove(data.parent, data.slug, data.name)}
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
}

export default CustomTable1;