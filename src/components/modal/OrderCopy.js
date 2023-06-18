import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Modal, Button } from "antd";

import filterProductsAddress from "../common/filterProductsAddress";

const OrderCopy = ({order, edit}) => {
    let dispatch = useDispatch();
    let history = useHistory();
    
    const [isModalVisible, setIsModalVisible] = useState(false);

    const { user } = useSelector((state) => ({
        ...state,
    }));

    const handleOkCopyOrder = () => {
        let productsToCopy = order.products.map(p => {
            return {...p.product, count: p.count, variant: p.variant} 
        });
        const productsToCart = filterProductsAddress(productsToCopy, user.address);
        dispatch({
          type: "INPUTS_OBJECT_XIV",
          payload: {cart: productsToCart},
        });
        localStorage.setItem("cart", JSON.stringify(productsToCart));
        if (edit) {
            localStorage.setItem("order", JSON.stringify({_id: order._id, orderCode: order.orderCode}));
        } else {
            localStorage.removeItem("order");
        }
        history.push("/cart");
    }

    return (
        <>
            <Button
              className="btn btn-sm btn-block btn-outline-primary"
              onClick={() => setIsModalVisible(true)}
            >
              {edit ? "Edit Order" : "Copy Order"}
            </Button>
            <Modal
                title={edit ? "Edit Your Order" : "Copy And Make New Order"}
                visible={isModalVisible}
                onOk={handleOkCopyOrder}
                onCancel={() => setIsModalVisible(false)}
            >
            {edit && <div align="center">
                Editing Order Code {order.orderCode}?
                <br /><br />
            </div>}
            {!edit && <div align="center">
                Make new order by copying Order Code {order.orderCode}?
                <br /><br />
                <div style={{color: "red"}}>Note: Not all products in this order can be copied to the new one. Some of the product may not be available in your area. Some also may be out of stock or the admin has turn it off.</div>
            </div>}
            </Modal>
        </>
    );
}

export default OrderCopy;