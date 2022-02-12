import React from "react";
import { useSelector } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Button } from "antd";
import { RollbackOutlined } from "@ant-design/icons";
import StripeCheckout from "../components/payment/StripeCheckout";
import CashCheckout from "../components/payment/CashCheckout";
import "../stripe.css";

const promise = loadStripe("pk_test_yiuZ6Kr6nsilFY5Yz77cFcOK009BfKQFKE");

const Payment = ({ history }) => {
  const { payopt } = useSelector((state) => ({
    ...state,
  }));

  return (
    <div className="container p-5 text-center">
      <h4>Complete your purchase</h4>
      {payopt === "Credit/Debit Card" && (
        <Elements stripe={promise}>
          <div className="col-md-8 offset-md-2">
            <StripeCheckout />
          </div>
        </Elements>
      )}
      {payopt === "Cash on Delivery" && (
        <div className="col-md-8 offset-md-2">
          <CashCheckout />
        </div>
      )}
      <Button
        type="secondary"
        onClick={() => history.push("/checkout")}
        size="large"
        style={{ width: "100", marginTop: "15px" }}
      >
        <RollbackOutlined />
        Back to Checkout
      </Button>
    </div>
  );
};

export default Payment;
