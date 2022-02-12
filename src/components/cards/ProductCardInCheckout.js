import React from "react";
import ModalImage from "react-modal-image";
import { useDispatch } from "react-redux";
import { CloseOutlined } from "@ant-design/icons";
import noImage from "../../images/noimage.jpg";

const ProductCardInCheckout = ({ p }) => {
  const dispatch = useDispatch();

  const handleVariantChange = (e) => {
    let cart = [];
    if (typeof window !== undefined) {
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }

      cart.map((product, i) => {
        if (product._id === p._id) {
          cart[i].variant = e.target.value;
        }
        return cart;
      });

      localStorage.setItem("cart", JSON.stringify(cart));

      dispatch({
        type: "ADD_TO_CART",
        payload: cart,
      });
    }
  };

  const handleQuantityChange = (e) => {
    let cart = [];
    if (typeof window !== undefined) {
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }

      cart.map((product, i) => {
        if (product._id === p._id) {
          cart[i].count = e.target.value;
        }
        return cart;
      });

      localStorage.setItem("cart", JSON.stringify(cart));

      dispatch({
        type: "ADD_TO_CART",
        payload: cart,
      });
    }
  };

  const handleRemove = () => {
    let cart = [];
    if (typeof window !== undefined) {
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }

      cart.filter((product, i) => {
        if (product._id === p._id && product.variant === p.variant) {
          cart.splice(i, 1);
        }
        return cart;
      });

      localStorage.setItem("cart", JSON.stringify(cart));

      dispatch({
        type: "ADD_TO_CART",
        payload: cart,
      });
    }
  };

  return (
    <tbody>
      <tr>
        <td>
          <div style={{ width: "100px", height: "auto" }}>
            {p.images.length ? (
              <ModalImage
                small={p.images[0].url}
                large={p.images[0].url}
                alt={p.images[0].public_id}
              />
            ) : (
              <ModalImage small={noImage} alt="no Image" />
            )}
          </div>
        </td>
        <td>{p.title}</td>
        <td>₱{p.price.toFixed(2)}</td>
        <td>
          <input
            type="number"
            className="form-control text-center"
            value={p.count}
            onChange={handleQuantityChange}
          />
        </td>
        <td>
          <select
            onChange={handleVariantChange}
            name="variant"
            className="form-control"
            defaultValue={p.variant}
          >
            {p.variants.map((v) => (
              <option key={v._id} value={v._id}>
                {v.name}
              </option>
            ))}
          </select>
        </td>
        <td className="text-center">
          <CloseOutlined
            onClick={handleRemove}
            className="text-danger"
            style={{ cursor: "pointer" }}
          />
        </td>
      </tr>
    </tbody>
  );
};

export default ProductCardInCheckout;
