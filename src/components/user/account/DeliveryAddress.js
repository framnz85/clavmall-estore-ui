import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import CountrySelect from "../../modal/location/CountrySelect";
import Addiv1Select from "../../modal/location/Addiv1Select";
import Addiv2Select from "../../modal/location/Addiv2Select";
import Addiv3Select from "../../modal/location/Addiv3Select";
import { getAllMyCountry } from "../../../functions/country";

const DeliveryAddress = ({values, setValues, loading, setLoading, addressError}) => {
    let dispatch = useDispatch();

    const { user, location, estore } = useSelector((state) => ({ ...state }));
  
    const [countries, setCountries] = useState([]);
    const [addiv1s, setAddiv1s] = useState([]);
    const [addiv2s, setAddiv2s] = useState([]);
    const [addiv3s, setAddiv3s] = useState([]);
    const [address, setAddress] = useState(values.address);

    useEffect(() => {
        loadAllMyCountry();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const loadAllMyCountry = () => {
        if (location.countries && location.countries.length > 0) {
            setCountries(location.countries);
        }else{
            getAllMyCountry().then((res) => {
                setCountries(res.data);
                dispatch({
                    type: "LOCATION_LIST_VIII",
                    payload: { countries: res.data },
                });
            });
        }
    };

    useEffect(() => {
        setValues({ ...values, address });
    }, [address]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            <div className="form-group">
                <label>
                    <b>Country</b>
                </label>
                <CountrySelect
                    address={address}
                    setAddress={setAddress}
                    countries={countries}
                    setAddiv1s={setAddiv1s}
                    setAddiv2s={setAddiv2s}
                    setAddiv3s={setAddiv3s}
                    loading={loading}
                    setLoading={setLoading}
                    sourceAddress={user.address}
                    setAddressSaved={() => ""}
                />
                {addressError.address.country &&
                    <div className="text-danger mt-2">{addressError.address.country}</div>
                }
            </div>
            {estore.country && estore.country.adDivName1 && (
            <div className="form-group">
                <label>
                <b>{estore.country.adDivName1}</b>
                </label>
                <Addiv1Select
                    address={address}
                    setAddress={setAddress}
                    countries={countries}
                    addiv1s={addiv1s}
                    setAddiv2s={setAddiv2s}
                    loading={loading}
                    setLoading={setLoading}
                    setAddressSaved={() => ""}
                />
                {addressError.address.addiv1 && (
                    <div className="text-danger mt-2">{
                        `Delivery ${estore.country.adDivName1} ${addressError.address.addiv1}`
                    }</div>
                )}
            </div>
            )}
            {estore.country && estore.country.adDivName1 && (
            <div className="form-group">
                <label>
                <b>{estore.country.adDivName2}</b>
                </label>
                <Addiv2Select
                    address={address}
                    setAddress={setAddress}
                    countries={countries}
                    addiv1s={addiv1s}
                    addiv2s={addiv2s}
                    setAddiv3s={setAddiv3s}
                    loading={loading}
                    setLoading={setLoading}
                    setAddressSaved={() => ""}
                />
                {addressError.address.addiv2 && (
                    <div className="text-danger mt-2">{
                        `Delivery ${estore.country.adDivName2} ${addressError.address.addiv2}`
                    }</div>
                )}
            </div>
            )}
            {estore.country && estore.country.adDivName1 && (
            <div className="form-group">
                <label>
                <b>{estore.country.adDivName3}</b>
                </label>
                <Addiv3Select
                    address={address}
                    setAddress={setAddress}
                    addiv3s={addiv3s}
                    loading={loading}
                    setAddressSaved={() => ""}
                />
                {addressError.address.addiv3 && (
                    <div className="text-danger mt-2">{
                        `Delivery ${estore.country.adDivName3} ${addressError.address.addiv3}`
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
                value={address && address.details ? address.details : ""}
                onChange={(e) => setAddress({ ...address, details: e.target.value })}
                placeholder="Place here"
            />
            {addressError.address.details && (
                <div className="text-danger mt-2">{addressError.address.details}</div>
            )}
        </>
    );
};

export default DeliveryAddress;
