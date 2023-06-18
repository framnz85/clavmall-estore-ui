import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "antd";
import NumberFormat from "react-number-format";

const SummaryCompute = ({cartCalculation}) => {
  const { user, estore } = useSelector((state) => ({ ...state }));
    let {
        minorder=0,
        maxorder=0,
        deltime=0,
        deltimetype="",
    } = user.address && user.address.addiv3 ? user.address.addiv3 : {};

    let { subtotal, delfee, discount, servefee, grandTotal } = cartCalculation;
    
    return ( 
        <table>
            <tbody>
                <tr>
                <td className="col">Sub Total:</td>
                <td align="right" className="col">
                    <b><NumberFormat
                        value={Number(subtotal).toFixed(2)}
                        displayType={"text"}
                        thousandSeparator={true}
                        prefix={estore.country.currency}
                    /></b>
                </td>
                </tr>
                {delfee > 0 && (
                <tr>
                    <td className="col">Delivery Fee:</td>
                    <td align="right" className="col">
                        <b><NumberFormat
                            value={Number(delfee).toFixed(2)}
                            displayType={"text"}
                            thousandSeparator={true}
                            prefix={estore.country.currency}
                        /></b>
                    </td>
                </tr>
                )}
                {servefee > 0 && (
                <tr>
                    <td className="col">Service Fee:</td>
                    <td align="right" className="col">
                        <b><NumberFormat
                            value={Number(servefee).toFixed(2)}
                            displayType={"text"}
                            thousandSeparator={true}
                            prefix={estore.country.currency}
                        /></b>
                    </td>
                </tr>
                )}
                {discount > 0 && (
                <tr>
                    <td className="col">Discount:</td>
                    <td align="right" className="col">
                        <b>- <NumberFormat
                            value={Number(discount).toFixed(2)}
                            displayType={"text"}
                            thousandSeparator={true}
                            prefix={estore.country.currency}
                        /></b>
                    </td>
                </tr>
                )}

                <tr>
                <td className="col" style={{ paddingTop: "20px" }}>
                    <h5>Grand Total:</h5>
                </td>
                <td
                    align="right"
                    className="col"
                    style={{ paddingTop: "20px" }}
                >
                    <h5>
                        <b><NumberFormat
                            value={Number(grandTotal).toFixed(2)}
                            displayType={"text"}
                            thousandSeparator={true}
                            prefix={estore.country.currency}
                        /></b>
                    </h5>
                </td>
                </tr>
                {deltime > 0 && (
                <tr>
                    <td align="center" colSpan={2} className="text-success">
                            <br />
                    {`(Delivers in ${deltime} ${deltimetype} )`}
                    </td>
                </tr>
                )}
                {subtotal >= Number(minorder) && subtotal < Number(maxorder) && (
                <tr>
                    <td align="center" colSpan={2} className="alert text-danger">
                        * Free Delivery of at least{" "}
                        <NumberFormat
                            value={Number(maxorder).toFixed(2)}
                            displayType={"text"}
                            thousandSeparator={true}
                            prefix={estore.country.currency}
                        />{" "}
                    <b>Sub Total</b>
                    <br /><br />
                    <Link to="/shop">
                        <Button type="danger" shape="round" size="large">
                            Shop More
                        </Button>
                    </Link>
                    </td>
                </tr>
                )}
                {subtotal < Number(minorder) && (
                <tr>
                    <td colSpan={2} className="alert text-danger">
                    * <b>Sub Total</b> should be at least{" "}
                        <NumberFormat
                            value={Number(minorder).toFixed(2)}
                            displayType={"text"}
                            thousandSeparator={true}
                            prefix={estore.country.currency}
                        />{" "}to continue
                    <Link to="/shop">
                        {" "}
                        <Button
                        type="danger"
                        size="large"
                        style={{ width: "100%" }}
                        >
                        Shop More
                        </Button>
                    </Link>
                    </td>
                </tr>
                )}
            </tbody>
            </table>
     );
}
 
export default SummaryCompute;