import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import CountrySelect from "../../modal/location/CountrySelect";
import Addiv1Select from "../../modal/location/Addiv1Select";
import Addiv2Select from "../../modal/location/Addiv2Select";
import Addiv3Select from "../../modal/location/Addiv3Select";
import SameAddress from "./SameAddress";
import { getAllMyCountry } from "../../../functions/country";

const HomeAddress = ({values, setValues, loading, setLoading, addressError}) => {
    let dispatch = useDispatch();

    const { user, location, estore } = useSelector((state) => ({ ...state }));
  
    const [countries, setCountries] = useState([]);
    const [addiv1s, setAddiv1s] = useState([]);
    const [addiv2s, setAddiv2s] = useState([]);
    const [addiv3s, setAddiv3s] = useState([]);
    const [homeAddress, setHomeAddress] = useState(values.homeAddress);

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
        setValues({ ...values, homeAddress });
    }, [homeAddress]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            <SameAddress
                address={values.address}
                setAddiv1s={setAddiv1s}
                setAddiv2s={setAddiv2s}
                setAddiv3s={setAddiv3s}
                setLoading={setLoading}
                homeAddress={homeAddress}
                setHomeAddress={setHomeAddress}
            />
            <br /><br />
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
                    setAddressSaved={() => ""}
                />
                {addressError.homeAddress.country &&
                    <div className="text-danger mt-2">{addressError.homeAddress.country}</div>
                }
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
                    setAddressSaved={() => ""}
                />
                {addressError.homeAddress.addiv1 && (
                    <div className="text-danger mt-2">{
                        `Home ${estore.country.adDivName1} ${addressError.homeAddress.addiv1}`
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
                    address={homeAddress}
                    setAddress={setHomeAddress}
                    countries={countries}
                    addiv1s={addiv1s}
                    addiv2s={addiv2s}
                    setAddiv3s={setAddiv3s}
                    loading={loading}
                    setLoading={setLoading}
                    setAddressSaved={() => ""}
                />
                {addressError.homeAddress.addiv2 && (
                    <div className="text-danger mt-2">{
                        `Home ${estore.country.adDivName2} ${addressError.homeAddress.addiv2}`
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
                    address={homeAddress}
                    setAddress={setHomeAddress}
                    addiv3s={addiv3s}
                    loading={loading}
                    setAddressSaved={() => ""}
                />
                {addressError.homeAddress.addiv3 && (
                    <div className="text-danger mt-2">{
                        `Home ${estore.country.adDivName3} ${addressError.homeAddress.addiv3}`
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
                value={homeAddress && homeAddress.details ? homeAddress.details : ""}
                onChange={(e) => setHomeAddress({ ...homeAddress, details: e.target.value })}
                placeholder="Place here"
            />
            {addressError.homeAddress.details && (
                <div className="text-danger mt-2">{addressError.homeAddress.details}</div>
            )}
        </>
    );
};

export default HomeAddress;
