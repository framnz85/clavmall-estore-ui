import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Card, Button, Result } from "antd";
import { Link } from "react-router-dom";
import { DollarOutlined, CheckOutlined } from "@ant-design/icons";
import NumberFormat from "react-number-format";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

import { getCartTotals } from "../../functions/stripe";
import currencySymbols from "../common/constants/currencySymbols";
import { createOrder } from "../../functions/order";
import { emptyUserCart } from "../../functions/user";

const PaypalCheckout = ({ succeeded, setSucceeded }) => {
  let dispatch = useDispatch();
  const { user, inputs, estore } = useSelector((state) => ({
    ...state,
  }));
  const { payopt } = inputs;
  const currencyCode = currencySymbols.filter(
    (cur) => cur.country === estore.country.name
  );

  const [clientId, setClientId] = useState("");
  const [orderCode, setOrderCode] = useState("");
  const [cartTotal, setCartTotal] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);

  useEffect(() => {
    getCartTotals(user.token).then((res) => {
      if (res.data.err) return toast.error(res.data.err);

      setClientId(res.data.clientId);
      setOrderCode(res.data.orderCode);
      setCartTotal(res.data.cartTotal);
      setGrandTotal(res.data.grandTotal);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleApprove = (sellerTxnID) => {
    if (sellerTxnID) {
      createOrder(
        { paymentOption: payopt, orderCode, sellerTxnID },
        user.token
      ).then((res) => {
        if (res.data.ok) {
          dispatch({
            type: "INPUTS_OBJECT_VII",
            payload: { cart: [] },
          });
          if (typeof window !== undefined) {
            localStorage.removeItem("cart");
          }
          emptyUserCart(user.token).then();
        }
      });
      setSucceeded(true);
    }
  };

  return (
    <>
      <div className="text-center pb-3">
        <Card
          cover={
            <>
              <h3 className="alert alert-warning">
                Grand Total:{" "}
                <NumberFormat
                  value={Number(grandTotal).toFixed(2)}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={estore.country.currency}
                  style={{ margin: 0 }}
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
                style={{ margin: 0 }}
              />
            </>,
            <>
              <CheckOutlined className="text-info" /> <br /> Total Saved :{" "}
              <NumberFormat
                value={Number(
                  cartTotal > grandTotal ? cartTotal - grandTotal : 0
                ).toFixed(2)}
                displayType={"text"}
                thousandSeparator={true}
                prefix={estore.country.currency}
                style={{ margin: 0 }}
              />
            </>,
          ]}
        />
      </div>
      <div className="text-center pb-3" style={{ color: "red" }}>
        Please note that payment thru Credit / Debit Card via Paypal will incur{" "}
        <br />
        an additional 4.5% on top of the Grand Total. Your final total is{" "}
        <NumberFormat
          value={Number(grandTotal * 1.045).toFixed(2)}
          displayType={"text"}
          thousandSeparator={true}
          prefix={estore.country.currency}
          style={{ margin: 0 }}
        />
      </div>
      {!succeeded && (
        <>
          {clientId && !succeeded && (
            <PayPalScriptProvider
              options={{
                "client-id": clientId,
                currency: currencyCode[0] ? currencyCode[0].code : "USD",
              }}
            >
              <PayPalButtons
                onClick={(data, actions) => {
                  grandTotal === 0 &&
                    toast.error("This order is no longer valid");
                }}
                createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [
                      {
                        description: "Payment for Order Code: " + orderCode,
                        amount: {
                          value: Number(grandTotal * 1.045).toFixed(2),
                        },
                      },
                    ],
                  });
                }}
                onApprove={async (data, actions) => {
                  const order = await actions.order.capture();
                  handleApprove(
                    order.purchase_units[0].payments.captures[0].id
                  );
                }}
                onError={(err) => {
                  toast.error(err);
                }}
              />
            </PayPalScriptProvider>
          )}
          <br />
        </>
      )}
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
    </>
  );
};

export default PaypalCheckout;
