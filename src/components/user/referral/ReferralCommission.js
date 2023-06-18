import React from "react";
import { LoadingOutlined } from '@ant-design/icons';
import NumberFormat from "react-number-format";

import TableHeader from '../../common/table/TableHeader';
import TableBody from '../../common/table/TableBody';

const ReferralCommission = ({values, loading}) => {
    const columns = [
        {
            key: "createdAt",
            path: "createdAt",
            label: "Date Created",
            content: (com) => new Date(com.createdAt).toLocaleString(),
        },
        {
            key: "user",
            path: "user",
            label: "User",
            content: (com) => com.username,
        },
        {
            key: "orderCode",
            path: "orderCode",
            label: "Order Code",
            content: (com) => com.orderCode,
        },
        {
            key: "amount",
            path: "amount",
            label: "Order Amount",
            content: (com) => 
                <NumberFormat
                    value={parseFloat(com.amount).toFixed(2)}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"₱"}
                />,
        },
        {
            key: "commission",
            path: "commission",
            label: "Commission",
            content: (com) => 
                <NumberFormat
                    value={parseFloat(com.commission).toFixed(2)}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"₱"}
                />,
        },
        {
            key: "status",
            path: "status",
            label: "Status",
            content: (com) => <span style={{color: com.status === "Approved" ? "green" : "red"}}>{com.status}</span>,
        },
    ];

    const { commissions } = values;

    return ( 
        <>
            <table className="table">
                <TableHeader columns={columns}/>
                <TableBody data={commissions} columns={columns} />
            </table>
            {loading && <div align="center"><LoadingOutlined /></div>}
        </>
     );
}
 
export default ReferralCommission;