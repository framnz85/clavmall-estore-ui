import React from "react";
import { Modal, Button } from "antd";
import { DeleteOutlined, CloseOutlined } from "@ant-design/icons";

const EmptyCart = ({empty, setEmpty, emptyCart}) => {
  return (
    <Modal
      title={<div style={{ color: "red" }}>Empty Cart?</div>}
      centered
      visible={empty}
      onOk={() => ""}
      onCancel={() => setEmpty(false)}
      footer={[
        <Button
          key="1"
          onClick={() => emptyCart()}
          className="text-center btn btn-primary btn-raised"
          style={{marginTop: 5}}
        >
          <DeleteOutlined /> Yes
        </Button>,
        <Button
          key="2"
          onClick={() => setEmpty(false)}
          className="text-center btn btn-default btn-raised"
        >
          <CloseOutlined /> No
        </Button>
      ]}
    >
      <div align="center">Are you sure you want to empty your cart?</div>
    </Modal>
  );
};

export default EmptyCart;
