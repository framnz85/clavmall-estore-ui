import React from "react";
import { Link } from "react-router-dom";
import NumberFormat from "react-number-format";

import ImageShow from "../common/ImageShow";

const OrderDetailsTable = ({ values }) => {
  const { order } = values;

  const statusColor = [
    { status: "Not Processed", color: "darkred" },
    { status: "Waiting Payment", color: "red" },
    { status: "Processing", color: "blue" },
    { status: "Delivering", color: "darkorange" },
    { status: "Cancelled", color: "" },
    { status: "Completed", color: "green" },
  ];

  return (
    <div>
      <div style={{ marginBottom: 10 }}>
        <div style={{ width: "50%", float: "left" }}>
          <b>Ordered By:</b>{" "}
          {order && order.orderedBy && order.orderedBy.name
            ? order.orderedBy.name
            : ""}
          <br />
          <b>Phone:</b> {order && order.orderedBy && order.orderedBy.phone}
          <br />
          <b>Status:</b>{" "}
          {order && order.orderStatus ? (
            <span
              style={{
                color: statusColor.find((s) => s.status === order.orderStatus)
                  .color,
              }}
            >
              {order.orderStatus}
            </span>
          ) : (
            ""
          )}
          <br />
          <b>Payment:</b>{" "}
          {order.paymentOption &&
            order.paymentOption.category + " - " + order.paymentOption.name}
        </div>
        <div style={{ width: "50%", float: "right" }}>
          <b>Delivery Address:</b>{" "}
          {order && order.orderedBy && order.orderedBy.address
            ? `${order.orderedBy.address.details}, ${order.orderedBy.address.addiv3.name}, ${order.orderedBy.address.addiv2.name}, ${order.orderedBy.address.addiv1.name}, ${order.orderedBy.address.country.name}`
            : ""}
          <br />
          <b>Additional Instructions:</b>{" "}
          {order && order.orderedBy && order.orderedBy.addInstruct}
        </div>
        <div style={{ clear: "both" }}></div>
      </div>
      <table className="table table-bordered">
        <thead className="thead-light">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Image</th>
            <th scope="col">Product</th>
            <th scope="col">Price</th>
            <th scope="col">Quantity</th>
            <th scope="col">Total</th>
          </tr>
        </thead>
        <tbody>
          {order.products &&
            order.products.map((p, i) => {
              const variant = p.product.variants.filter(
                (v) => v._id === p.variant
              )[0];
              return (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>
                    <Link
                      to={`/product/${p.product.slug}`}
                      style={{ color: "#000" }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ImageShow
                        alt={p.product.title}
                        imgid={
                          p.product.images && p.product.images.length > 0
                            ? p.product.images[0].url
                            : ""
                        }
                        style={{
                          width: "50px",
                          height: "50px",
                        }}
                        type="/thumb"
                      />
                    </Link>
                  </td>
                  <td>
                    <Link
                      to={`/product/${p.product.slug}`}
                      style={{ color: "#000" }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {p.product && p.product.title ? p.product.title : ""} (
                      {variant && variant.name ? variant.name : ""})
                    </Link>
                  </td>
                  <td>
                    <NumberFormat
                      value={p.price.toFixed(2)}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={"₱"}
                    />
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {p.count ? p.count : ""}
                  </td>
                  <td>
                    <NumberFormat
                      value={(p.price * p.count).toFixed(2)}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={"₱"}
                    />
                  </td>
                </tr>
              );
            })}
          <tr>
            <td colSpan={3}></td>
            <td>Sub Total</td>
            <td>
              <NumberFormat
                value={order.cartTotal && order.cartTotal.toFixed(2)}
                displayType={"text"}
                thousandSeparator={true}
                prefix={"₱"}
              />
            </td>
          </tr>
          <tr>
            <td colSpan={3}></td>
            <td>Delivery Fee</td>
            <td>
              <NumberFormat
                value={order.delfee && order.delfee.toFixed(2)}
                displayType={"text"}
                thousandSeparator={true}
                prefix={"₱"}
              />
            </td>
          </tr>
          <tr>
            <td colSpan={3}></td>
            <td>Service Fee</td>
            <td>
              <NumberFormat
                value={order.servefee && order.servefee.toFixed(2)}
                displayType={"text"}
                thousandSeparator={true}
                prefix={"₱"}
              />
            </td>
          </tr>
          <tr>
            <td colSpan={3}></td>
            <td>Discount</td>
            <td>
              -{" "}
              <NumberFormat
                value={order.discount && order.discount.toFixed(2)}
                displayType={"text"}
                thousandSeparator={true}
                prefix={"₱"}
              />
            </td>
          </tr>
          <tr>
            <td colSpan={3}></td>
            <td>
              <b>Grand Total</b>
            </td>
            <td>
              <b>
                <NumberFormat
                  value={order.grandTotal && order.grandTotal.toFixed(2)}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"₱"}
                />
              </b>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default OrderDetailsTable;
