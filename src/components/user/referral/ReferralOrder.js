import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { LoadingOutlined } from '@ant-design/icons';
import { toast } from "react-toastify";
import NumberFormat from "react-number-format";

import TableHeader from '../../common/table/TableHeader';
import TableBody from "../../common/table/TableBody";

import { getReferralOrders } from "../../../functions/referral";

const initialState = {
  orders: [],
  itemsCount: 0,
  pageSize: 10,
  currentPage: 1,
  sortkey: "createdAt",
  sort: -1,
}

const ReferralOrder = () => {
    const [values, setValues] = useState(initialState);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadReferralOrders();
    }, [values.currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

    const { user } = useSelector((state) => ({
        ...state,
    }));

    const loadReferralOrders = () => {
        const { sortkey, sort, currentPage, pageSize } = values;
        setLoading(true);
        getReferralOrders(sortkey, sort, currentPage, pageSize, user.token).then(res => {
            if (res.data.err) {
                toast.error(res.data.err);
                setLoading(false);
            } else {
                setValues({
                    ...values,
                    orders: res.data.orders,
                });
                setLoading(false);
            }
        })
    }

    const columns = [
        {
            key: "date",
            path: "date",
            label: "Date Created",
            content: (order) => new Date(order.createdAt).toLocaleString(),
        },
        {
            key: "orderCode",
            path: "orderCode",
            label: "Order Code",
            content: (order) => order.orderCode,
        },
        {
            key: "name",
            path: "name",
            label: "Name",
            content: (order) => order.orderedBy.name,
        },
        {
            key: "grandTotal",
            path: "grandTotal",
            label: "Total",
            content: (order) => 
            <NumberFormat
                value={parseFloat(order.grandTotal).toFixed(2)}
                displayType={"text"}
                thousandSeparator={true}
                prefix={"₱"}
            />,
        },
        {
            key: "orderStatus",
            path: "orderStatus",
            label: "Status",
            content: (order) => order.orderStatus,
        },
    ];

    return ( 
        <>
            <table className="table">
                <TableHeader columns={columns}/>
                <TableBody data={values.orders} columns={columns} />
            </table>
            {loading && <div align="center"><LoadingOutlined /></div>}
        </>
     );
}
 
export default ReferralOrder;