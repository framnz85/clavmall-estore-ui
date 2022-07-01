import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { useSelector } from "react-redux";
import { LoadingOutlined } from "@ant-design/icons";
import { PDFDownloadLink } from "@react-pdf/renderer";
import moment from "moment";
import AdminNav from "../../../components/nav/AdminNav";
import OrderDetailsTable from "../../../components/forms/dashboard/OrderDetailsTable";
import Invoice from "../../../components/pdf/Invoice";
import OrderModal from "../../../components/modal/OrderModal";
import OrderHistoryTable from "../../../components/forms/dashboard/OrderHistoryTable";
import { getOrder } from "../../../functions/admin";

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

const OrderDetails = ({ match }) => {
  const orderid = match.params.orderid;

  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState(initialState);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { user, admin } = useSelector((state) => ({
    ...state,
  }));

  useEffect(() => {
    loadProducts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadProducts = () => {
    const orderedProducts =
      admin.orders &&
      admin.orders.values.filter((order) => order._id === orderid);
    if (orderedProducts && orderedProducts.length > 0) {
      setValues({
        ...values,
        order: { ...values.order, ...orderedProducts[0] },
        status: orderedProducts[0].orderStatus,
        historyDesc: orderedProducts[0].orderStatus,
      });
    } else {
      setLoading(true);
      getOrder(orderid, user.token).then((res) => {
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
          <AdminNav />
        </div>
        <div className="col-md-10 bg-white mt-3 mb-5">
          <h4 style={{ margin: "20px 0" }}>
            {loading ? <LoadingOutlined /> : `Order Code ${values.order.orderCode}`}
          </h4>

          {values.order ? (
            <OrderDetailsTable values={values} />
          ) : (
            <p className="text-danger">No products under this code</p>
          )}

          <Button
            className="btn btn-sm btn-block btn-outline-primary"
            onClick={() => setIsModalVisible(true)}
          >
            Update Status
          </Button>

          <OrderModal
            values={values}
            setValues={setValues}
            isModalVisible={isModalVisible}
            setIsModalVisible={setIsModalVisible}
          />

          {values.order && values.order._id && (
            <PDFDownloadLink
              document={<Invoice order={values.order} />}
              fileName={`order-${values.order._id}.pdf`}
              className="btn btn-sm btn-block btn-outline-primary"
            >
              Download PDF
            </PDFDownloadLink>
          )}
          <br />

          <h4 style={{ margin: "20px 0" }}>Order History</h4>

          <OrderHistoryTable history={values.order.history} />
          <br />
          <br />

        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
