import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NumberFormat from "react-number-format";
import { Link } from "react-router-dom";
import { Pagination, Modal } from "antd";
import { toast } from "react-toastify";
import {
  UnorderedListOutlined,
  LoadingOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { isMobile } from "react-device-detect";

import TableHeader from "../../common/table/TableHeader";
import TableBody from "../../common/table/TableBody";

import { deleteOrderById } from "../../../functions/order";

const DashboardTable = ({ values, setValues, loading }) => {
  let dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderDelete, setOrderDelete] = useState({});

  const { user, admin } = useSelector((state) => ({ ...state }));

  const statusColor = [
    { status: "Not Processed", color: "darkred" },
    { status: "Waiting Payment", color: "red" },
    { status: "Processing", color: "blue" },
    { status: "Delivering", color: "darkorange" },
    { status: "Cancelled", color: "" },
    { status: "Completed", color: "green" },
  ];

  const { orders, itemsCount, pageSize, currentPage, sort } = values;

  const columns = [
    {
      key: "createdAt",
      path: "createdAt",
      label: "Date Created",
      content: (order) => new Date(order.createdAt).toLocaleDateString(),
    },
    {
      key: "_id",
      path: "_id",
      label: "Order Code",
      content: (order) => order.orderCode,
    },
    {
      key: "orderedBy.name",
      path: "orderedBy.name",
      label: "Ordered By",
      content: (order) => order.orderedBy && order.orderedBy.name,
    },
    {
      key: "grandTotal",
      path: "grandTotal",
      label: "Grand Total",
      content: (order) => (
        <NumberFormat
          value={order.grandTotal.toFixed(2)}
          displayType={"text"}
          thousandSeparator={true}
          prefix={"₱"}
        />
      ),
    },
    {
      key: "orderStatus",
      path: "orderStatus",
      label: "Status",
      content: (order) =>
        order && order.orderStatus ? (
          <span
            style={{
              color: statusColor.find((s) => s.status === order.orderStatus)
                .color,
            }}
          >
            {order.orderStatus}
          </span>
        ) : (
          ""
        ),
    },
    {
      key: "paymentOption",
      path: "paymentOption",
      label: "Payment",
      content: (order) =>
        order.paymentOption.category + " - " + order.paymentOption.name,
    },
    {
      key: "action",
      content: (order) => {
        return (
          <div
            style={{
              width: isMobile ? "100%" : 40,
              fontSize: isMobile ? 20 : 14,
            }}
          >
            <Link to={`/admin/order/${order._id}`}>
              <UnorderedListOutlined />
            </Link>
            {(order.orderStatus === "Not Processed" ||
              order.orderStatus === "Cancelled") && (
              <DeleteOutlined
                style={{
                  marginLeft: 10,
                  color: "red",
                  cursor: "pointer",
                  float: isMobile ? "right" : "none",
                  marginTop: isMobile ? 8 : 0,
                }}
                onClick={() => {
                  setIsModalOpen(true);
                  setOrderDelete(order);
                }}
              />
            )}
          </div>
        );
      },
    },
  ];

  const handleSort = (sortName) => {
    setValues({
      ...values,
      currentPage: 1,
      sortkey: sortName,
      sort: -sort,
    });
    dispatch({
      type: "ADMIN_OBJECT_III",
      payload: {
        orders: {
          values: [],
          pages: [],
          itemsCount: 0,
        },
      },
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const removeOrder = () => {
    setIsModalOpen(false);
    deleteOrderById(orderDelete._id, user.token).then(() => {
      setValues({
        ...values,
        orders: orders.filter((o) => o._id !== orderDelete._id),
      });
      dispatch({
        type: "ADMIN_OBJECT_XIII",
        payload: {
          orders: {
            ...admin.orders,
            values: orders.filter((o) => o._id !== orderDelete._id),
          },
        },
      });
      toast.error(`Order Code ${orderDelete.orderCode} has been deleted`);
    });
  };

  return (
    <div>
      {loading && (
        <div align="center">
          <LoadingOutlined />
          <br />
        </div>
      )}
      <table className="table">
        <TableHeader columns={columns} onSort={handleSort} sort={sort} />
        <TableBody
          columns={columns}
          data={orders.filter((order) => order.page === currentPage)}
          currentPage={currentPage}
          pageSize={pageSize}
        />
      </table>
      <Pagination
        className="text-center pt-3"
        onChange={(value) => setValues({ ...values, currentPage: value })}
        current={currentPage}
        pageSize={pageSize}
        total={itemsCount}
      />

      <Modal
        title="Delete Order"
        visible={isModalOpen}
        onOk={removeOrder}
        onCancel={handleCancel}
        okText="Delete"
      >
        <p style={{ textAlign: "center" }}>
          Are you sure you want to delete Order Code {orderDelete.orderCode} ?
        </p>
      </Modal>
    </div>
  );
};

export default DashboardTable;
