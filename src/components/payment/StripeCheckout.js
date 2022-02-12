import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Link } from "react-router-dom";
import { Card } from "antd";
import { DollarOutlined, CheckOutlined } from "@ant-design/icons";
import { createPaymentIntent } from "../../functions/stripe";
import { createOrder, emptyUserCart } from "../../functions/user";

const StripeCheckout = () => {
  const dispatch = useDispatch();
  const { user, payopt } = useSelector((state) => ({
    ...state,
  }));

  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState("");

  const [cartTotal, setCartTotal] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);

  const stripe = useStripe();
  const elements = useElements();

  const cartStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: "Arial, sans-serif",
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#32325d",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  useEffect(() => {
    createPaymentIntent(user.token).then((res) => {
      setClientSecret(res.data.clientSecret);

      setCartTotal(res.data.cartTotal);
      setGrandTotal(res.data.grandTotal);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: e.target.name.value,
        },
      },
    });

    if (payload.error) {
      setError(`Payment falied ${payload.error.message}`);
      setProcessing(false);
    } else {
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
        }
      });
      setError(null);
      setProcessing(false);
      setSucceeded(true);
    }
  };

  const handleChange = async (e) => {
    setDisabled(e.empty);
    setError(e.error ? e.error.message : "");
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
              {succeeded && (
                <p className="alert alert-success">Successfully Paid!</p>
              )}
            </>
          }
          actions={[
            <>
              <DollarOutlined className="text-info" /> <br /> Cart Total: ₱
              {cartTotal.toFixed(2)}
            </>,
            <>
              <CheckOutlined className="text-info" /> <br /> Total Saved : ₱
              {(cartTotal > grandTotal ? cartTotal - grandTotal : 0).toFixed(2)}
            </>,
          ]}
        />
      </div>

      <form id="payment-form" className="stripe-form" onSubmit={handleSubmit}>
        <CardElement
          id="card-element"
          option={cartStyle}
          onChange={handleChange}
        />
        <button
          className="stripe-button"
          disabled={processing || disabled || succeeded}
        >
          <span id="button-text">
            {processing ? <div className="spinner" id="spinner"></div> : "Pay"}
          </span>
        </button>
        <br />
        {error && (
          <div className="card-error text-danger" role="alert">
            {error}
          </div>
        )}
        <br />
        <p className={succeeded ? "result-message" : "result-message hidden"}>
          Order placed.{" "}
          <Link to="/user/history">See order in your purchase history</Link>
        </p>
      </form>
    </>
  );
};

export default StripeCheckout;
