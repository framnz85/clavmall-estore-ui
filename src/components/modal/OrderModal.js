import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "antd";
import { toast } from "react-toastify";

import InputSelect from "../common/form/InputSelect";
import AntDatePicker from "../common/form/AntDatePicker";
import AntTextarea from "../common/form/AntTextarea";

import { changeStatus } from "../../functions/admin";
import { createCommission } from "../../functions/referral";

const OrderModal = ({
    values,
    setValues,
    isModalVisible,
    setIsModalVisible,
    status,
    setStatus
}) => {
    let dispatch = useDispatch();

    const { user, admin } = useSelector((state) => ({
        ...state,
    }));
    
    const handleChangeStatus = (e) => {
        setValues({
            ...values,
            status: e.target.value,
            historyDesc: e.target.value,
        })
    }

    const handleStatusSubmit = () => {
        let totalCommission = 0;
        const servReferral = parseFloat(values.order.delAddress && values.order.delAddress.addiv3 && values.order.delAddress.addiv3.referral);
        const servReferraltype = values.order.delAddress && values.order.delAddress.addiv3 && values.order.delAddress.addiv3.referraltype;

        const finalHistory = [...values.order.history, {
            historyDate: values.historyDate,
            historyDesc: values.historyDesc,
            historyMess: values.historyMess,
        }]

        values.order.products.map(prod => {
            const { supplierPrice, referral, referraltype } = prod.product;
            const commission = referraltype === "%"
                ? parseFloat(supplierPrice) * (parseFloat(referral) / 100) * parseFloat(prod.count)
                : parseFloat(referral) * parseFloat(prod.count);
            totalCommission += commission;
            return commission;
        })

        if (servReferral > 0) {
            const servCommission = servReferraltype === "%"
                ? parseFloat(values.order.cartTotal) * (parseFloat(servReferral) / 100)
                : parseFloat(servReferral);
            totalCommission += servCommission;
        }

        changeStatus({
            ...values.order,
            orderStatus: values.status,
            history: finalHistory
        }, user.token).then(res => {
            const { _id: orderid, orderCode, orderedBy, grandTotal} = values.order;

            if (orderedBy && values.status === "Completed") {
                createCommission({
                    ownerid: orderedBy.refid,
                    orderid,
                    orderCode,
                    userid: orderedBy._id,
                    username: orderedBy.name,
                    amount: grandTotal,
                    commission: totalCommission,
                }, user.token).then(res => {
                    if (res.data.err) {
                        toast.error(res.data.err);
                    } else {
                        toast.success(`Referral commission was successfully posted to ${user.name}`);
                    };
                })
            }
            setValues({
                ...values,
                order: {
                    ...values.order,
                    orderStatus: res.data.orderStatus,
                    history: res.data.history
                },
            })
            setStatus(res.data.orderStatus);
            dispatch({
                type: "ADMIN_OBJECT_XI",
                payload: {
                    orders: {
                        ...admin.orders,
                        values: admin.orders.values.map(order =>
                            order._id === values.order._id
                                ? {
                                    ...order,
                                    orderStatus: res.data.orderStatus,
                                    history: res.data.history
                                }
                                : order
                        ),
                    }
                },
            });
            setIsModalVisible(false);
        })
    };

    return (
        <Modal
            title="Change Status"
            visible={isModalVisible}
            onOk={handleStatusSubmit}
            onCancel={() => setIsModalVisible(false)}
            okText="Change"
        >
            <InputSelect
                inputProperty={{
                    label: "Select Status",
                    value: values.status,
                    onChange: handleChangeStatus,
                    options: status === "Completed" 
                        ? [{ key: "Completed", value: "Completed", text: "Completed", }]
                        : values.statusOption.map(
                        (status) =>
                        (status = {
                            ...status,
                            key: status,
                            value: status,
                            text: status,
                        })
                    ),
                    show: true,
                }}
            />
            <AntDatePicker
                inputProperty={{
                    name: "date",
                    label: "Date",
                    style: { width: "100%" },
                    onChange: (date) => setValues({ ...values, historyDate: date }),
                    value: values.historyDate
                }}
            />
            <AntTextarea
                inputProperty={{
                    name: "notes",
                    label: "Note",
                    value: values.historyMess,
                    onChange: (e) => setValues({ ...values, historyMess: e.target.value }),
                }}
            />
        </Modal>
    );
}

export default OrderModal;