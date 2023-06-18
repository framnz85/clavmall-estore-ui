import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button } from 'antd';
import { useHistory } from "react-router-dom";
import { ShoppingOutlined, CloseOutlined } from '@ant-design/icons';

import filterProductsAddress from "../../components/common/filterProductsAddress";

const CartExistModal = ({cart, isCartExist, setIsCartExist}) => {
  let dispatch = useDispatch();
  let history = useHistory();

  const { user } = useSelector((state) => ({ ...state }));

  const handleOk = () => {
    handleCopyOrder(cart.products);
    setIsCartExist(false);
    localStorage.setItem("stopCartShow", true);
  };

  const handleCancel = () => {
    setIsCartExist(false);
    localStorage.setItem("stopCartShow", true);
  }

  const handleCopyOrder = (products) => {
      let productsToCopy = products.map(p => {
          return {...p.product, count: p.count, variant: p.variant} 
      });
      const productsToCart = filterProductsAddress(productsToCopy, user.address);
      dispatch({
        type: "INPUTS_OBJECT_XIV",
        payload: {cart: productsToCart},
      });
      localStorage.setItem("cart", JSON.stringify(productsToCart));
      history.push("/cart");
  }

  return (
    <>
      <Modal 
        title="Existing Products In Your Cart"
        visible={isCartExist}
        onCancel={handleCancel}
        footer={[
          <Button
            key="3"
            onClick={() => handleCancel()}
            className="text-center btn btn-default btn-raised"
            style={{marginTop: -5}}
          >
            <CloseOutlined /> Cancel
          </Button>
        ]}
    >
      <div align="center">
        You have existing products in your cart.<br />
        Would you like to proceed and edit your cart?<br /><br />
        <Button
          key="1"
          onClick={handleOk}
            className="text-center btn btn-primary btn-raised"
            size="large"
        >
          <ShoppingOutlined /> Proceed
        </Button>
      </div>
      </Modal>
    </>
  );
};
export default CartExistModal;