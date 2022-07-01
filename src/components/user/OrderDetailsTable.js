import React from "react";
import NumberFormat from "react-number-format";

const OrderDetailsTable = ({ values }) => {
    const { order } = values;
    
    return (
        <div>
            <span>
                <b>Status:</b> {order.orderStatus}{" "}
                <b>Payment:</b> {order.paymentOption && (order.paymentOption.category + " - " + order.paymentOption.name)}
            </span>
            <table className="table table-bordered">
                <thead className="thead-light">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Product</th>
                        <th scope="col">Price</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {order.products &&
                        order.products.map((p, i) => {
                            return (
                                <tr key={i}>
                                    <td>{i + 1}</td>
                                    <td>{p.product.title} ({p.product.variants.filter(v => v._id === p.variant)[0].name})</td>
                                    <td>
                                        <NumberFormat
                                            value={p.price.toFixed(2)}
                                            displayType={"text"}
                                            thousandSeparator={true}
                                            prefix={"₱"}
                                        />
                                    </td>
                                    <td>{p.count}</td>
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
                </tbody>
                <tfoot style={{ borderTop: "1px" }}>
                    <tr>
                        <td colSpan={3}></td>
                        <td>Sub Total</td>
                        <td>
                            <NumberFormat
                                value={
                                    order.cartTotal && order.cartTotal.toFixed(2)
                                }
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
                                value={
                                    order.servefee && order.servefee.toFixed(2)
                                }
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
                                value={
                                    order.discount && order.discount.toFixed(2)
                                }
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
                                    value={
                                        order.grandTotal &&
                                        order.grandTotal.toFixed(2)
                                    }
                                    displayType={"text"}
                                    thousandSeparator={true}
                                    prefix={"₱"}
                                />
                            </b>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
}

export default OrderDetailsTable;