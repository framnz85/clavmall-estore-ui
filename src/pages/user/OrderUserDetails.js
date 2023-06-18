import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { LoadingOutlined } from "@ant-design/icons";
import moment from "moment";

import UserNav from "../../components/nav/UserNav";
import OrderDetailsTable from "../../components/user/OrderDetailsTable";
import OrderHistoryTable from "../../components/user/OrderHistoryTable";
import PaymentDetails from "../../components/payment/payDetails";
import OrderCopy from "../../components/modal/OrderCopy";
import EditPayment from "../../components/modal/EditPayment";
import CreateStore from "../../components/common/CreateStore";

import { getUserOrder } from "../../functions/order";

const initialState = {
  order: {
    history: [],
  },
  status: "",
  statusOption: [
    "Not Processed",
    "Waiting Payment",
    "Processing",
    "Delivering",
    "Cancelled",
    "Completed",
  ],
  historyDate: moment(),
  historyDesc: "",
  historyMess: "",
};

const OrderUserDetails = ({ match }) => {
  const orderid = match.params.orderid;

  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState(initialState);

  const { user, orders } = useSelector((state) => ({
    ...state,
  }));

  useEffect(() => {
    loadProducts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadProducts = () => {
    const orderedProducts =
      orders && orders.values.filter((order) => order._id === orderid);
    if (orderedProducts && orderedProducts.length > 0) {
      setValues({
        ...values,
        order: { ...values.order, ...orderedProducts[0] },
        status: orderedProducts[0].orderStatus,
        historyDesc: orderedProducts[0].orderStatus,
      });
    } else {
      setLoading(true);
      getUserOrder(orderid, user.token).then((res) => {
        setValues({
          ...values,
          order: { ...values.order, ...res.data[0] },
          status: res.data[0].orderStatus,
          historyDesc: res.data[0].orderStatus,
        });
        setLoading(false);
      });
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-m-2">
          <UserNav />
        </div>
        <div className="col-md-10 bg-white mt-3 mb-5">
          <h4 style={{ margin: "20px 0" }}>
            {loading ? (
              <LoadingOutlined />
            ) : (
              `Order Code ${values.order.orderCode}`
            )}
          </h4>

          {values.order ? (
            <OrderDetailsTable values={values} />
          ) : (
            <p className="text-danger">No products under this code</p>
          )}

          <OrderCopy order={values.order} />

          {values.order.orderStatus &&
            (values.order.orderStatus === "Not Processed" ||
              values.order.orderStatus === "Waiting Payment") && (
              <>
                <OrderCopy order={values.order} edit={true} />

                <EditPayment values={values} setValues={setValues} />
              </>
            )}

          {values.order.paymentOption && values.order.orderStatus && (
            <PaymentDetails
              order={values.order}
              paymentOption={values.order.paymentOption}
              orderStatus={values.order.orderStatus}
            />
          )}

          <h4 style={{ margin: "20px 0" }}>Order History</h4>

          <OrderHistoryTable history={values.order.history} />
          <br />
          <br />

          <div style={{ paddingBottom: 10 }}>
            <CreateStore />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderUserDetails;
