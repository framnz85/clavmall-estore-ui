import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LoadingOutlined, DoubleLeftOutlined } from "@ant-design/icons";
import NumberFormat from "react-number-format";
import { Popconfirm } from "antd";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";

import AdminNav from "../../../components/nav/AdminNav";
import AddDomain from "../../../components/common/addDomain";

import { getCart } from "../../../functions/admin";
import { currentUser, loginAsAuthToken } from "../../../functions/auth";
import filterProductsAddress from "../../../components/common/filterProductsAddress";

const initialState = {
  products: [],
  cartTotal: 0,
  orderedBy: {},
};

const AddToCartDetails = ({ match }) => {
  let dispatch = useDispatch();
  let history = useHistory();
  const cartid = match.params.cartid;

  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState(initialState);

  const { user, estore } = useSelector((state) => ({
    ...state,
  }));

  const { products, cartTotal, orderedBy } = values;

  useEffect(() => {
    loadProducts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadProducts = () => {
    setLoading(true);
    getCart(cartid, user.token).then((res) => {
      setValues({
        ...values,
        products: res.data[0].products,
        cartTotal: res.data[0].cartTotal,
        orderedBy: res.data[0].orderedBy,
      });
      setLoading(false);
    });
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
            if (res.data.err) {
              toast.error(res.data.err);
            } else {
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
              handleCopyOrder(products);
            }
          });
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const handleCopyOrder = (products) => {
    let productsToCopy = products.map((p) => {
      return { ...p.product, count: p.count, variant: p.variant };
    });
    const productsToCart = filterProductsAddress(productsToCopy, user.address);
    dispatch({
      type: "INPUTS_OBJECT_XIV",
      payload: { cart: productsToCart },
    });
    localStorage.setItem("cart", JSON.stringify(productsToCart));
    history.push("/cart");
  };

  return (
    <div className="container">
      <div align="center" id="printable">
        {estore.name}
      </div>
      <div className="row">
        <div className="col-m-2" id="non-printable">
          <AdminNav />
        </div>
        <div className="col-md-10 bg-white mt-3 mb-5">
          <h4 style={{ margin: "20px 0" }}>
            {loading ? (
              <LoadingOutlined />
            ) : (
              <>
                <Link to="/admin/dashboard">
                  <DoubleLeftOutlined style={{ cursor: "pointer" }} />
                </Link>{" "}
                {`Cart ID ${cartid}`}
              </>
            )}
          </h4>
          <div>
            <div style={{ marginBottom: 10 }}>
              <div style={{ width: "50%", float: "left" }}>
                <b>Ordered By:</b>{" "}
                {orderedBy && orderedBy.name ? orderedBy.name : ""}
              </div>
              <div style={{ width: "50%", float: "right" }}>
                <b>Phone:</b> {orderedBy && orderedBy.phone}
                <br />
              </div>
              <div style={{ clear: "both" }}></div>
            </div>
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
                {products &&
                  products.map((p, i) => {
                    const variant = p.product.variants.filter(
                      (v) => v._id === p.variant
                    )[0];
                    return (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>
                          {p.product && p.product.title} (
                          {variant && variant.name})
                        </td>
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
                  <td>Cart Total</td>
                  <td>
                    <NumberFormat
                      value={cartTotal.toFixed(2)}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={"₱"}
                    />
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <Popconfirm
            className="btn btn-sm btn-block btn-outline-primary"
            value={orderedBy}
            title={`Proceeding this order will login you to ${
              orderedBy && orderedBy.name
            } account`}
            onConfirm={() => logoutLogin(orderedBy)}
            onCancel={() => ""}
            okText="Proceed"
            cancelText="Cancel"
            style={{ marginBottom: 0 }}
          >
            Manual Proceeding Order
          </Popconfirm>

          <div style={{ paddingBottom: 10 }}>
            <AddDomain />
          </div>
        </div>
        <div className="col-m-2 m-5" id="printable">
          <div style={{ marginTop: 90 }}>Remarks</div>
        </div>
      </div>
    </div>
  );
};

export default AddToCartDetails;
