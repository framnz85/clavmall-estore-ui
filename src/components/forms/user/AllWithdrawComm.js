import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { LoadingOutlined } from '@ant-design/icons';
import { toast } from "react-toastify";
import NumberFormat from "react-number-format";

import TableHeader from '../../common/table/TableHeader';
import TableBody from '../../common/table/TableBody';
import AntCheckbox from "../../common/form/AntCheckbox";

import { getAllWithdrawal, editCommissionStatus } from "../../../functions/referral";

const initialState = {
  withdraws: [],
  itemsCount: 0,
  pageSize: 10,
  currentPage: 1,
  sortkey: "createdAt",
  sort: -1,
}

const AllWithdrawComm = () => {
    const [values, setValues] = useState(initialState);
    const [loading, setLoading] = useState(false);

    const { user } = useSelector((state) => ({
        ...state,
    }));

    useEffect(() => {
        loadAllWithdrawals();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const loadAllWithdrawals = () => {
        const { sortkey, sort, currentPage, pageSize } = values;
        setLoading(true);
        getAllWithdrawal(sortkey, sort, currentPage, pageSize, user.token).then(res => {
            setValues({
                ...values,
                withdraws: res.data.withdraws
            });
            setLoading(false);
        })
    }
    
    const handleCommStatus = (value, commid) => {
        const status = value ? "Approved" : "Pending";
        const newCommissions = values.withdraws.map(comm => 
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
                    withdraws: newCommissions
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
            key: "bank",
            path: "bank",
            label: "Bank",
            content: (com) => com.bank,
        },
        {
            key: "accountNumber",
            path: "accountNumber",
            label: "Account Number",
            content: (com) => com.accountNumber,
        },
        {
            key: "accountName",
            path: "accountName",
            label: "Account Name",
            content: (com) => com.accountName,
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

    const { withdraws } = values;

    return ( 
        <>
            <table className="table">
                <TableHeader columns={columns}/>
                <TableBody data={withdraws} columns={columns} />
            </table>
            {loading && <div align="center"><LoadingOutlined /></div>}
        </>
     );
}
 
export default AllWithdrawComm;