import React, { useState } from 'react'
import { useSelector } from "react-redux";
import { MinusOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import NumberFormat from "react-number-format";

import TableBody from '../../common/table/TableBody';

const BillingHistory = () => {
    const phpConvert = 60;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [billId, setBillId] = useState(false);
    const [payment, setPayment] = useState(false);
    const [totalPrice, setTotalPrice] = useState("");

    const { estore } = useSelector((state) => ({
        ...state,
    }));

    const showModal = (id, value, price) => {
        setIsModalVisible(true);
        setBillId(id);
        setPayment(value);
        setTotalPrice(price);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const columns = [
        {
            key: "cycleType",
            path: "cycleType",
            content: (hist) => hist.cycleType,
        },
        {
            key: "dash1",
            path: "dash1",
            content: () => <div style={{ padding: "7px 15px" }}><MinusOutlined /></div>,
        },
        {
            key: "totalPrice",
            path: "totalPrice",
            content: (hist) => <>
                ${parseInt(hist.totalPrice).toFixed(2)} (<NumberFormat
                    value={Number(hist.totalPrice * phpConvert).toFixed(2)}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix="₱"
                />)
            </>,
        },
        {
            key: "dash2",
            path: "dash2",
            content: () => <div style={{ padding: "7px 15px" }}><MinusOutlined /></div>,
        },
        {
            key: "payment",
            path: "payment",
            content: (hist) => {
                switch (hist.payment) {
                    case "pal":
                        return "Creid card, Debit Card, or Paypal";
                    case "bdo":
                        return "BDO";
                    case "bpi":
                        return "BPI";
                    case "uni":
                        return "Unionbank";
                    default:
                        return;
                }
            },
        },
        {
            key: "dash3",
            path: "dash3",
            content: () => <div style={{ padding: "7px 15px" }}><MinusOutlined /></div>,
        },
        {
            key: "payStatus",
            path: "payStatus",
            content: (hist) => <span style={hist.payStatus === "not paid" ? { color: "red" } : {}}>{hist.payStatus}</span>,
        },
        {
            key: "dash4",
            path: "dash4",
            content: () => <div style={{ padding: "7px 15px" }}><MinusOutlined /></div>,
        },
        {
            key: "action",
            path: "action",
            content: (hist) => hist.payStatus !== "paid" && <button type="button" className="btn-danger" onClick={() => showModal(hist._id, hist.payment, hist.totalPrice)}>Pay</button>,
        },
    ];

    return (
        <div>
            {estore.billingHistory && estore.billingHistory.length > 0
                ? <table className="table">
                    <TableBody data={estore.billingHistory} columns={columns} />
                </table>
                : "No activity yet"}

            <Modal title="Basic Modal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                {payment === "bdo" &&
                    <div>
                        <div align="center" className="alert alert-success" role="alert">
                        <b>Here's how to Pay:</b><br/>
                        Send your payments by going to the nearest BDO branch or by transferring thru your BDO Online Banking and by using the details below: <br /><br/>
                        <div align="center">
                            <b>Account Number:</b> 006760032739<br/>
                            <b>Account Name:</b> Francis John Clavano<br/>
                            <b>Amount:</b> {
                                    <NumberFormat
                                        value={Number(totalPrice * phpConvert).toFixed(2)}
                                        displayType={"text"}
                                        thousandSeparator={true}
                                        prefix="₱"
                                    />
                                }
                        </div>
                        <br /><br/>
                            After sending the payment, send the screenshot of your Payment Receipt together with the Reference Id: <b>{billId}</b> to davgros.85@gmail.com or chat it on my <a href="https://www.facebook.com/francisjohn.clavano" target="_blank" rel="noreferrer">FB Account "Francis Clavano"</a>.
                        </div><br />
                    </div>
                }
                {payment === "bpi" &&
                    <div>
                        <div align="center" className="alert alert-success" role="alert">
                        <b>Here's how to Pay:</b><br/>
                        Send your payments by going to the nearest BPI branch or by transferring thru your BPI Online Banking and by using the details below: <br /><br/>
                        <div align="center">
                            <b>Account Number:</b> 2149704874<br/>
                            <b>Account Name:</b> Francis John Clavano<br/>
                            <b>Amount:</b> {
                                    <NumberFormat
                                        value={Number(totalPrice * phpConvert).toFixed(2)}
                                        displayType={"text"}
                                        thousandSeparator={true}
                                        prefix="₱"
                                    />
                                }
                        </div>
                        <br /><br/>
                            After sending the payment, send the screenshot of your Payment Receipt together with the Reference Id: <b>{billId}</b> to davgros.85@gmail.com or chat it on my <a href="https://www.facebook.com/francisjohn.clavano" target="_blank" rel="noreferrer">FB Account "Francis Clavano"</a>.
                        </div><br />
                    </div>
                }
                {payment === "uni" &&
                    <div>
                        <div align="center" className="alert alert-success" role="alert">
                        <b>Here's how to Pay:</b><br/>
                        Send your payments by going to the nearest Unionbank branch or by transferring thru your Unionbank Online Banking and by using the details below: <br /><br/>
                        <div align="center">
                            <b>Account Number:</b> 109430284113<br/>
                            <b>Account Name:</b> Francis John Clavano<br/>
                            <b>Amount:</b> {
                                    <NumberFormat
                                        value={Number(totalPrice * phpConvert).toFixed(2)}
                                        displayType={"text"}
                                        thousandSeparator={true}
                                        prefix="₱"
                                    />
                                }
                        </div>
                        <br /><br/>
                            After sending the payment, send the screenshot of your Payment Receipt together with the Reference Id: <b>{billId}</b> to davgros.85@gmail.com or chat it on my <a href="https://www.facebook.com/francisjohn.clavano" target="_blank" rel="noreferrer">FB Account "Francis Clavano"</a>.
                        </div><br />
                    </div>
                }
            </Modal>
            <br /><br /><br /><br />
        </div>
    );
}
 
export default BillingHistory;