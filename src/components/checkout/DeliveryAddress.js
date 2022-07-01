import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const DeliveryAddress = ({address, setAddress, setAddressSaved, addressError}) => {
    const { user } = useSelector((state) => ({
        ...state,
    }));

    useEffect(() => {
        setAddress({ ...address, ...user.address });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            <h4>Delivery Address</h4>
            <label>
                <b>Country</b>
            </label>
            <div>{address.country.name}</div>
            <br />
            <label>
                <b>{address.country.adDivName1}</b>
            </label>
            <div>{address.addiv1.name}</div>
            <br />
            <label>
                <b>{address.country.adDivName2}</b>
            </label>
            <div>{address.addiv2.name}</div>
            <br />
            <label>
                <b>{address.country.adDivName3}</b>
            </label>
            <div>{address.addiv3.name}</div>
            <br />
            <label>
                <b>Block/Lot/Room No./Street/Subdivision</b>
            </label>
            <input
                type="text"
                name="address"
                className="form-control"
                value={address.details ? address.details : ""}
                onChange={(e) => {
                    setAddressSaved(false);
                    setAddress({ ...address, details: e.target.value });
                }}
                placeholder="Place here"
            />
            {addressError.details && (
                <div className="text-danger mt-2">{addressError.details}</div>
            )}
            <br /><br />
        </>
    );
}
 
export default DeliveryAddress;