import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "antd";
import {
  CreditCardOutlined,
  CodeSandboxOutlined,
  BankOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import ProductTable from "./ProductTable";

const OrderSummary = ({ history, products, cartCalculation, addressSaved }) => {
  let dispatch = useDispatch();

  let {
    subtotal = 0,
    delfee = 0,
    discount = 0,
    servefee = 0,
    grandTotal = 0,
  } = cartCalculation;

  const { user } = useSelector((state) => ({
    ...state,
  }));

  const {
    minorder,
    maxorder,
    delfee: myDelfee,
    delfeetype,
    discount: myDiscount,
    discounttype,
    servefee: myServefee,
    servefeetype,
    deltime,
    deltimetype,
  } = user.address ? user.address.addiv3 : {};

  let finalTotal = subtotal;

  if (discount === 0 && subtotal > 0) {
    discount = Number(
      discounttype === "%" ? (subtotal * myDiscount) / 100 : myDiscount
    );
  }

  if (delfee === 0 && subtotal > 0) {
    delfee =
      subtotal < maxorder
        ? Number(delfeetype === "%" ? (subtotal * myDelfee) / 100 : myDelfee)
        : 0;
  }

  if (servefee === 0 && subtotal > 0) {
    servefee = Number(
      servefeetype === "%" ? (subtotal * myServefee) / 100 : myServefee
    );
  }

  if (discount > 0) {
    finalTotal = finalTotal - discount;
  }

  if (delfee > 0) {
    finalTotal = finalTotal + delfee;
  }

  if (servefee > 0) {
    finalTotal = finalTotal + servefee;
  }

  if (Math.round(finalTotal) !== Math.round(grandTotal)) {
    if (finalTotal !== 0 && grandTotal !== 0) {
      finalTotal = grandTotal;
    }
  }

  const handlePaymentOption = (payopt) => {
    dispatch({
      type: "SET_PAYMENT_OPTION",
      payload: payopt,
    });
    history.push("/payment");
  };

  return (
    <div className="col-md-4 p-3 bg-white">
      <h4>Order Summary</h4>
      <hr />

      <ProductTable products={products} />

      <hr />
      <table>
        <tbody>
          <tr>
            <td className="col">Sub Total:</td>
            <td align="right" className="col">
              <b>₱{Number(subtotal).toFixed(2)}</b>
            </td>
          </tr>
          {delfee > 0 && (
            <tr>
              <td className="col">Delivery Fee:</td>
              <td align="right" className="col">
                <b>₱{Number(delfee).toFixed(2)}</b>
              </td>
            </tr>
          )}
          {servefee > 0 && (
            <>
              <tr>
                <td className="col">Service Fee:</td>
                <td align="right" className="col">
                  <b>₱{Number(servefee).toFixed(2)}</b>
                </td>
              </tr>
            </>
          )}
          {discount > 0 && (
            <tr>
              <td className="col">
                Discount:{" "}
                <Link className="text-success" to="/cart">
                  (Reset)
                </Link>
              </td>
              <td align="right" className="col">
                <b>- ₱{Number(discount).toFixed(2)}</b>
              </td>
            </tr>
          )}

          <tr>
            <td className="col" style={{ paddingTop: "20px" }}>
              <h5>Grand Total:</h5>
            </td>
            <td align="right" className="col" style={{ paddingTop: "20px" }}>
              <h5>
                <b>₱{Number(finalTotal).toFixed(2)}</b>
              </h5>
            </td>
          </tr>
          {deltime > 0 && (
            <tr>
              <td align="center" colSpan={2} className="text-success">
                {`(Delivers in ${deltime} ${deltimetype} )`}
              </td>
            </tr>
          )}
          {subtotal < Number(minorder) && (
            <tr>
              <td colSpan={2} className="alert text-danger">
                * <b>Sub Total</b> should be at least ₱
                {Number(minorder).toFixed(2)} to continue
                <Link to="/shop">
                  {" "}
                  <Button type="danger" size="large" style={{ width: "100%" }}>
                    Shop More
                  </Button>
                </Link>
              </td>
            </tr>
          )}
          {subtotal >= Number(minorder) && subtotal < Number(maxorder) && (
            <tr>
              <td align="center" colSpan={2} className="alert text-danger">
                * Free Delivery of at least ₱{Number(maxorder).toFixed(2)}{" "}
                <b>Sub Total</b>
                <Link to="/shop">
                  {" "}
                  <Button type="danger" shape="round" size="large">
                    Shop More
                  </Button>
                </Link>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <br />
      <hr />

      <div className="container">
        <div className="row mt-4">
          {!addressSaved && (
            <div align="center" className="text-danger">
              * Click <b>Save Address</b> to proceed
            </div>
          )}
          <Button
            type="primary"
            size="large"
            style={{ width: "100%" }}
            disabled={
              !addressSaved ||
              !products.length ||
              cartCalculation.subtotal < Number(minorder)
            }
            onClick={() => handlePaymentOption("Credit/Debit Card")}
          >
            <CreditCardOutlined />
            Pay Credit/Debit Card
          </Button>
          <Button
            type="primary"
            size="large"
            style={{ width: "100%", marginTop: "15px" }}
            disabled={
              !addressSaved ||
              !products.length ||
              cartCalculation.subtotal < Number(minorder)
            }
            onClick={() => handlePaymentOption("Cash on Delivery")}
          >
            <CodeSandboxOutlined />
            Pay Cash on Delivery
          </Button>
          <Button
            type="primary"
            size="large"
            style={{ width: "100%", marginTop: "15px" }}
            disabled={
              !addressSaved ||
              !products.length ||
              cartCalculation.subtotal < Number(minorder)
            }
            onClick={() => handlePaymentOption("Bank Transfer")}
          >
            <BankOutlined />
            Pay Bank Transfer
          </Button>
          <Button
            type="secondary"
            onClick={() => history.push("/cart")}
            size="large"
            style={{ width: "100%", marginTop: "15px" }}
          >
            <RollbackOutlined />
            Back to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
