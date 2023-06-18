import React, { useEffect, useState } from "react";
import { Pagination } from "antd";
import { LoadingOutlined } from '@ant-design/icons';

import TableHeader from '../../common/table/TableHeader';
import TableBody from "../../common/table/TableBody";

import { getProspects } from "../../../functions/affiliate";

const initialState = {
  prospects: [],
  itemsCount: 0,
  pageSize: 10,
  currentPage: 1,
  sortkey: "createdAt",
  sort: -1
}

const ProspectTable = ({loading, setLoading}) => {
    const [values, setValues] = useState(initialState);

    useEffect(() => {
        loadProspects();
    }, [values.currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

    const loadProspects = () => {
        const { sortkey, sort, currentPage, pageSize } = values;
        setLoading(true);
        getProspects(sortkey, sort, currentPage, pageSize).then(res => {
            setValues({
                ...values,
                prospects: res.data.prospects,
                itemsCount: res.data.count,
            });
            setLoading(false);
        })
    }
    
    const columns = [
        {
            key: "createdAt",
            path: "createdAt",
            label: "Date Subscribed",
            content: (pro) => new Date(pro.createdAt).toLocaleString(),
        },
        {
            key: "name",
            path: "name",
            label: "Name",
            content: (pro) => pro.name,
        },
        {
            key: "email",
            path: "email",
            label: "Email",
            content: (pro) => pro.email,
        },
    ];

    const handlePageChange = async (page) => {
        setValues({
            ...values,
            currentPage: page,
        });
    };

    return ( 
        <>
            <table className="table">
                <TableHeader columns={columns}/>
                <TableBody data={values.prospects} columns={columns} />
            </table>
            {loading && <div align="center" style={{marginBottom: 20}}>
                <LoadingOutlined />
            </div>}
            <Pagination
                className="text-center pt-3"
                onChange={handlePageChange}
                current={values.currentPage}
                pageSize={values.pageSize}
                total={values.itemsCount}
            />
        </>
     );
}
 
export default ProspectTable;