import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card } from "antd";
import { Link } from "react-router-dom";
import { DollarOutlined, CheckOutlined } from "@ant-design/icons";
import { createOrder, emptyUserCart } from "../../functions/user";

const CashCheckout = () => {
  const dispatch = useDispatch();
  const { cart, user, payopt } = useSelector((state) => ({ ...state }));

  const [succeeded, setSucceeded] = useState(false);
  const [processing, setProcessing] = useState(false);

  let {
    maxorder,
    delfee,
    delfeetype,
    discount,
    discounttype,
    servefee,
    servefeetype,
  } = user.address ? user.address.addiv3 : {};

  const getTotal = () => {
    return cart.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.count * nextValue.price;
    }, 0);
  };

  const subtotal = getTotal();
  let grandTotal = subtotal;

  if (discount > 0 && subtotal > 0) {
    discount = Number(
      discounttype === "%" ? (subtotal * discount) / 100 : discount
    );
  } else {
    discount = 0;
  }

  if (delfee > 0 && subtotal > 0) {
    delfee =
      subtotal < maxorder
        ? Number(delfeetype === "%" ? (subtotal * delfee) / 100 : delfee)
        : 0;
  } else {
    delfee = 0;
  }

  if (servefee > 0 && subtotal > 0) {
    servefee = Number(
      servefeetype === "%" ? (subtotal * servefee) / 100 : servefee
    );
  } else {
    servefee = 0;
  }

  if (discount > 0) {
    grandTotal = grandTotal - discount;
  }

  if (delfee > 0) {
    grandTotal = grandTotal + delfee;
  }

  if (servefee > 0) {
    grandTotal = grandTotal + servefee;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    createOrder({ paymentOption: payopt }, user.token).then((res) => {
      if (res.data.ok) {
        if (typeof window !== undefined) {
          localStorage.removeItem("cart");
        }
        dispatch({
          type: "ADD_TO_CART",
          payload: [],
        });
        emptyUserCart(user.token).then();
        setProcessing(false);
        setSucceeded(true);
      }
    });
  };

  return (
    <>
      <div className="text-center pb-5">
        <Card
          cover={
            <>
              <h3 className="alert alert-warning">{`Grand Total: ₱${grandTotal.toFixed(
                2
              )}`}</h3>
            </>
          }
          actions={[
            <>
              <DollarOutlined className="text-info" /> <br /> Cart Total: ₱
              {subtotal.toFixed(2)}
            </>,
            <>
              <CheckOutlined className="text-info" /> <br /> Total Saved : ₱
              {grandTotal.toFixed(2)}
            </>,
          ]}
        />
      </div>

      <button
        className="stripe-button"
        disabled={processing || succeeded}
        onClick={handleSubmit}
      >
        <span id="button-text">
          {processing ? (
            <div className="spinner" id="spinner"></div>
          ) : (
            "Submit COD"
          )}
        </span>
      </button>
      <br />
      <p className={succeeded ? "result-message" : "result-message hidden"}>
        Payment Successful.{" "}
        <Link to="/user/history">See order in your purchase history</Link>
      </p>
    </>
  );
};

export default CashCheckout;
