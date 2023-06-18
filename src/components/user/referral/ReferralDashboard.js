import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Layout, Button, Modal, Input, Select  } from 'antd';
import NumberFormat from "react-number-format";
import { isMobile } from 'react-device-detect';
import Joi from "joi-browser";
import { toast } from "react-toastify";

import { withdrawReferral } from '../../../functions/referral';

const { Option } = Select;

const ReferralDashboard = ({values, loadCommissions, totalRemaining}) => {
    const { Sider } = Layout;
    
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [bank, setBank] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [accountName, setAccountName] = useState("");
    const [withdrawAmount, setWithdrawAmount] = useState(0);
 
    const { user } = useSelector((state) => ({
        ...state,
    }));

    const schema = {
        bank: Joi.string().min(2).max(32).required().label('Bank'),
        accountNumber: Joi.string().min(2).max(32).required().label('Account Number'),
        accountName: Joi.string().min(2).max(32).required().label('Account Name'),
        withdrawAmount: Joi.number().integer().min(100).max(totalRemaining).required().label('Amount'),
    };
        
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        if (!loading) {
            const validate = Joi.validate({ bank, accountNumber, accountName, withdrawAmount }, schema, {
                abortEarly: false,
            });
    
            if (validate.error) {
                for (let item of validate.error.details) toast.error(item.message);
                return;
            }
            
            setLoading(true)
            withdrawReferral({ bank, accountNumber, accountName, withdrawAmount }, user.token).then(res => {
                if (res.data.err) {
                    toast.error(res.data.err)
                }
                loadCommissions();
                setLoading(false);
                setIsModalOpen(false);
            })
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    
    return (
        <>
            {!isMobile && <Layout style={{textAlign: "center"}}>
                <Sider style={{ backgroundColor: "#00FFFF", height: "100px", width: "50%", padding: 20 }}>
                    <b>Total Prducts</b><br />
                    <span style={{ fontSize: 24 }}>{values.totalProducts}</span>
                </Sider>
                <Sider style={{ backgroundColor: "#FFC300", height: "100px", width: "50%", padding: 20 }}>
                    <b>Total Commission</b><br />
                    <span style={{ fontSize: 24 }}>
                        <NumberFormat
                            value={values.totalCommission && values.totalCommission.toFixed(2)}
                            displayType={"text"}
                            thousandSeparator={true}
                            prefix={"₱"}
                        />
                    </span>
                </Sider>
                <Sider style={{ backgroundColor: "#ff0000", height: "100px", width: "50%", padding: 20 }}>
                    <b>Total Widrawn</b><br />
                    <span style={{fontSize: 24}}>
                        <NumberFormat
                            value={values.totalWithdrawn && values.totalWithdrawn.toFixed(2)}
                            displayType={"text"}
                            thousandSeparator={true}
                            prefix={"₱"}
                        />
                    </span>
                </Sider><br />
                <Sider style={{ backgroundColor: "#00D100", height: "100px", width: "50%", padding: 20 }}>
                    <b>Total Remaining</b><br />
                    <span style={{fontSize: 24}}>
                        <NumberFormat
                            value={values.totalRemaining && values.totalRemaining.toFixed(2)}
                            displayType={"text"}
                            thousandSeparator={true}
                            prefix={"₱"}
                        />
                    </span>
                </Sider>
                <Button style={{margin: "20px 0 0 5px"}} onClick={() => showModal()}>Withdraw</Button>
            </Layout>}

            {isMobile && 
                <>
                    <Layout style={{textAlign: "center"}}>
                        <Sider style={{ backgroundColor: "#00FFFF", height: "100px", width: "50%", padding: 20 }}>
                            <b>Total Prducts</b><br />
                            <span style={{ fontSize: 24 }}>{values.totalProducts}</span>
                        </Sider>
                        <Sider style={{ backgroundColor: "#FFC300", height: "100px", width: "50%", padding: 20 }}>
                            <b>Total Commission</b><br />
                            <span style={{ fontSize: 24 }}>
                                <NumberFormat
                                    value={values.totalCommission && values.totalCommission.toFixed(2)}
                                    displayType={"text"}
                                    thousandSeparator={true}
                                    prefix={"₱"}
                                />
                            </span>
                        </Sider>
                    </Layout>
                    <Layout style={{textAlign: "center"}}>
                        <Sider style={{ backgroundColor: "#ff0000", height: "100px", width: "50%", padding: 20 }}>
                            <b>Total Widrawn</b><br />
                            <span style={{fontSize: 24}}>
                                <NumberFormat
                                    value={values.totalWithdrawn && values.totalWithdrawn.toFixed(2)}
                                    displayType={"text"}
                                    thousandSeparator={true}
                                    prefix={"₱"}
                                />
                            </span>
                        </Sider>
                        <Sider style={{ backgroundColor: "#00D100", height: "100px", width: "50%", padding: 20 }}>
                            <b>Total Remaining</b><br />
                            <span style={{fontSize: 24}}>
                                <NumberFormat
                                    value={values.totalRemaining && values.totalRemaining.toFixed(2)}
                                    displayType={"text"}
                                    thousandSeparator={true}
                                    prefix={"₱"}
                                />
                            </span>
                        </Sider>
                    </Layout>
                    <Layout style={{textAlign: "center"}}>
                        <Button style={{margin: "20px 0 0 5px"}} onClick={() => showModal()}>Withdraw</Button>
                    </Layout>
                </>
            }
            <Modal title="Withdraw Commission" visible={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText="Submit">
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
                    values={accountNumber}
                    onChange={e => setAccountNumber(e.target.value)}
                />
                <label>Account Name:</label>
                <Input
                    values={accountName}
                    onChange={e => setAccountName(e.target.value)}
                />
                <label>Amount:</label>
                <Input
                    placeholder="0.00"
                    values={withdrawAmount}
                    onChange={e => setWithdrawAmount(e.target.value)}
                />
            </Modal>
        </>
    );
}
 
export default ReferralDashboard;