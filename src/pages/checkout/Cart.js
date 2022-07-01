import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "antd";
import _ from "lodash";
import { toast } from "react-toastify";
import { CheckOutlined, LoginOutlined } from "@ant-design/icons";

import CartProductTable from "../../components/cart/CartProductTable";
import SummaryProducts from "../../components/common/checkout/SummaryProducts";
import SummaryCompute from "../../components/common/checkout/SummaryCompute";

import { userCart, emptyUserCart } from "../../functions/user";

const cartInitials = {
  subtotal: 0,
  delfee: 0,
  discount: 0,
  servefee: 0,
  grandTotal: 0,
};

const Cart = ({ history }) => {
  let dispatch = useDispatch();
  const { inputs, user } = useSelector((state) => ({ ...state }));
  const { cart, couponAmount } = inputs;

  let { minorder } = user.address ? user.address.addiv3 : {};

  const [cartCalculation, setCartCalculation] = useState(cartInitials);
  
  useEffect(() => {
    calculateCart();
  }, [cart, user]); // eslint-disable-line react-hooks/exhaustive-deps
  
  const getTotal = () => {
      return cart.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.count * nextValue.price;
      }, 0);
  };

  const calculateCart = () => {
    let {
      maxorder,
      delfee,
      delfeetype,
      discount,
      discounttype,
      servefee,
      servefeetype,
    } = user.address ? user.address.addiv3 : {};
    
    const subtotal = getTotal();
    let grandTotal = subtotal;
    
    if (discount > 0 && subtotal > 0) {
        discount = Number(
        discounttype === "%" ? (subtotal * discount) / 100 : discount
        );
    } else {
        discount = 0;
    }

    if (couponAmount > 0) discount = discount + couponAmount;

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

    setCartCalculation({ subtotal, delfee, discount, servefee, grandTotal });
  };

  const saveOrderToDb = () => {
    userCart(cart, user.token).then((res) => {
      if (res.data.cart) {
        let unique = _.uniqWith(res.data.cart, _.isEqual);
        dispatch({
          type: "INPUTS_OBJECT_X",
          payload: {cart: unique},
        });
        localStorage.setItem("cart", JSON.stringify(unique));
        history.push("/checkout");
      }
    });
  };

  const emptyCart = () => {
    dispatch({
          type: "INPUTS_OBJECT_X",
          payload: {cart: []},
    });
    if (typeof window !== "undefined") {
      localStorage.removeItem("cart");
    }
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
          <CartProductTable cart={cart} />
        </div>
        <div className="col-md-4 p-3 bg-white">
          <h4>Order Summary</h4>
          <hr />

          <SummaryProducts products={cart} />
          <hr />

          <SummaryCompute cartCalculation={cartCalculation} /><br />
          <hr />

          {user.token ? (
            <Button
              onClick={saveOrderToDb}
              type="primary"
              size="large"
              style={{ width: "100%" }}
              disabled={!cart.length || cartCalculation.subtotal < Number(minorder)}
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
          </Button><br /><br />
        </div>
      </div>
    </div>
  );
};

export default Cart;
