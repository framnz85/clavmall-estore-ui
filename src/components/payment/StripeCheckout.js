import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Link } from "react-router-dom";
import { Card, Button, Result } from "antd";
import { DollarOutlined, CheckOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import NumberFormat from "react-number-format";

import { createPaymentIntent } from "../../functions/stripe";
import { createOrder } from "../../functions/order";
import { emptyUserCart } from "../../functions/user";

const StripeCheckout = ({succeeded, setSucceeded}) => {
  let dispatch = useDispatch();
  const { user, inputs, estore } = useSelector((state) => ({
    ...state,
  }));
  const { payopt } = inputs;

  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState("");

  const [orderCode, setOrderCode] = useState("");
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
      if (res.data.err) return toast.error(res.data.err)
      
      setClientSecret(res.data.clientSecret);
      setOrderCode(res.data.orderCode)
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
      createOrder({ paymentOption: payopt, orderCode, sellerTxnID: payload.paymentIntent.payment_method }, user.token).then((res) => {
        if (res.data.ok) {
          dispatch({
            type: "INPUTS_OBJECT_VIII",
            payload: {cart: []},
          });
          if (typeof window !== undefined) {
            localStorage.removeItem("cart");
          }
          emptyUserCart(user.token).then();
        }
        setError(null);
        setProcessing(false);
        setSucceeded(true);
      });
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
                  <h3 className="alert alert-warning">Grand Total:{" "}
                      <NumberFormat
                          value={Number(grandTotal).toFixed(2)}
                          displayType={"text"}
                          thousandSeparator={true}
                          prefix={estore.country.currency}
                          style={{margin: 0}}
                      />
                  </h3>
              {succeeded && (
                  <p className="alert alert-success">Successfully Paid!</p>
              )}
              </>
          }
          actions={[
              <>
              <DollarOutlined className="text-info" /> <br /> Cart Total:{" "}
                  <NumberFormat
                      value={Number(cartTotal).toFixed(2)}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={estore.country.currency}
                      style={{margin: 0}}
                  />
              </>,
              <>
              <CheckOutlined className="text-info" /> <br /> Total Saved :{" "}
                  <NumberFormat
                      value={Number(cartTotal > grandTotal ? cartTotal - grandTotal : 0).toFixed(2)}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={estore.country.currency}
                      style={{margin: 0}}
                  />
              </>,
          ]}
          />
      </div>

      <form id="payment-form" className="stripe-form" onSubmit={handleSubmit}>
        {!succeeded && <>
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
        </>}
        {error && (
          <div className="card-error text-danger" role="alert">
            {error}
          </div>
        )}
        <br />
        <div className={succeeded ? "result-message" : "result-message hidden"}>
          <Result
              status="success"
              title="Order Creation Successful"
              subTitle={`Order code: ${orderCode} See order in your purchase history.`}
              extra={[
                  <Link key="1" to="/user/orders">
                      <Button type="primary" key="console">
                          Purchase History
                      </Button>
                  </Link>,
                  <Link key="2" to="/">
                      <Button key="buy">Buy Again</Button>
                  </Link>,
              ]}
          />
        </div>
      </form>
    </>
  );
};

export default StripeCheckout;
