import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import NumberFormat from "react-number-format";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

import BankTransferDetails from "./BankTransferDetails";
import OnlineBankingDetails from "./OnlineBankingDetails";
import RemittanceDetails from "./RemittanceDetails";
import OnlinePaymentDetails from "./OnlinePaymentDetails";
import CryptocurrencyDetails from "./CryptocurrencyDetails";

import currencySymbols from "../../common/constants/currencySymbols";

import { getCartTotals } from "../../../functions/stripe";
import { createOrder } from "../../../functions/order";

const PaymentDetails = ({ order }) => {
  const { user, inputs, estore } = useSelector((state) => ({
    ...state,
  }));
  const { payopt } = inputs;
  const currencyCode = currencySymbols.filter(
    (cur) => cur.country === estore.country.name
  );

  const [succeeded, setSucceeded] = useState(false);
  const [clientId, setClientId] = useState("");
  const [orderCode, setOrderCode] = useState("");
  const [grandTotal, setGrandTotal] = useState(0);

  useEffect(() => {
    if (
      order.paymentOption.category === "Credit/Debit Card" &&
      (order.orderStatus === "Waiting Payment" ||
        order.orderStatus === "Not Processed")
    ) {
      getCartTotals(user.token).then((res) => {
        if (res.data.err) return toast.error(res.data.err);
        setClientId(res.data.clientId);
      });
      setOrderCode(order.orderCode ? order.orderCode : "");
      setGrandTotal(order.grandTotal ? order.grandTotal : 0);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleApprove = (sellerTxnID) => {
    if (sellerTxnID) {
      createOrder(
        { paymentOption: payopt, orderCode, sellerTxnID },
        user.token
      ).then((res) => {
        if (res.data.ok) {
          setSucceeded(true);
        }
      });
    }
  };

  return (
    <>
      {order.paymentOption.category === "Bank Transfer" &&
        (order.orderStatus === "Waiting Payment" ||
          order.orderStatus === "Not Processed") && (
          <BankTransferDetails payid={order.paymentOption.payid} />
        )}
      {order.paymentOption.category === "Online Banking" &&
        (order.orderStatus === "Waiting Payment" ||
          order.orderStatus === "Not Processed") && (
          <OnlineBankingDetails payid={order.paymentOption.payid} />
        )}
      {order.paymentOption.category === "Remittance" &&
        (order.orderStatus === "Waiting Payment" ||
          order.orderStatus === "Not Processed") && (
          <RemittanceDetails payid={order.paymentOption.payid} />
        )}
      {order.paymentOption.category === "Online Payment" &&
        (order.orderStatus === "Waiting Payment" ||
          order.orderStatus === "Not Processed") && (
          <OnlinePaymentDetails payid={order.paymentOption.payid} />
        )}
      {order.paymentOption.category === "Cryptocurrency" &&
        (order.orderStatus === "Waiting Payment" ||
          order.orderStatus === "Not Processed") && (
          <CryptocurrencyDetails payid={order.paymentOption.payid} />
        )}
      {order.paymentOption.category === "Credit/Debit Card" &&
        (order.orderStatus === "Waiting Payment" ||
          order.orderStatus === "Not Processed") && (
          <>
            <div className="text-center pb-3" style={{ color: "red" }}>
              Please note that payment thru Credit / Debit Card via Paypal will
              incur <br />
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
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
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
                              description:
                                "Payment for Order Code: " + orderCode,
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
              </div>
            )}
          </>
        )}
    </>
  );
};

export default PaymentDetails;
