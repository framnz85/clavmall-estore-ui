import React, {useEffect, useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Button } from "antd";
import { RollbackOutlined } from "@ant-design/icons";

import StripeCheckout from "../../components/payment/StripeCheckout";
import PaypalCheckout from "../../components/payment/PaypalCheckout";
import BankTransfer from "../../components/payment/BankTransfer";
import OnlineBanking from "../../components/payment/OnlineBanking";
import Remittance from "../../components/payment/Remittance";
import OnlinePayment from "../../components/payment/OnlinePayment";
import CodCheckout from "../../components/payment/CodCheckout";
import Cryptocurrency from "../../components/payment/Cryptocurrency";

import { getAllMyPayments } from '../../functions/payment';

import "../../stripe.css";

const promise = loadStripe("pk_test_yiuZ6Kr6nsilFY5Yz77cFcOK009BfKQFKE");

const Payment = ({ history }) => {
  let dispatch = useDispatch();

  const [payName, setPayName] = useState("");
  const [succeeded, setSucceeded] = useState(false);
  
  const { inputs, estore } = useSelector((state) => ({
    ...state,
  }));
  const { payopt } = inputs;

  useEffect(() => {
    document.title = "Shop Online at " + estore.name;
    if (!payopt) history.push("/checkout");
    loadAllMyPayment();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadAllMyPayment = () => {
    getAllMyPayments().then((res) => {
      const getName = res.data.filter(p => p.category === payopt.category);
      if (payopt.category === "Credit/Debit Card" && getName[0]) {
        setPayName(getName[0].name);
        dispatch({
            type: "INPUTS_OBJECT_XI",
            payload: {payopt: {...payopt, payid: getName[0]._id, name: getName[0].name, details: getName[0].details}},
        });
      } else if (payopt.category === "Cash on Delivery" && getName[0]) {
        setPayName("COD");
        dispatch({
            type: "INPUTS_OBJECT_XI",
            payload: {payopt: {...payopt, payid: getName[0]._id, name: "COD", details: getName[0].details}},
        });
      } else {
        dispatch({
            type: "INPUTS_OBJECT_XI",
            payload: {payopt: {...payopt, payid: "", names: getName}},
        });
      };
    });
  };

  return (
    <div className="container p-5 text-center">
      <h4>Complete your purchase</h4>
      {payopt.category === "Credit/Debit Card" && (
        <Elements stripe={promise}>
          <div className="col-md-8 offset-md-2">
            {payName === "Stripe" && <StripeCheckout succeeded={succeeded} setSucceeded={setSucceeded} />}
            {payName === "Paypal" && <PaypalCheckout succeeded={succeeded} setSucceeded={setSucceeded} />}
          </div>
        </Elements>
      )}
      {payopt.category === "Bank Transfer" && (
        <div className="col-md-8 offset-md-2">
          <BankTransfer succeeded={succeeded} setSucceeded={setSucceeded} />
        </div>
      )}
      {payopt.category === "Online Banking" && (
        <div className="col-md-8 offset-md-2">
          <OnlineBanking succeeded={succeeded} setSucceeded={setSucceeded} />
        </div>
      )}
      {payopt.category === "Remittance" && (
        <div className="col-md-8 offset-md-2">
          <Remittance succeeded={succeeded} setSucceeded={setSucceeded} />
        </div>
      )}
      {payopt.category === "Online Payment" && (
        <div className="col-md-8 offset-md-2">
          <OnlinePayment succeeded={succeeded} setSucceeded={setSucceeded} />
        </div>
      )}
      {payopt.category === "Cash on Delivery" && (
        <div className="col-md-8 offset-md-2">
          <CodCheckout succeeded={succeeded} setSucceeded={setSucceeded} />
        </div>
      )}
      {payopt.category === "Cryptocurrency" && (
        <div className="col-md-8 offset-md-2">
          <Cryptocurrency succeeded={succeeded} setSucceeded={setSucceeded} />
        </div>
      )}
      {!succeeded && <Button
        type="secondary"
        onClick={() => history.push("/checkout")}
        size="large"
        style={{ width: "100", marginTop: "15px" }}
      >
        <RollbackOutlined />
        Back to Checkout
      </Button>}
    </div>
  );
};

export default Payment;
