import React from 'react'
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';

const EstoreExpired = () => {

    const { estore, user } = useSelector((state) => ({ ...state }));

    const daysToGo = ((new Date(estore.endDate)).getTime() - (new Date()).getTime()) / (1000 * 3600 * 24);
    
    return (
        <>
            {estore.recurringCycle && estore.recurringCycle === "One" && (!estore.endDate || (new Date(estore.endDate)).getTime() < (new Date()).getTime()) ? <div
                align="center"
                style={{ border: "1px solid red", padding: 10, color: "red", marginTop: 15 }}
            >
                Your subscription has expired. <Link to="/admin/subscription" style={{textDecoration: "underline", color: "red"}}>Renew now</Link>.
            </div> : ""}

            {estore.recurringCycle && estore.recurringCycle === "One" &&  estore.endDate && (new Date(estore.endDate)).getTime() >= (new Date()).getTime() && daysToGo <= 7 && <div
                align="center"
                style={{ border: "1px solid green", padding: 10, color: "green", marginTop: 15 }}
            >
                Your subscription will end on {(new Date(estore.endDate)).toLocaleString('en-us', { weekday: "long", year: "numeric", month: "short", day: 'numeric' })}
            </div>}

            {!user.emailConfirm && <div
                align="center"
                style={{ border: "1px solid red", padding: 10, color: "red", marginTop: 15 }}
            >
                Your Email Address needs to be verified. Go To <Link to="/user/account" style={{textDecoration: "underline", color: "red"}}>Profile Account</Link>.
            </div>}
        </>
    );
}
 
export default EstoreExpired;