import React from 'react'
import { useSelector } from "react-redux";

const Expiration = () => {

    const { estore } = useSelector((state) => ({
        ...state,
    }));

    return (
        <>
            {estore.recurringCycle && estore.recurringCycle === "Unlimited" ? <div
                align="center"
                style={{ border: "1px solid green", padding: 10, color: "green" }}
            >
                Your subscription is currently active!
            </div> : (!estore.endDate || (new Date(estore.endDate)).getTime() < (new Date()).getTime()) ? <div
                align="center"
                style={{ border: "1px solid red", padding: 10, color: "red" }}
            >
                Your subscription has expired
            </div> : ""}

            {estore.recurringCycle && estore.recurringCycle === "One" &&  estore.endDate && (new Date(estore.endDate)).getTime() >= (new Date()).getTime() && <div
                align="center"
                style={{ border: "1px solid green", padding: 10, color: "green" }}
            >
                Your subscription will end on {(new Date(estore.endDate)).toLocaleString('en-us', { weekday: "long", year: "numeric", month: "short", day: 'numeric' })}
            </div>}

            <br /><br />
        </>
    );
}
 
export default Expiration;