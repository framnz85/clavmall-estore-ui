import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import NumberFormat from "react-number-format";
import _ from "lodash";

import ImageShow from "../../common/ImageShow";

import { getCategories } from "../../../functions/category";

const OrderDetailsTable = ({ values, grouping, pricing }) => {
  let dispatch = useDispatch();
  let totalSupPrice = 0;
  const { order } = values;

  const [propertyNames, setPropertyNames] = useState([]);
  const [productGrouped, setProductGrouped] = useState([]);

  const { user, categories } = useSelector((state) => ({
    ...state,
  }));

  useEffect(() => {
    const productGrouped = _.groupBy(
      order.products,
      (order) => order.product && order.product.category
    );
    setProductGrouped(productGrouped);
    const propertyNames = Object.keys(productGrouped);
    setPropertyNames(propertyNames);
  }, [order]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    loadCategories();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadCategories = () => {
    if (typeof window !== undefined) {
      if (
        !localStorage.getItem("categories") ||
        !localStorage.getItem("products") ||
        !JSON.parse(localStorage.getItem("products")).length
      ) {
        getCategories(user.address ? user.address : {}).then((category) => {
          dispatch({
            type: "CATEGORY_LIST_I",
            payload: category.data.categories,
          });
          dispatch({
            type: "PRODUCT_LIST_VII",
            payload: category.data.products,
          });
        });
      }
    }
  };

  const getCategoryName = (catid) => {
    const catName = categories.filter((cat) => cat._id === catid);
    return catName[0] && catName[0].name;
  };

  const showDeliveryAddress = (address) => {
    const details = address.details ? address.details : "";
    const addiv3 =
      address.addiv3 && address.addiv3.name ? address.addiv3.name : "";
    const addiv2 =
      address.addiv2 && address.addiv2.name ? address.addiv2.name : "";
    const addiv1 =
      address.addiv1 && address.addiv1.name ? address.addiv1.name : "";
    const country =
      address.country && address.country.name ? address.country.name : "";
    return `${details}, ${addiv3}, ${addiv2}, ${addiv1}, ${country}`;
  };

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
        <div align="center" id="printable">
          <div style={{ fontSize: 20 }}>
            <strong>
              {pricing === "def" ? "Customer Receipt" : "Supplier Price"}
            </strong>{" "}
            {`OC# ${order.orderCode}`}
          </div>
          <br />
        </div>
        <div style={{ width: "50%", float: "left" }}>
          <b>Ordered By:</b>{" "}
          {order && order.orderedBy && order.orderedBy.name
            ? order.orderedBy.name
            : ""}
          <br />
          <b>Phone:</b>{" "}
          {order && order.orderedBy && order.orderedBy.phone
            ? order.orderedBy.phone
            : ""}
          <br />
          <span id="non-printable">
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
          </span>
          <b>Payment:</b>{" "}
          {order.paymentOption &&
            (order.paymentOption.category ? order.paymentOption.category : "") +
              " - " +
              (order.paymentOption.name ? order.paymentOption.name : "")}
        </div>
        <div style={{ width: "50%", float: "right" }}>
          <b>Delivery Address:</b>{" "}
          {order && order.delAddress
            ? showDeliveryAddress(order.delAddress)
            : order && order.orderedBy && order.orderedBy.address
            ? showDeliveryAddress(order.orderedBy.address)
            : ""}
          <br />
          <b>Additional Instructions:</b>{" "}
          {order && order.orderedBy && order.orderedBy.addInstruct
            ? order.orderedBy.addInstruct
            : ""}
        </div>
        <div style={{ clear: "both" }}></div>
      </div>
      <table className="table table-bordered">
        <thead className="thead-light">
          <tr>
            <th scope="col">#</th>
            <th scope="col" id="non-printable">
              Image
            </th>
            <th scope="col">Product</th>
            <th scope="col">Price</th>
            <th scope="col">Quantity</th>
            <th scope="col">Total</th>
            <th scope="col" id="printable">
              Remarks
            </th>
          </tr>
        </thead>
        <tbody>
          {grouping === "def" &&
            order.products &&
            order.products.map((p, i) => {
              const variant =
                p.product &&
                p.product.variants &&
                p.product.variants.filter((v) => v._id === p.variant)[0];
              const supplierPrice =
                p.product && p.product.supplierPrice
                  ? p.product.supplierPrice
                  : 0;
              const count = p.count ? p.count : 0;
              const price = p.price ? p.price : 0;
              totalSupPrice = totalSupPrice + parseFloat(supplierPrice * count);
              return (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td id="non-printable">
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
                      value={
                        pricing === "sup"
                          ? supplierPrice
                            ? supplierPrice.toFixed(2)
                            : ""
                          : p.price && p.price.toFixed(2)
                      }
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
                      value={
                        pricing === "sup"
                          ? (supplierPrice * count).toFixed(2)
                          : (price * count).toFixed(2)
                      }
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={"₱"}
                    />
                  </td>
                  <td id="printable" style={{ color: "#fff" }}>
                    -
                  </td>
                </tr>
              );
            })}
          {grouping === "cat" &&
            propertyNames.length > 0 &&
            propertyNames.map((property, j) => (
              <>
                <tr>
                  <td
                    colSpan="5"
                    style={{ margin: 0, padding: "10px 0 0 10px" }}
                  >
                    <b>{getCategoryName(property)}</b>
                  </td>
                </tr>
                {productGrouped[property] &&
                  productGrouped[property].map((p, i) => {
                    const variant =
                      p.product &&
                      p.product.variants &&
                      p.product.variants.filter((v) => v._id === p.variant)[0];
                    const supplierPrice =
                      p.product && p.product.supplierPrice
                        ? p.product.supplierPrice
                        : 0;
                    const count = p.count ? p.count : 0;
                    const price = p.price ? p.price : 0;
                    totalSupPrice =
                      totalSupPrice + parseFloat(supplierPrice * count);
                    return (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td id="non-printable">
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
                            {p.product && p.product.title
                              ? p.product.title
                              : ""}{" "}
                            ({variant && variant.name ? variant.name : ""})
                          </Link>
                        </td>
                        <td>
                          <NumberFormat
                            value={
                              pricing === "sup"
                                ? supplierPrice
                                  ? supplierPrice.toFixed(2)
                                  : 0
                                : p.price && p.price.toFixed(2)
                            }
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
                            value={
                              pricing === "sup"
                                ? (supplierPrice * count).toFixed(2)
                                : (price * count).toFixed(2)
                            }
                            displayType={"text"}
                            thousandSeparator={true}
                            prefix={"₱"}
                          />
                        </td>
                        <td id="printable" style={{ color: "#fff" }}>
                          -
                        </td>
                      </tr>
                    );
                  })}
              </>
            ))}
          <tr>
            <td colSpan={3}></td>
            <td>Sub Total</td>
            <td>
              <NumberFormat
                value={
                  pricing === "sup"
                    ? totalSupPrice.toFixed(2)
                    : order.cartTotal && order.cartTotal.toFixed(2)
                }
                displayType={"text"}
                thousandSeparator={true}
                prefix={"₱"}
              />
            </td>
          </tr>
          {pricing === "def" && (
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
          )}
          {pricing === "def" && (
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
          )}
          {pricing === "def" && (
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
          )}
          {pricing === "def" && (
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
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrderDetailsTable;
