import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "antd";
import _ from "lodash";
import { toast } from "react-toastify";
import { isMobile } from 'react-device-detect';
import { CheckOutlined, LoginOutlined, FormOutlined, DeleteOutlined } from "@ant-design/icons";

import CartProductTable from "../../components/cart/CartProductTable";
import SummaryProducts from "../../components/common/checkout/SummaryProducts";
import SummaryCompute from "../../components/common/checkout/SummaryCompute";
import CustomerInfo from "../../components/modal/CustomerInfo";
import ItemsForYou from "../../components/home/ItemsForYou";
import EmptyCart from "../../components/modal/EmptyCart";
import CartButton from "../../components/nav/CartButton";

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
  const { inputs, user, estore } = useSelector((state) => ({ ...state }));
  const { cart, couponAmount } = inputs;

  let { minorder=0 } = user.address && user.address.addiv3 ? user.address.addiv3 : {};

  const [cartCalculation, setCartCalculation] = useState(cartInitials);
  const [showCustomerInfo, setShowCustomerInfo] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    document.title = "Fill Cart at " + estore.name;
    calculateCart();
  }, [cart, user]); // eslint-disable-line react-hooks/exhaustive-deps
  
  const getTotal = () => {
      return cart.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.count * nextValue.price;
      }, 0);
  };

  const calculateCart = () => {
    let {
      maxorder=0,
      delfee=0,
      delfeetype="%",
      discount=0,
      discounttype="%",
      servefee=0,
      servefeetype="%",
    } = user.address && user.address.addiv3 ? user.address.addiv3 : {};
    
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
    if (user._id) {
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
    } else {
      setShowCustomerInfo(true);
    }
  };

  const emptyCart = () => {
    dispatch({
          type: "INPUTS_OBJECT_X",
          payload: {cart: []},
    });
    if (typeof window !== "undefined") {
      localStorage.removeItem("cart");
      localStorage.removeItem("order");
    }
    emptyUserCart(user.token).then(() => {
      toast.success("Cart is empty. Continue Shopping");
    });
    setEmpty(false);
  };

  return (
    <>
      <div className="container">
        <div className="row mt-4">
          <div className={isMobile ? "col-md-7 p-3 bg-white" : "col-md-7 p-3 mr-3 bg-white"}>
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

            {<CustomerInfo showCustomerInfo={showCustomerInfo} setShowCustomerInfo={setShowCustomerInfo} />}
            
            {!user.token && (
              <>
                <Link
                  to={{
                    pathname: "/login",
                    state: { from: "cart" },
                  }}
                >
                  <Button type="secondary" size="large" style={{ width: "100%", marginTop: "15px" }}>
                    <LoginOutlined />
                    Login to Checkout
                  </Button>
                </Link>
                <Link
                  to={{
                    pathname: "/register",
                    state: { from: "cart" },
                  }}
                >
                  <Button type="secondary" size="large" style={{ width: "100%", marginTop: "15px" }}>
                    <FormOutlined />
                    Register to Checkout
                  </Button>
                </Link>
              </>
            )}
            <Button
              type="secondary"
              onClick={() => setEmpty(true)}
              disabled={!cart.length}
              size="large"
              style={{ width: "100%", marginTop: "15px" }}
            >
              <DeleteOutlined /> Empty Cart
            </Button><br /><br />
          </div>
        </div>
        <EmptyCart empty={empty} setEmpty={setEmpty} emptyCart={emptyCart} />
      </div>
      <div className="container" style={{paddingBottom: 40, paddingRight: isMobile ? 0 : ""}}>
        <div className="row mt-4" style={{marginRight: isMobile ? 0 : 65}}>
          <div className="col p-3 bg-white">
            {estore.name && <ItemsForYou loading={loading} setLoading={setLoading} loadFromCart={true} />}
          </div>
        </div>
      </div>
      <CartButton
        saveOrderToDb={saveOrderToDb}
        cart={cart}
        cartCalculation={cartCalculation}
        minorder={minorder}
      />
    </>
  );
};

export default Cart;
