import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { LoadingOutlined } from '@ant-design/icons';
import { toast } from "react-toastify";
import NumberFormat from "react-number-format";

import TableHeader from '../../common/table/TableHeader';
import TableBody from '../../common/table/TableBody';
import AntCheckbox from "../../common/form/AntCheckbox";

import { getAllCommissions, editCommissionStatus } from "../../../functions/referral";

const initialState = {
  commissions: [],
  itemsCount: 0,
  pageSize: 10,
  currentPage: 1,
  sortkey: "createdAt",
  sort: -1,
}

const AllReferralComm = () => {
    const [values, setValues] = useState(initialState);
    const [loading, setLoading] = useState(false);

    const { user } = useSelector((state) => ({
        ...state,
    }));

    useEffect(() => {
        loadAllCommissions();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const loadAllCommissions = () => {
        const { sortkey, sort, currentPage, pageSize } = values;
        setLoading(true);
        getAllCommissions(sortkey, sort, currentPage, pageSize, user.token).then(res => {
            setValues({
                ...values,
                commissions: res.data.commissions
            });
            setLoading(false);
        })
    }
    
    const handleCommStatus = (value, commid) => {
        const status = value ? "Approved" : "Pending";
        const newCommissions = values.commissions.map(comm => 
            comm._id === commid 
                ? { ...comm, status }
                : comm
        )
        editCommissionStatus(commid, status, user.token).then(res => {
            if (res.data.err) {
                toast.error(res.data.err)
            } else {
                setValues({
                    ...values,
                    commissions: newCommissions
                });
            }
        })
    }

    const columns = [
        {
            key: "createdAt",
            path: "createdAt",
            label: "Date Created",
            content: (com) => new Date(com.createdAt).toLocaleString(),
        },
        {
            key: "ownername",
            path: "ownername",
            label: "Name",
            content: (com) => com.ownername,
        },
        {
            key: "username",
            path: "username",
            label: "Ordered By",
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
            label: "Approved",
            content: (com) =>
                <AntCheckbox inputProperty={{
                    label: "",
                    value: com.status === "Approved",
                    onChange: (e) => handleCommStatus(e.target.checked, com._id)
                }}
                />,
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
 
export default AllReferralComm;