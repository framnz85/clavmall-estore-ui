import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import { Button } from "antd";
import { toast } from "react-toastify";

import CountrySelect from "../modal/location/CountrySelect";
import Addiv1Select from "../modal/location/Addiv1Select";
import Addiv2Select from "../modal/location/Addiv2Select";
import Addiv3Select from "../modal/location/Addiv3Select";
import SameAddress from "./SameAddress";

import { saveUserAddress, emptyUserCart } from "../../functions/user";
import { getAllMyCountry } from "../../functions/country";
import { updateOrder } from "../../functions/order";

const initialHomeAddress = {
    details: "",
    country: {},
    addiv1: {},
    addiv2: {},
    addiv3: {},
};

const HomeAddress = ({
    address,
    setCartCalculation,
    setAddressSaved,
    setDiscountError,
    loading,
    setLoading,
    addressError,
    setAddressError,
    coupon
}) => {
    let dispatch = useDispatch();

    const { estore, user, location } = useSelector((state) => ({
        ...state,
    }));
    
    const [countries, setCountries] = useState([]);
    const [addiv1s, setAddiv1s] = useState([]);
    const [addiv2s, setAddiv2s] = useState([]);
    const [addiv3s, setAddiv3s] = useState([]);
    const [homeAddress, setHomeAddress] = useState(initialHomeAddress);
    const [addInstruct, setAddInstruct] = useState("");
    const [order, setOrder] = useState({});

    useEffect(() => {
        loadAllMyCountry();
        user.addInstruct && setAddInstruct(user.addInstruct);
        user.homeAddress && setHomeAddress(user.homeAddress);
        if (localStorage.getItem("order")) {
            setOrder(JSON.parse(localStorage.getItem("order")));
        }
    }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

    const loadAllMyCountry = () => {
        if (location.countries.length > 0) {
        setCountries(location.countries);
        }else{
        getAllMyCountry().then((res) => {
            dispatch({
                type: "LOCATION_LIST_II",
                payload: { countries: res.data },
            });
            setCountries(res.data);
        });
        }
    };

    const saveAddressToDb = () => {
        let errorActive = false;
        let errorList = {
            details: "",
            homeCountry: "",
            homeAddiv1: "",
            homeAddiv2: "",
            homeAddiv3: "",
            homeDetails: ""
        }
        if (!address.details) {
            errorActive = true;
            errorList = {...errorList, details: "Delivery details is needed"}
        }
        if(_.isEmpty(homeAddress.country)) {
            errorActive = true;
            errorList = {...errorList, homeCountry: "Home Country is required"}
        }
        if(_.isEmpty(homeAddress.addiv1)) {
            errorActive = true;
            errorList = {...errorList, homeAddiv1: " is required"}
        }
        if(_.isEmpty(homeAddress.addiv2)) {
            errorActive = true;
            errorList = {...errorList, homeAddiv2: " is required"}
        }
        if(_.isEmpty(homeAddress.addiv3)) {
            errorActive = true;
            errorList = {...errorList, homeAddiv3: " is required"}
        }
        if(homeAddress.details.length < 1) {
            errorActive = true;
            errorList = {...errorList, homeDetails: "Home details is required"}
        }
        
        setAddressError({
            ...addressError,
            ...errorList
        })
        
        if (!errorActive) {
            saveUserAddress(user.token, address, homeAddress, coupon, addInstruct).then((res) => {
                setCartCalculation(res.data.cartCalculation);
            if (res.data.addiv3) {
                setAddressSaved(true);
                setDiscountError("");
                toast.success("Address saved");

                dispatch({
                    type: "LOGGED_IN_USER_VI",
                    payload: {
                        ...user,
                        address: { ...user.address, addiv3: res.data.addiv3 },
                        homeAddress,
                        addInstruct
                    },
                });

                if (order._id) {
                    updateOrder(order._id, user.token).then(() => {
                        dispatch({
                            type: "INPUTS_OBJECT_XII",
                            payload: {cart: []},
                        });
                        if (typeof window !== undefined) {
                            localStorage.removeItem("cart");
                            localStorage.removeItem("order");
                        }
                        emptyUserCart(user.token).then();
                        window.location.href = '/user/orders';
                    })
                }
            }
            });
        } else {
            toast.error("Make sure to completely fill your Delivery and Home Addresses")
        }
    };
    
    return (
        <>
            <h4>Home Address</h4>
            <SameAddress
                address={address}
                setAddiv1s={setAddiv1s}
                setAddiv2s={setAddiv2s}
                setAddiv3s={setAddiv3s}
                setLoading={setLoading}
                homeAddress={homeAddress}
                setHomeAddress={setHomeAddress}
                initialHomeAddress={initialHomeAddress}
                setAddressSaved={setAddressSaved}
            />
            <br />
            <br />
            <div className="form-group">
                <label>
                <b>Country</b>
                </label>
                <CountrySelect
                    address={homeAddress}
                    setAddress={setHomeAddress}
                    countries={countries}
                    setAddiv1s={setAddiv1s}
                    setAddiv2s={setAddiv2s}
                    setAddiv3s={setAddiv3s}
                    loading={loading}
                    setLoading={setLoading}
                    sourceAddress={user.homeAddress}
                    setAddressSaved={setAddressSaved}
                />
                {addressError.homeCountry && (
                    <div className="text-danger mt-2">{addressError.homeCountry}</div>
                )}
            </div>
            {estore.country && estore.country.adDivName1 && (
                <div className="form-group">
                    <label>
                        <b>{estore.country.adDivName1}</b>
                    </label>
                    <Addiv1Select
                        address={homeAddress}
                        setAddress={setHomeAddress}
                        countries={countries}
                        addiv1s={addiv1s}
                        setAddiv2s={setAddiv2s}
                        loading={loading}
                        setLoading={setLoading}
                        setAddressSaved={setAddressSaved}
                    />
                    {addressError.homeAddiv1 && (
                        <div className="text-danger mt-2">{
                            `Home ${estore.country.adDivName1} ${addressError.homeAddiv1}`
                        }</div>
                    )}
                </div>
            )}
            {estore.country && estore.country.adDivName2 && (
                <div className="form-group">
                    <label>
                        <b>{estore.country.adDivName2}</b>
                    </label>
                    <Addiv2Select
                        address={homeAddress}
                        setAddress={setHomeAddress}
                        countries={countries}
                        addiv1s={addiv1s}
                        addiv2s={addiv2s}
                        setAddiv3s={setAddiv3s}
                        loading={loading}
                        setLoading={setLoading}
                        setAddressSaved={setAddressSaved}
                    />
                    {addressError.homeAddiv2 && (
                        <div className="text-danger mt-2">{
                            `Home ${estore.country.adDivName2} ${addressError.homeAddiv2}`
                        }</div>
                    )}
                </div>
            )}
            {estore.country && estore.country.adDivName3 && (
                <div className="form-group">
                    <label>
                        <b>{estore.country.adDivName3}</b>
                    </label>
                    <Addiv3Select
                        address={homeAddress}
                        setAddress={setHomeAddress}
                        addiv3s={addiv3s}
                        loading={loading}
                        setAddressSaved={setAddressSaved}
                    />
                    {addressError.homeAddiv3 && (
                        <div className="text-danger mt-2">{
                            `Home ${estore.country.adDivName3} ${addressError.homeAddiv3}`
                        }</div>
                    )}
                </div>
            )}
            <label>
                <b>Block/Lot/Room No./Street/Subdivision</b>
            </label>
            <input
                type="text"
                name="address"
                className="form-control"
                value={homeAddress.details ? homeAddress.details : ""}
                onChange={(e) => {
                    setAddressSaved(false);
                    setHomeAddress({ ...homeAddress, details: e.target.value });
                }}
                placeholder="Place here"
            />
            {addressError.homeDetails && (
                <div className="text-danger mt-2">{addressError.homeDetails}</div>
            )}
            <br /><br />
            <h4>Additional Instructions (to Seller And Delivery Crew)</h4>
            <input
                type="text"
                name="addInstruct"
                className="form-control"
                value={addInstruct}
                onChange={(e) => {
                    setAddressSaved(false);
                    setAddInstruct(e.target.value);
                }}
                placeholder="Ex. landmarks, gate color, name of the store near you, etc."
            /><br /><br />
            <div>
                <Button
                    type="primary"
                    onClick={saveAddressToDb}
                    disabled={
                        loading ||
                        _.isEmpty(address.country) ||
                        _.isEmpty(address.addiv1) ||
                        _.isEmpty(address.addiv2) ||
                        _.isEmpty(address.addiv3)
                    }
                    size="large"
                >
                    {order._id ? "Save Order Changes" : "Save Addresses"}
                </Button>
            </div>
            <br /><br /><br />
        </>
    );
}
 
export default HomeAddress;