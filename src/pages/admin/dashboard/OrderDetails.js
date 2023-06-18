import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Popconfirm } from "antd";
import { LoadingOutlined, BackwardOutlined } from "@ant-design/icons";
import moment from "moment";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

import AdminNav from "../../../components/nav/AdminNav";
import OrderDetailsTable from "../../../components/forms/dashboard/OrderDetailsTable";
import OrderModal from "../../../components/modal/OrderModal";
import OrderHistoryTable from "../../../components/forms/dashboard/OrderHistoryTable";
import AddDomain from "../../../components/common/addDomain";

import { getOrder } from "../../../functions/admin";
import { currentUser, loginAsAuthToken } from "../../../functions/auth";
import filterProductsAddress from "../../../components/common/filterProductsAddress";

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
  let dispatch = useDispatch();
  let history = useHistory();
  const orderid = match.params.orderid;

  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState(initialState);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [grouping, setGrouping] = useState("def");
  const [pricing, setPricing] = useState("def");
  const [status, setStatus] = useState("");

  const { user, admin, estore } = useSelector((state) => ({
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
      setStatus(orderedProducts[0].orderStatus);
    } else {
      setLoading(true);
      getOrder(orderid, user.token).then((res) => {
        setValues({
          ...values,
          order: { ...values.order, ...res.data[0] },
          status: res.data[0].orderStatus,
          historyDesc: res.data[0].orderStatus,
        });
        setStatus(res.data[0].orderStatus);
        setLoading(false);
      });
    }
  };

  const handleGroup = (value) => {
    setGrouping(value);
  };

  const handlePrice = (value) => {
    setPricing(value);
  };

  const logoutLogin = (userTo) => {
    dispatch({
      type: "USER_LOGOUT",
      payload: {},
    });
    loginAsAuthToken(userTo.email, userTo.phone, user.token)
      .then((res) => {
        if (res.data.err) {
          toast.error(res.data.err);
        } else {
          const token = res.data;
          window.localStorage.setItem("userToken", token);
          currentUser(token).then((res) => {
            dispatch({
              type: "LOGGED_IN_USER_II",
              payload: {
                _id: res.data._id,
                name: res.data.name,
                phone: res.data.phone,
                email: res.data.email,
                emailConfirm: res.data.emailConfirm,
                role: res.data.role,
                address: res.data.address ? res.data.address : {},
                homeAddress: res.data.homeAddress ? res.data.homeAddress : {},
                token,
                wishlist: res.data.wishlist,
                addInstruct: res.data.addInstruct,
              },
            });
          });
          handleCopyOrder(values.order);
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const handleCopyOrder = (order) => {
    let productsToCopy = order.products.map((p) => {
      return { ...p.product, count: p.count, variant: p.variant };
    });
    const productsToCart = filterProductsAddress(productsToCopy, user.address);
    dispatch({
      type: "INPUTS_OBJECT_XIV",
      payload: { cart: productsToCart },
    });
    localStorage.setItem("cart", JSON.stringify(productsToCart));
    localStorage.setItem(
      "order",
      JSON.stringify({ _id: order._id, orderCode: order.orderCode })
    );
    history.push("/cart");
  };

  const tabs = {
    float: "left",
    padding: "5px 10px",
    borderTop: "1px solid #aaa",
    borderLeft: "1px solid #aaa",
    textAlign: "center",
    cursor: "pointer",
    borderTopRightRadius: 4,
    borderTopLeftRadius: 4,
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-m-2" id="non-printable">
          <AdminNav />
        </div>
        <div className="col bg-white mt-3 mb-5">
          <h4 style={{ margin: "20px 0" }} id="non-printable">
            {loading ? (
              <LoadingOutlined />
            ) : (
              <>{`Order Code ${values.order.orderCode}`}</>
            )}
          </h4>
          <div
            style={{ borderBottom: "1px solid #aaa", margin: "20px 0" }}
            id="non-printable"
          >
            <div
              style={{ ...tabs, backgroundColor: "#eee" }}
              onClick={() => history.push("/admin/dashboard")}
            >
              <BackwardOutlined style={{ fontSize: 18 }} /> Dashboard
            </div>
            <div
              style={{
                ...tabs,
                borderRight: "1px solid #aaa",
                backgroundColor: "#fff",
              }}
            >
              Order Details
            </div>
            <div style={{ clear: "both" }}></div>
          </div>

          {values.order ? (
            <OrderDetailsTable
              values={values}
              grouping={grouping}
              pricing={pricing}
            />
          ) : (
            <p className="text-danger">No products under this code</p>
          )}

          <div style={{ margin: "20px 0" }} id="non-printable">
            Group By:{" "}
            <Button onClick={() => handleGroup("def")}>Default</Button>
            <Button onClick={() => handleGroup("cat")}>Category</Button> Price
            By: <Button onClick={() => handlePrice("def")}>Default</Button>
            <Button onClick={() => handlePrice("sup")}>Supplier</Button>
            <Button
              type="primary"
              onClick={() => window.print()}
              style={{ marginLeft: 10 }}
            >
              Print
            </Button>
          </div>

          {(values.order.orderStatus === "Not Processed" ||
            values.order.orderStatus === "Waiting Payment") && (
            <div id="non-printable">
              <Popconfirm
                className="btn btn-sm btn-block btn-outline-primary"
                value={values.order && values.order.orderedBy}
                title={`Editing this order will login you to ${
                  values.order &&
                  values.order.orderedBy &&
                  values.order.orderedBy.name
                } account`}
                onConfirm={() =>
                  logoutLogin(values.order && values.order.orderedBy)
                }
                onCancel={() => ""}
                okText="Proceed"
                cancelText="Cancel"
                style={{ marginBottom: 0 }}
              >
                Edit Order
              </Popconfirm>
            </div>
          )}

          <Button
            className="btn btn-sm btn-block btn-outline-primary"
            onClick={() => setIsModalVisible(true)}
            id="non-printable"
            style={{ marginTop: 3 }}
          >
            Update Status
          </Button>

          <OrderModal
            values={values}
            setValues={setValues}
            isModalVisible={isModalVisible}
            setIsModalVisible={setIsModalVisible}
            status={status}
            setStatus={setStatus}
          />
          <br />

          <div id="non-printable">
            <h4 style={{ margin: "20px 0" }}>Order History</h4>
            <OrderHistoryTable history={values.order.history} />
          </div>

          <div style={{ paddingBottom: 10 }} id="non-printable">
            <AddDomain />
          </div>
          <div align="center" id="printable">
            {estore.name}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
