import React from "react";
import { Drawer, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { ShoppingCartOutlined } from "@ant-design/icons";
import noImage from "../../images/noimage.jpg";

const SideDrawer = () => {
  const dispatch = useDispatch();
  const { cart, drawer } = useSelector((state) => ({ ...state }));

  const imageStyle = {
    width: "100%",
    height: "50px",
    objectFit: "cover",
  };

  return (
    <Drawer
      className="text-center"
      title={`Cart (${cart && cart.length})`}
      placement="right"
      closable={false}
      onClose={() => {
        dispatch({
          type: "SET_VISIBLE",
          payload: false,
        });
      }}
      visible={drawer}
    >
      {cart &&
        cart.map((p) => (
          <div key={p._id + p.variant} className="row">
            {p.images[0] ? (
              <>
                <img
                  src={p.images[0].url}
                  style={imageStyle}
                  alt={p.images[0].public_id}
                />
                <p className="text-center p-1" style={{ width: "100%" }}>
                  {p.title.length > 28 ? p.title.slice(0, 28) : p.title} <br />{" "}
                  ({p.variants.filter((v) => v._id === p.variant)[0].name}) x{" "}
                  {p.count}
                </p>
              </>
            ) : (
              <>
                <img src={noImage} style={imageStyle} alt="eStore" />
                <p className="text-center p-1" style={{ width: "100%" }}>
                  {p.title.length > 28 ? p.title.slice(0, 28) : p.title} <br />{" "}
                  ({p.variants.filter((v) => v._id === p.variant)[0].name}) x{" "}
                  {p.count}
                </p>
              </>
            )}
          </div>
        ))}

      <Link to="/cart">
        <Button
          onClick={() => {
            dispatch({
              type: "SET_VISIBLE",
              payload: false,
            });
          }}
          className="text-center btn btn-primary btn-raised btn-block"
        >
          <ShoppingCartOutlined /> Go To Cart
        </Button>
      </Link>
    </Drawer>
  );
};

export default SideDrawer;
