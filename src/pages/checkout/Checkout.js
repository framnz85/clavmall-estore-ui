import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "antd";
import { RollbackOutlined } from "@ant-design/icons";

import GotCoupon from "../../components/checkout/GotCoupon";
import DeliveryAddress from "../../components/checkout/DeliveryAddress";
import HomeAddress from "../../components/checkout/HomeAddress";
import PaymentOption from "../../components/checkout/PaymentOption";
import SummaryProducts from "../../components/common/checkout/SummaryProducts";
import SummaryCompute from "../../components/common/checkout/SummaryCompute";

import { getUserCart } from "../../functions/user";
import { getAllMyAddiv1 } from "../../functions/addiv1";

const initialAddress = {
  details: "",
  country: {},
  addiv1: {},
  addiv2: {},
  addiv3: {},
};

const cartInitials = {
  subtotal: 0,
  delfee: 0,
  discount: 0,
  servefee: 0,
  grandTotal: 0,
};

const Checkout = ({ history }) => {
  let dispatch = useDispatch();

  const { estore, user, inputs } = useSelector((state) => ({
    ...state,
  }));

  const [products, setProducts] = useState([]);
  const [address, setAddress] = useState(initialAddress);
  const [addressSaved, setAddressSaved] = useState(false);
  const [cartCalculation, setCartCalculation] = useState(cartInitials);
  const [cartDefault, setCartDefault] = useState({ discount: 0, grandTotal: 0 });
  const [coupon, setCoupon] = useState("");
  const [discountError, setDiscountError] = useState("");
  const [addressError, setAddressError] = useState({
      details: "",
      homeCountry: "",
      homeAddiv1: "",
      homeAddiv2: "",
      homeAddiv3: "",
      homeDetails: ""
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Checkout at " + estore.name;
    user.token && loadUserCart();
    loadAllMyCountry();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadUserCart = () => {
    const { country, addiv3 } = user.address;
    getUserCart(user.token, country.countryCode, addiv3._id).then((res) => {
      setProducts(res.data.products);
      setCartDefault({
        ...cartDefault,
        discount: res.data.discount,
      });
      setCartCalculation({
        subtotal: res.data.cartTotal,
        delfee: res.data.delfee,
        discount: res.data.discount + inputs.couponAmount,
        servefee: res.data.servefee,
        grandTotal: res.data.grandTotal - inputs.couponAmount,
      });
    });
  }

  const loadAllMyCountry = () => {
    dispatch({
      type: "LOCATION_LIST_VII",
      payload: { countries: [estore.country] },
    });
    getAllMyAddiv1(estore.country._id, estore.country.countryCode).then(
      (res) => {
        dispatch({
          type: "LOCATION_LIST_VII",
          payload: { addiv1s: res.data },
        });
      }
    );
  };

  return (
    <div className="container">
      <div className="row mt-4">
        <div className="col-md-7 p-3 mr-3 bg-white">

          <GotCoupon
            cartDefault={cartDefault}
            discountError={discountError}
            setDiscountError={setDiscountError}
            cartCalculation={cartCalculation}
            setCartCalculation={setCartCalculation}
            setAddressSaved={setAddressSaved}
            loading={loading}
            coupon={coupon}
            setCoupon={setCoupon}
          />

          <DeliveryAddress
            address={address}
            setAddress={setAddress}
            setAddressSaved={setAddressSaved}
            addressError={addressError}
          />

          <HomeAddress
            address={address}
            setCartCalculation={setCartCalculation}
            setAddressSaved={setAddressSaved}
            setDiscountError={setDiscountError}
            loading={loading}
            setLoading={setLoading}
            addressError={addressError}
            setAddressError={setAddressError}
            coupon={coupon}
          />

          <PaymentOption
            products={products}
            addressSaved={addressSaved}
            cartCalculation={cartCalculation}
          />

        </div>

        <div className="col-md-4 p-3 bg-white">
          <h4>Order Summary</h4>
          <hr />

          <SummaryProducts products={products} />
          <hr />

          <SummaryCompute cartCalculation={cartCalculation} />

          <div className="container">
            <div className="row mt-4">
              <Button
                type="secondary"
                onClick={() => history.push("/cart")}
                size="large"
                style={{ width: "100%", marginTop: "15px" }}
              >
                <RollbackOutlined />
                Back to Cart
              </Button>
            </div>
          </div>
        </div>

      </div><br /><br /><br />
    </div>
  );
};

export default Checkout;
