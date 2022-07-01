import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "antd";
import InputSelect from "../common/form/InputSelect";
import AntDatePicker from "../common/form/AntDatePicker";
import AntTextarea from "../common/form/AntTextarea";
import { changeStatus } from "../../functions/admin";

const OrderModal = ({ values, setValues, isModalVisible, setIsModalVisible }) => {
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

    const handleOk = () => {
        const finalHistory = [...values.order.history, {
            historyDate: values.historyDate,
            historyDesc: values.historyDesc,
            historyMess: values.historyMess,
        }]

        changeStatus({
            ...values.order,
            orderStatus: values.status,
            history: finalHistory
        }, user.token).then(res => {
            setValues({
                ...values,
                order: {
                    ...values.order,
                    orderStatus: res.data.status,
                    history: res.data.history
                },
            })
            dispatch({
                type: "ADMIN_OBJECT_XI",
                payload: {
                    orders: {
                        ...admin.orders,
                        values: admin.orders.values.map(order =>
                            order._id === values.order._id
                                ? {
                                    ...order,
                                    orderStatus: res.data.status,
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
            onOk={handleOk}
            onCancel={() => setIsModalVisible(false)}>
            <InputSelect
                inputProperty={{
                    label: "Select Status",
                    value: values.status,
                    onChange: handleChangeStatus,
                    options: values.statusOption.map(
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