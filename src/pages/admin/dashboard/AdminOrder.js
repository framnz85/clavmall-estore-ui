import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import NumberFormat from "react-number-format";
import { LoadingOutlined } from "@ant-design/icons";
import { PDFDownloadLink } from "@react-pdf/renderer";
import AdminNav from "../../../components/nav/AdminNav";
import { getOrders } from "../../../functions/admin";
import Invoice from "../../../components/pdf/Invoice";

const AdminOrder = ({ match }) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const [historyChild, setHistoryChild] = useState([]);

  const { user, history } = useSelector((state) => ({
    ...state,
  }));

  useEffect(() => {
    loadProducts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadProducts = () => {
    const orderedProducts =
      history.orders &&
      history.orders.filter((order) => order._id === match.params.orderid);
    if (orderedProducts && orderedProducts.length > 0) {
      setHistoryChild(orderedProducts[0]);
    } else {
      setLoading(true);
      getOrders(user.token).then((res) => {
        setHistoryChild(
          res.data.filter((order) => order._id === match.params.orderid)[0]
        );
        dispatch({
          type: "DASHBOARD_LIST",
          payload: { ...history, orders: res.data },
        });
        setLoading(false);
      });
    }
  };

  const showProductsInTable = () => {
    return (
      <>
        <span>Status: {historyChild.orderStatus}</span>
        <table className="table table-bordered">
          <thead className="thead-light">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Product</th>
              <th scope="col">Price</th>
              <th scope="col">Quantity</th>
              <th scope="col">Total</th>
            </tr>
          </thead>
          <tbody>
            {historyChild.products &&
              historyChild.products.map((p, i) => {
                return (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{p.product.title}</td>
                    <td>
                      <NumberFormat
                        value={p.price.toFixed(2)}
                        displayType={"text"}
                        thousandSeparator={true}
                        prefix={"₱"}
                      />
                    </td>
                    <td>{p.count}</td>
                    <td>
                      <NumberFormat
                        value={(p.price * p.count).toFixed(2)}
                        displayType={"text"}
                        thousandSeparator={true}
                        prefix={"₱"}
                      />
                    </td>
                  </tr>
                );
              })}
          </tbody>
          <tfoot style={{ borderTop: "1px" }}>
            <tr>
              <td colSpan={3}></td>
              <td>Sub Total</td>
              <td>
                <NumberFormat
                  value={
                    historyChild.cartTotal && historyChild.cartTotal.toFixed(2)
                  }
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"₱"}
                />
              </td>
            </tr>
            <tr>
              <td colSpan={3}></td>
              <td>Delivery Fee</td>
              <td>
                <NumberFormat
                  value={historyChild.delfee && historyChild.delfee.toFixed(2)}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"₱"}
                />
              </td>
            </tr>
            <tr>
              <td colSpan={3}></td>
              <td>Service Fee</td>
              <td>
                <NumberFormat
                  value={
                    historyChild.servefee && historyChild.servefee.toFixed(2)
                  }
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"₱"}
                />
              </td>
            </tr>
            <tr>
              <td colSpan={3}></td>
              <td>Discount</td>
              <td>
                -{" "}
                <NumberFormat
                  value={
                    historyChild.discount && historyChild.discount.toFixed(2)
                  }
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"₱"}
                />
              </td>
            </tr>
            <tr>
              <td colSpan={3}></td>
              <td>
                <b>Grand Total</b>
              </td>
              <td>
                <b>
                  <NumberFormat
                    value={
                      historyChild.grandTotal &&
                      historyChild.grandTotal.toFixed(2)
                    }
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"₱"}
                  />
                </b>
              </td>
            </tr>
          </tfoot>
        </table>
      </>
    );
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-m-2">
          <AdminNav />
        </div>
        <div className="col-md-10 bg-white mt-3 mb-5">
          <h4 style={{ margin: "20px 0" }}>
            Order Details (Code: {match.params.orderid})
          </h4>
          {historyChild ? (
            showProductsInTable()
          ) : (
            <p className="text-danger">No products under this code</p>
          )}

          {historyChild._id && (
            <PDFDownloadLink
              document={<Invoice order={historyChild} />}
              fileName={`order-${historyChild._id}.pdf`}
              className="btn btn-sm btn-block btn-outline-primary"
            >
              Download PDF
            </PDFDownloadLink>
          )}

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

export default AdminOrder;
