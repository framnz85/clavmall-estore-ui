import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "antd";
import { toast } from "react-toastify";
import _ from "lodash";
import { getUserCart, saveUserAddress, applyCoupon } from "../functions/user";
import { getAllMyAddiv1 } from "../functions/addiv1";
import CountrySelect from "../components/checkout/CountrySelect";
import Addiv1Select from "../components/checkout/Addiv1Select";
import Addiv2Select from "../components/checkout/Addiv2Select";
import Addiv3Select from "../components/checkout/Addiv3Select";
import AddressDetailsInput from "../components/checkout/AddressDetailsInput";
import OrderSummary from "../components/checkout/OrderSummary";

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

  const { estore, user } = useSelector((state) => ({
    ...state,
  }));

  const [products, setProducts] = useState([]);
  const [addiv1s, setAddiv1s] = useState([]);
  const [addiv2s, setAddiv2s] = useState([]);
  const [addiv3s, setAddiv3s] = useState([]);
  const [address, setAddress] = useState(initialAddress);
  const [addressSaved, setAddressSaved] = useState(false);

  const [coupon, setCoupon] = useState("");
  const [cartCalculation, setCartCalculation] = useState(cartInitials);
  const [discountError, setDiscountError] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUserCart(user.token).then((res) => {
      setProducts(res.data.products);
      setCartCalculation({
        subtotal: res.data.cartTotal,
        delfee: res.data.delfee,
        discount: res.data.discount,
        servefee: res.data.servefee,
        grandTotal: res.data.grandTotal,
      });
    });
    loadAllMyCountry();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadAllMyCountry = () => {
    dispatch({
      type: "LOCATION_LIST",
      payload: { countries: [estore.country] },
    });
    getAllMyAddiv1(estore.country._id, estore.country.countryCode).then(
      (res) => {
        dispatch({
          type: "LOCATION_LIST",
          payload: { addiv1s: res.data },
        });
      }
    );
  };

  const saveAddressToDb = () => {
    saveUserAddress(user.token, address).then((res) => {
      setCartCalculation(res.data.cartCalculation);
      if (res.data.addiv3) {
        setAddressSaved(true);
        setDiscountError("");
        toast.success("Address saved");

        dispatch({
          type: "USER_UPDATE_ADDRESS",
          payload: {
            ...user,
            address: { ...address, addiv3: res.data.addiv3 },
          },
        });
      }
    });
  };

  const applyDiscountCoupon = () => {
    applyCoupon(user.token, coupon).then((res) => {
      if (res.data.err) {
        setDiscountError(res.data.err);
      } else if (res.data) {
        setCartCalculation({
          ...cartCalculation,
          discount: res.data.discount,
          grandTotal: res.data.grandTotal,
        });
        toast.success("Discount successfully placed");
      }
    });
  };

  return (
    <div className="container">
      <div className="row mt-4">
        <div className="col-md-7 p-3 mr-3 bg-white">
          <h4>Delivery Address</h4>
          <br />
          <div className="form-group">
            <label>
              <b>Country</b>
            </label>
            <CountrySelect
              address={address}
              loading={loading}
              setAddress={setAddress}
              setAddiv1s={setAddiv1s}
              setAddiv2s={setAddiv2s}
              setAddiv3s={setAddiv3s}
              setLoading={setLoading}
              setAddressSaved={setAddressSaved}
            />
          </div>
          {estore.country && estore.country.adDivName1 && (
            <div className="form-group">
              <label>
                <b>{estore.country.adDivName1}</b>
              </label>
              <Addiv1Select
                address={address}
                loading={loading}
                addiv1s={addiv1s}
                setAddress={setAddress}
                setAddiv2s={setAddiv2s}
                setLoading={setLoading}
                setAddressSaved={setAddressSaved}
              />
            </div>
          )}
          {estore.country && estore.country.adDivName1 && (
            <div className="form-group">
              <label>
                <b>{estore.country.adDivName2}</b>
              </label>
              <Addiv2Select
                address={address}
                loading={loading}
                addiv1s={addiv1s}
                addiv2s={addiv2s}
                setAddress={setAddress}
                setAddiv3s={setAddiv3s}
                setLoading={setLoading}
                setAddressSaved={setAddressSaved}
              />
            </div>
          )}
          {estore.country && estore.country.adDivName1 && (
            <div className="form-group">
              <label>
                <b>{estore.country.adDivName3}</b>
              </label>
              <Addiv3Select
                address={address}
                loading={loading}
                addiv3s={addiv3s}
                setAddress={setAddress}
                setAddressSaved={setAddressSaved}
              />
            </div>
          )}
          <label>
            <b>Block/Lot/Room No./Street/Subdivision</b>
          </label>
          <AddressDetailsInput
            address={address}
            setAddress={setAddress}
            setAddressSaved={setAddressSaved}
          />
          <br />
          <Button
            type="primary"
            onClick={saveAddressToDb}
            disabled={
              addressSaved ||
              loading ||
              _.isEmpty(address.country) ||
              _.isEmpty(address.addiv1) ||
              _.isEmpty(address.addiv2) ||
              _.isEmpty(address.addiv3) ||
              address.details.length < 1
            }
            size="large"
          >
            Save Address
          </Button>

          <br />
          <br />
          <br />
          <hr />
          <h4>Got Coupon?</h4>
          <input
            type="text"
            className="form-control"
            value={coupon}
            onChange={(e) => {
              setCoupon(e.target.value);
              if (addressSaved) {
                setDiscountError("");
              } else {
                setDiscountError("Click Save Address first");
              }
            }}
            placeholder="Enter coupon"
          />
          {discountError && (
            <div className="text-danger mt-2">{discountError}</div>
          )}
          <br />
          <Button
            type="primary"
            onClick={applyDiscountCoupon}
            disabled={loading || coupon.length < 2 || !addressSaved}
            size="large"
          >
            Apply
          </Button>
        </div>
        <OrderSummary
          history={history}
          products={products}
          cartCalculation={cartCalculation}
          addressSaved={addressSaved}
        />
      </div>
      <br />
      <br />
      <br />
    </div>
  );
};

export default Checkout;
