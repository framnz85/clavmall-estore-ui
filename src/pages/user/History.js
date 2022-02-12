import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import NumberFormat from "react-number-format";
import { Link } from "react-router-dom";
import { LoadingOutlined, UnorderedListOutlined } from "@ant-design/icons";
import UserNav from "../../components/nav/UserNav";
import { getUserOrders } from "../../functions/user";

const History = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const { user, history } = useSelector((state) => ({
    ...state,
  }));

  useEffect(() => {
    loadUserOrders();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadUserOrders = () => {
    if (!history.userOrders) {
      setLoading(true);
      getUserOrders(user.token).then((res) => {
        dispatch({
          type: "HISTORY_LIST",
          payload: { ...history, userOrders: res.data },
        });
        setLoading(false);
      });
    }
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
          {history.userOrders &&
            history.userOrders.map((order, i) => {
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
                  <td>{order.orderStatus}</td>
                  <td>{order.paymentOption}</td>
                  <td>
                    <Link to={`/user/order/${order._id}`}>
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
          <UserNav />
        </div>
        <div className="col-md-10 bg-white mt-3 mb-5">
          <h4 style={{ margin: "20px 0" }}>
            {history.userOrders && history.userOrders.length
              ? "Order History"
              : "No orders yet"}
          </h4>
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

export default History;
