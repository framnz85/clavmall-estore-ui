import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { LoadingOutlined } from '@ant-design/icons';
import { toast } from "react-toastify";

import TableHeader from '../../common/table/TableHeader';
import TableBody from "../../common/table/TableBody";

import { getReferrals } from "../../../functions/referral";

const initialState = {
  referrals: [],
  itemsCount: 0,
  pageSize: 10,
  currentPage: 1,
  sortkey: "createdAt",
  sort: -1,
}

const UsersReferred = () => {
    
    const [values, setValues] = useState(initialState);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadReferrals();
    }, [values.currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

    const { user } = useSelector((state) => ({
        ...state,
    }));

    const loadReferrals = () => {
        const { sortkey, sort, currentPage, pageSize } = values;
        setLoading(true);
        getReferrals(sortkey, sort, currentPage, pageSize, user.token).then(res => {
            if (res.data.err) {
                toast.error(res.data.err);
                setLoading(false);
            } else {
                setValues({
                    ...values,
                    referrals: res.data.referrals,
                });
                setLoading(false);
            }
        })
    }

    const columns = [
        {
            key: "dateJoined",
            path: "dateJoined",
            label: "Date Joined",
            content: (ref) => new Date(ref.createdAt).toLocaleString(),
        },
        {
            key: "name",
            path: "name",
            label: "Name",
            content: (ref) => ref.name,
        },
        {
            key: "email",
            path: "email",
            label: "Email",
            content: (ref) => ref.email,
        },
        {
            key: "phone",
            path: "phone",
            label: "Phone",
            content: (ref) => ref.phone,
        },
    ];

    return ( 
        <>
            <table className="table">
                <TableHeader columns={columns}/>
                <TableBody data={values.referrals} columns={columns} />
            </table>
            {loading && <div align="center"><LoadingOutlined /></div>}
        </>
     );
}
 
export default UsersReferred;