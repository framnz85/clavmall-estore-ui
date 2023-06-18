import React from "react";
import { useDispatch } from "react-redux";
import NumberFormat from "react-number-format";
import { LoadingOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Pagination } from "antd";
import { UnorderedListOutlined } from "@ant-design/icons";
import TableHeader from "../common/table/TableHeader";
import TableBody from "../common/table/TableBody";
import { isMobile } from "react-device-detect";

const OrderUsersTable = ({ values, setValues, loading }) => {
  let dispatch = useDispatch();
  const { orders, itemsCount, pageSize, currentPage, sort } = values;

  const statusColor = [
    { status: "Not Processed", color: "darkred" },
    { status: "Waiting Payment", color: "red" },
    { status: "Processing", color: "blue" },
    { status: "Delivering", color: "darkorange" },
    { status: "Cancelled", color: "" },
    { status: "Completed", color: "green" },
  ];

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
          <Link
            to={`/user/order/${order._id}`}
            style={{ fontSize: isMobile ? 20 : 14 }}
          >
            <UnorderedListOutlined />
          </Link>
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
      type: "ORDER_LIST_I",
      payload: {
        values: [],
        pages: [],
        itemsCount: 0,
      },
    });
  };

  return (
    <div>
      <table className="table">
        <TableHeader columns={columns} onSort={handleSort} sort={sort} />
        <TableBody
          columns={columns}
          data={orders.filter((order) => order.page === currentPage)}
          currentPage={currentPage}
          pageSize={pageSize}
        />
      </table>
      {loading && (
        <div align="center">
          <LoadingOutlined />
          <br />
        </div>
      )}
      <Pagination
        className="text-center pt-3"
        onChange={(value) => setValues({ ...values, currentPage: value })}
        current={currentPage}
        pageSize={pageSize}
        total={itemsCount}
      />
      <br />
    </div>
  );
};

export default OrderUsersTable;
