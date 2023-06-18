import React, {useState} from 'react'
import { useSelector } from "react-redux";
import NumberFormat from "react-number-format";
import { Pagination, Modal, Input, Select } from "antd";
import { LoadingOutlined, EditOutlined } from '@ant-design/icons';
import Joi from "joi-browser";
import { toast } from "react-toastify";

import TableHeader from '../../common/table/TableHeader';
import TableBody from "../../common/table/TableBody";

import { updateWithdraw } from '../../../functions/affiliate';

const { Option } = Select;

const AffiliateTable = ({values, setValues, loading, loadAffiliates, totalRemaining}) => {
    const { currentPage, pageSize, itemsCount } = values
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [affid, setAffid] = useState("");
    const [withid, setWithid] = useState("");
    const [bank, setBank] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [accountName, setAccountName] = useState("");
    const [withdrawAmount, setWithdrawAmount] = useState(0);
    const [fixedAmount, setFixedAmount] = useState(0);

    const { user } = useSelector((state) => ({
        ...state,
    }));
    
    const columns = [
        {
            key: "createdAt",
            path: "createdAt",
            label: "Date Created",
            content: (aff) => new Date(aff.createdAt).toLocaleString(),
        },
        {
            key: "name",
            path: "name",
            label: "Name",
            content: (aff) => aff.name,
        },
        {
            key: "product",
            path: "product",
            label: "Product",
            content: (aff) => aff.product,
        },
        {
            key: "amount",
            path: "amount",
            label: "Amount",
            content: (aff) => 
            <NumberFormat
                value={parseFloat(aff.amount).toFixed(2)}
                displayType={"text"}
                thousandSeparator={true}
                prefix={"₱"}
            />,
        },
        {
            key: "commission",
            path: "commission",
            label: "Commission",
            content: (aff) => 
            <NumberFormat
                value={parseFloat(aff.commission).toFixed(2)}
                displayType={"text"}
                thousandSeparator={true}
                prefix={"₱"}
                style={{color: aff.commission < 0 && "red"}}
            />,
        },
        {
            key: "status",
            path: "status",
            label: "Status",
            content: (aff) => aff.product === "Withdraw" && aff.status === "Pending" ?
                <>
                    <span style={{color: "red"}}>{aff.status}</span>{" "}
                    <span style={{ color: "red", cursor: "pointer" }} onClick={() => showModal(aff)}>
                        <EditOutlined />
                    </span>
                </> : <span style={{color: aff.status === "Approved" ? "green" : "red"}}>{aff.status}</span>,
        },
    ];

    const schema = {
        bank: Joi.string().min(2).max(32).required().label('Bank'),
        accountNumber: Joi.string().min(2).max(32).required().label('Account Number'),
        accountName: Joi.string().min(2).max(32).required().label('Account Name'),
        withdrawAmount: Joi.number().integer().min(1000).required().label('Amount'),
    };

    const handlePageChange = async (page) => {
        setValues({
            ...values,
            currentPage: page,
        });
    };

    const showModal = (affiliate) => {
        setAffid(affiliate._id);
        setWithid(affiliate.withid);
        setBank(affiliate.bank);
        setAccountNumber(affiliate.accountNumber);
        setAccountName(affiliate.accountName);
        setWithdrawAmount(affiliate.amount);
        setFixedAmount(affiliate.amount);
        setIsModalOpen(true);
    };

    const handleOk = () => {
        const validate = Joi.validate({ bank, accountNumber, accountName, withdrawAmount }, schema, {
            abortEarly: false,
        });

        if (validate.error) {
            for (let item of validate.error.details) toast.error(item.message);
            return;
        }
        if (withdrawAmount > (fixedAmount + totalRemaining)) return toast.error("Amount should not exceed " + parseFloat(fixedAmount + totalRemaining));

        updateWithdraw({affid, withid, bank, accountNumber, accountName, withdrawAmount}, user.token).then(res => {
            loadAffiliates();
            setIsModalOpen(false);
        })
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return ( 
        <>
            <table className="table">
                <TableHeader columns={columns}/>
                <TableBody data={values.affiliates} columns={columns} />
            </table>
            {loading && <div align="center" style={{marginBottom: 20}}>
                <LoadingOutlined />
            </div>}
            <Pagination
                className="text-center pt-3"
                onChange={handlePageChange}
                current={currentPage}
                pageSize={pageSize}
                total={itemsCount}
            />
            <Modal title="Update Withdraw" visible={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText="Update">
                <label>Bank:</label>
                <Select
                    style={{
                        width: "100%",
                    }}
                    value={bank}
                    onChange={value => setBank(value)}
                >
                    <Option value="gca">Gcash</Option>
                    <Option value="bdo">BDO</Option>
                    <Option value="bpi">BPI</Option>
                    <Option value="uni">Unionbank</Option>
                </Select><br />
                <label>Account Number:</label>
                <Input
                    value={accountNumber}
                    onChange={e => setAccountNumber(e.target.value)}
                />
                <label>Account Name:</label>
                <Input
                    value={accountName}
                    onChange={e => setAccountName(e.target.value)}
                />
                <label>Amount:</label>
                <Input
                    placeholder="0.00"
                    value={withdrawAmount}
                    onChange={e => setWithdrawAmount(e.target.value)}
                />
            </Modal>
        </>
     );
}
 
export default AffiliateTable;