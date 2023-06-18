import React, {useEffect, useState} from 'react';
import { useSelector } from "react-redux";
import { Modal, Button } from "antd";

import ShowingForms from '../common/ShowingForms';

import { getAllMyPayments } from "../../functions/payment";
import { paymentChange } from '../../functions/order';

const EditPayment = ({ values, setValues }) => {
    const { order } = values;

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [payid, setPayid] = useState("");
    const [category, setCategory] = useState("");
    const [payCategories, setPayCategories] = useState([]);
    const [name, setName] = useState("");
    const [payBanks, setPayBanks] = useState([]);

    const { user } = useSelector((state) => ({
        ...state,
    }));

    useEffect(() => {
        loadAllMyPayment();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const loadAllMyPayment = () => {
        getAllMyPayments(user.address ? user.address : {}).then((res) => {
            setPayid(order.paymentOption && order.paymentOption.payid);
            setCategory(order.paymentOption && order.paymentOption.category);
            setName(order.paymentOption && order.paymentOption.name);
            setPayCategories(res.data);
            order.paymentOption && setPayBanks(res.data.filter(pay => pay.category === order.paymentOption.category));
        });
    };

    const handleSubmitPayment = () => {
        setLoading(true);
        paymentChange(order._id, payid, category, name, user.token).then(res => {
            setValues({
                ...values,
                order: {
                    ...values.order,
                    paymentOption: {
                        payid, category, name
                    }
                }
            });
            setLoading(false);
            setIsModalVisible(false);
        })
    }

    const handleCategoryChange = (value) => {
        const choosenCat = payCategories.filter(pay => pay.category === value);
        setPayid(choosenCat[0]._id);
        setPayBanks(choosenCat);
        setName(choosenCat[0].name); 
        setCategory(value);
    }

    const handleBankChange = (value) => {
        const choosenBank = payCategories.filter(pay => pay.name === value);
        setPayid(choosenBank[0]._id);
        setName(value); 
    }

    const formProperty = [
        {
            type: "select",
            name: "category",
            label: "Payment Category",
            onChange: (e) => handleCategoryChange(e.target.value),
            value: category,
            options: payCategories
            .sort((a, b) => a.name > b.name ? 1 : b.name > a.name ? -1 : 0)
            .map(
                (payment) =>
                (payment = {
                    ...payment,
                    key: payment._id,
                    value: payment.category,
                    text: payment.category,
                })
            ),
            disabled: loading,
            show: true,
        },
        {
            type: "select",
            name: "bank",
            label: "Select Bank",
            onChange: (e) => handleBankChange(e.target.value),
            value: name,
            options: payBanks
            .sort((a, b) => a.name > b.name ? 1 : b.name > a.name ? -1 : 0)
            .map(
                (bank) =>
                (bank = {
                    ...bank,
                    key: bank._id,
                    value: bank.name,
                    text: bank.name,
                })
            ),
            disabled: loading,
            show: true,
        },
    ]
    return (
        <>
            <Button
              className="btn btn-sm btn-block btn-outline-primary"
              onClick={() => setIsModalVisible(true)}
            >
              Change Payment
            </Button>
            <Modal
                title={`Change Payment for Order ${order.orderCode}`}
                visible={isModalVisible}
                onOk={handleSubmitPayment}
                onCancel={() => setIsModalVisible(false)}
            >
                <ShowingForms formProperty={formProperty} />
            </Modal>
        </>
    );
}

export default EditPayment;