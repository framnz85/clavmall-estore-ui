import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import NumberFormat from "react-number-format";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { LoadingOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { getOrders, changeStatus } from "../../../functions/admin";
import AdminNav from "../../../components/nav/AdminNav";

const AdminDashboard = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const { user, history } = useSelector((state) => ({
    ...state,
  }));

  useEffect(() => {
    loadOrders();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadOrders = () => {
    if (!history.orders) {
      setLoading(true);
      getOrders(user.token).then((res) => {
        dispatch({
          type: "DASHBOARD_LIST",
          payload: { ...history, orders: res.data },
        });
        setLoading(false);
      });
    }
  };

  const handleStatusChange = (orderId, orderStatus) => {
    changeStatus(orderId, orderStatus, user.token).then((res) => {
      setLoading(true);
      getOrders(user.token).then((res) => {
        toast.success("Order status updated");
        dispatch({
          type: "DASHBOARD_LIST",
          payload: { ...history, orders: res.data },
        });
        setLoading(false);
      });
    });
  };

  const showOrderInTable = () => {
    return (
      <table className="table table-bordered">
        <thead className="thead-light">
          <tr>
            <th scope="col">Date Created</th>
            <th scope="col">Order Code</th>
            <th scope="col">Grand Total</th>
            <th scope="col">Status</th>
            <th scope="col">Payment</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {history.orders &&
            history.orders.map((order, i) => {
              return (
                <tr key={i}>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>{order._id}</td>
                  <td>
                    <NumberFormat
                      value={order.grandTotal.toFixed(2)}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={"₱"}
                    />
                  </td>
                  <td>
                    <select
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className="form-control"
                      defaultValue={order.orderStatus}
                      name="status"
                    >
                      <option value="Not Processed">Not Processed</option>
                      <option value="Processing">Processing</option>
                      <option value="Delivering">Delivering</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                  <td>{order.paymentOption}</td>
                  <td>
                    <Link to={`/admin/order/${order._id}`}>
                      <UnorderedListOutlined /> View Details
                    </Link>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    );
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-m-2">
          <AdminNav />
        </div>

        <div className="col-md-10 bg-white mt-3 mb-5">
          <h4 style={{ margin: "20px 0" }}>Dashboard</h4>
          {showOrderInTable()}

          {loading && (
            <h4 style={{ margin: "20px 0" }}>
              <LoadingOutlined />
            </h4>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
