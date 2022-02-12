import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "antd";
import _ from "lodash";
import { toast } from "react-toastify";
import { CheckOutlined, LoginOutlined } from "@ant-design/icons";
import ProductCardInCheckout from "../components/cards/ProductCardInCheckout";
import { userCart } from "../functions/user";
import ProductTable from "../components/checkout/ProductTable";
import { emptyUserCart } from "../functions/user";

const Cart = ({ history }) => {
  let dispatch = useDispatch();
  const { cart, user } = useSelector((state) => ({ ...state }));

  let {
    minorder,
    maxorder,
    delfee,
    delfeetype,
    discount,
    discounttype,
    servefee,
    servefeetype,
    deltime,
    deltimetype,
  } = user.address ? user.address.addiv3 : {};

  const getTotal = () => {
    return cart.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.count * nextValue.price;
    }, 0);
  };

  const subtotal = getTotal();
  let grandTotal = subtotal;

  if (discount > 0 && subtotal > 0) {
    discount = Number(
      discounttype === "%" ? (subtotal * discount) / 100 : discount
    );
  } else {
    discount = 0;
  }

  if (delfee > 0 && subtotal > 0) {
    delfee =
      subtotal < maxorder
        ? Number(delfeetype === "%" ? (subtotal * delfee) / 100 : delfee)
        : 0;
  } else {
    delfee = 0;
  }

  if (servefee > 0 && subtotal > 0) {
    servefee = Number(
      servefeetype === "%" ? (subtotal * servefee) / 100 : servefee
    );
  } else {
    servefee = 0;
  }

  if (discount > 0) {
    grandTotal = grandTotal - discount;
  }

  if (delfee > 0) {
    grandTotal = grandTotal + delfee;
  }

  if (servefee > 0) {
    grandTotal = grandTotal + servefee;
  }

  const saveOrderToDb = () => {
    userCart(cart, user.token).then((res) => {
      if (res.data.cart) {
        let unique = _.uniqWith(res.data.cart, _.isEqual);
        localStorage.setItem("cart", JSON.stringify(unique));

        dispatch({
          type: "ADD_TO_CART",
          payload: unique,
        });

        history.push("/checkout");
      }
    });
  };

  const showCartItems = () => (
    <table className="table table-bordered">
      <thead className="thead-light">
        <tr align="center">
          <th scope="col">Image</th>
          <th scope="col">Title</th>
          <th scope="col">Price</th>
          <th scope="col">Quantity</th>
          <th scope="col">Variant</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      {cart &&
        cart.map((p) => (
          <ProductCardInCheckout key={p._id + p.variant} p={p} />
        ))}
    </table>
  );

  const emptyCart = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("cart");
    }
    dispatch({
      type: "ADD_TO_CART",
      payload: [],
    });
    emptyUserCart(user.token).then((res) => {
      toast.success("Cart is empty. Continue Shopping");
    });
  };

  return (
    <div className="container">
      <div className="row mt-4">
        <div className="col-md-7 p-3 mr-3 bg-white">
          <h4>Cart ({cart && cart.length})</h4>
          <hr />
          {!cart.length ? (
            <p>
              No products in cart. <Link to="/shop">Continue Shopping.</Link>
            </p>
          ) : (
            showCartItems()
          )}
        </div>
        <div className="col-md-4 p-3 bg-white">
          <h4>Order Summary</h4>
          <hr />

          <ProductTable products={cart} />

          <hr />
          <table>
            <tbody>
              <tr>
                <td className="col">Sub Total:</td>
                <td align="right" className="col">
                  <b>₱{Number(subtotal).toFixed(2)}</b>
                </td>
              </tr>
              {delfee > 0 && (
                <>
                  <tr>
                    <td className="col">Delivery Fee:</td>
                    <td align="right" className="col">
                      <b>₱{Number(delfee).toFixed(2)}</b>
                    </td>
                  </tr>
                </>
              )}
              {servefee > 0 && (
                <>
                  <tr>
                    <td className="col">Service Fee:</td>
                    <td align="right" className="col">
                      <b>₱{Number(servefee).toFixed(2)}</b>
                    </td>
                  </tr>
                </>
              )}
              {discount > 0 && (
                <tr>
                  <td className="col">Discount:</td>
                  <td align="right" className="col">
                    <b>- ₱{Number(discount).toFixed(2)}</b>
                  </td>
                </tr>
              )}

              <tr>
                <td className="col" style={{ paddingTop: "20px" }}>
                  <h5>Grand Total:</h5>
                </td>
                <td
                  align="right"
                  className="col"
                  style={{ paddingTop: "20px" }}
                >
                  <h5>
                    <b>₱{Number(grandTotal).toFixed(2)}</b>
                  </h5>
                </td>
              </tr>
              {deltime > 0 && (
                <tr>
                  <td align="center" colSpan={2} className="text-success">
                    {`(Delivers in ${deltime} ${deltimetype} )`}
                  </td>
                </tr>
              )}
              {subtotal >= Number(minorder) && subtotal < Number(maxorder) && (
                <tr>
                  <td align="center" colSpan={2} className="alert text-danger">
                    * Free Delivery of at least ₱{Number(maxorder).toFixed(2)}{" "}
                    <b>Sub Total</b>
                    <Link to="/shop">
                      {" "}
                      <Button type="danger" shape="round" size="large">
                        Shop More
                      </Button>
                    </Link>
                  </td>
                </tr>
              )}
              {subtotal < Number(minorder) && (
                <tr>
                  <td colSpan={2} className="alert text-danger">
                    * <b>Sub Total</b> should be at least ₱
                    {Number(minorder).toFixed(2)} to continue
                    <Link to="/shop">
                      {" "}
                      <Button
                        type="danger"
                        size="large"
                        style={{ width: "100%" }}
                      >
                        Shop More
                      </Button>
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <br />
          <hr />

          {user.token ? (
            <Button
              onClick={saveOrderToDb}
              type="primary"
              size="large"
              style={{ width: "100%" }}
              disabled={!cart.length || subtotal < Number(minorder)}
            >
              <CheckOutlined />
              Proceed to Checkout
            </Button>
          ) : (
            <Link
              to={{
                pathname: "/login",
                state: { from: "cart" },
              }}
            >
              <Button type="primary" size="large" style={{ width: "100%" }}>
                <LoginOutlined />
                Login to Checkout
              </Button>
            </Link>
          )}
          <Button
            type="secondary"
            onClick={emptyCart}
            disabled={!cart.length}
            size="large"
            style={{ width: "100%", marginTop: "15px" }}
          >
            Empty Cart
          </Button>
        </div>
      </div>
      <br />
      <br />
      <br />
    </div>
  );
};

export default Cart;
