import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Card, Button, Result } from "antd";
import { Link } from "react-router-dom";
import { DollarOutlined, CheckOutlined } from "@ant-design/icons";
import NumberFormat from "react-number-format";

import InputSelect from "../common/form/InputSelect";
import RemittanceDetails from "./payDetails/RemittanceDetails";
import { getSubGrandTotal } from '../../functions/stripe';
import { createOrder } from "../../functions/order";
import { emptyUserCart } from "../../functions/user";

const Remittance = ({succeeded, setSucceeded}) => {
  let dispatch = useDispatch();
  const { user, inputs, estore } = useSelector((state) => ({
      ...state,
  }));
  const { payopt } = inputs;
  
  const [processing, setProcessing] = useState(false);
  const [orderCode, setOrderCode] = useState("");
  const [cartTotal, setCartTotal] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  
  useEffect(() => {
    getSubGrandTotal(user.token).then((res) => {
        if (res.data.err) return toast.error(res.data.err);

        setOrderCode(res.data.orderCode)
        setCartTotal(res.data.cartTotal);
        setGrandTotal(res.data.grandTotal);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
    
    const handleBankNameChange = (e) => {
        const payName = payopt.names.filter(p => p._id === e.target.value);
        dispatch({
            type: "INPUTS_OBJECT_XV",
            payload: {
                payopt: {
                    ...payopt,
                    payid: e.target.value,
                    name: payName[0].name,
                    details: payName[0].details, 
                }
            },
        });
    }
    
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (payopt.payid.length) {
        setProcessing(true);
        createOrder({ paymentOption: payopt, orderCode, sellerTxnID: null }, user.token).then((res) => {
            if (res.data.ok) {
                dispatch({
                    type: "INPUTS_OBJECT_XV",
                    payload: {cart: []},
                });
                if (typeof window !== undefined) {
                    localStorage.removeItem("cart");
                }
                emptyUserCart(user.token).then();
            }
            setProcessing(false);
            setSucceeded(true);
        });
    } else {
        toast.error("You haven't choose a Bank yet!")
    }
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
                <p className="alert alert-success">Successfully Submitted!</p>
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
        {succeeded &&
            <>
                <RemittanceDetails payid={payopt.payid ? payopt.payid : ""} /><br /><br />
            </>
        }
        {!succeeded && <>
            <InputSelect inputProperty={{
                label: "Please choose a Bank",
                value: payopt.payid ? payopt.payid : "",
                options: payopt.names && payopt.names.map(
                    (pname) =>
                    (pname = {
                        ...pname,
                        key: pname._id,
                        value: pname._id,
                        text: pname.name,
                    })
                ),
                onChange: handleBankNameChange,
                show: true,
            }} />
            <button
                className="stripe-button"
                disabled={processing || succeeded}
                onClick={handleSubmit}
            >
                <span id="button-text">
                {processing ? (
                    <div className="spinner" id="spinner"></div>
                ) : (
                    "Pay thru Remittance"
                )}
                </span>
            </button>
            <br />
        </>}
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

export default Remittance;
