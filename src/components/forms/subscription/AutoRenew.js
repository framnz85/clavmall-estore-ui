import React, {useEffect} from 'react'
import { useSelector, useDispatch } from "react-redux";
import { Radio } from 'antd';
import { toast } from "react-toastify";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import NumberFormat from "react-number-format";

import { updateEstore } from '../../../functions/estore';
import Paypal from "../../../images/paypal.png";
import BDO from "../../../images/bdo.png";
import BPI from "../../../images/bpi.png";
import Unionbank from "../../../images/union.png";

const AutoRenew = ({
    values,
    setValues,
    initialState,
    renewal,
    setRenewal,
    priceOption1,
    setLoading,
    domainAvail
}) => {
    let dispatch = useDispatch();
    const phpConvert = 60;
    const paypalClientId = "ATy4_rfmeiT3mEPwjPOHoUFbNA_ZSsqGT9BvtkFkMW4io40J4kdX0NQpYM9YdSWXmawnKufvTNaEuuOg";

    const { estore, user } = useSelector((state) => ({
        ...state,
    }));
    
    useEffect(() => {
        if (values.planId !== "" && renewal === "auto") loadAnnualPlan(values.planId);        
    }, [values.planId, renewal]); // eslint-disable-line react-hooks/exhaustive-deps

    const loadAnnualPlan = (planId) => {
        setValues({
            ...values,
            payment: "recurring",
        })
        window.paypal.Buttons({
            style: {
                shape: 'rect',
                color: 'gold',
                layout: 'vertical',
                label: 'subscribe'
            },
            createSubscription: function(data, actions) {
                return actions.subscription.create({
                /* Creates the subscription */
                plan_id: planId
                });
            },
            onApprove: function(data, actions) {
                handleSubmit(data.subscriptionID); // You can add optional success message for the subscriber here
            }
        }).render('#paypal-button-container-' + planId); // Renders the PayPal button
    }

    const handleSubmit = (referenceID) => {
        const echange = estore.estoreChange > 0 ? estore.estoreChange + 1 : 1;
        const future = new Date();
        const existEndDate = new Date(estore.endDate);
        const difference = existEndDate.getTime() - future.getTime();
        const totalDays = Math.ceil(difference / (1000 * 3600 * 24));
        let finalDuration = values.duration;
        const billingHistory = { ...values, payStatus: "paid", referenceID, datePaid: new Date() };

        if (totalDays > 0) finalDuration += totalDays;
        const endDate = renewal === "auto" ? "12/31/2300" : (new Date(future.setDate(future.getDate() + finalDuration))).toLocaleString('en-us', { year: "numeric", month: "numeric", day: 'numeric' });
        
        setLoading(true);
        updateEstore(
            estore._id,
            {
                ...estore,
                status: "active",
                recurringCycle: renewal === "auto" ? "Unlimited" : "One",
                endDate,
                billingHistory: [...estore.billingHistory, billingHistory],
                estoreChange: echange
            },
            user.token
        )
        .then((res) => {
            setValues(initialState);
            dispatch({
                type: "ESTORE_INFO_XXIV",
                payload: res.data,
            });
            toast.success(`Payment was successful. Thank you!`);
            setLoading(false);
        })
        .catch((error) => {
            toast.error(error.message);
            setLoading(false);
        });
    };

    const onChange = (e) => {
        if (values.cycleId === "0") {
            toast.error("You need to Choose Payment Plan first before you can proceed");
        }
        if (!domainAvail) {
            toast.error("Make sure to provide Domain Name and have it checked availability first before you can proceed");
        }
        setValues({ ...values, payment: e.target.value });
    };

    const handlePaymentCreate = () => {
        setLoading(true);
        updateEstore(
            estore._id,
            {
                ...estore,
                billingHistory: [...estore.billingHistory, {...values, datePaid: new Date()}]
            },
            user.token
        )
        .then((res) => {
            setValues(initialState);
            dispatch({
                type: "ESTORE_INFO_XXIV",
                payload: res.data,
            });
            toast.success(`Payment was successful created!`);
            setLoading(false);
        })
        .catch((error) => {
            toast.error(error.message);
            setLoading(false);
        });
    }

    return (
        <>
            <br />
            <Radio.Group defaultValue="auto" buttonStyle="solid" onChange={e => {
                if (!domainAvail) {
                    toast.error("Make sure to provide Domain Name and have it checked availability first before you can proceed");
                }
                setRenewal(e.target.value);
            }}>
                <Radio.Button value="auto">Auto Renew</Radio.Button>
                <Radio.Button value="noauto">No Auto Renew</Radio.Button>
            </Radio.Group>

            {renewal === "auto" && values.cycleId !== "0" && domainAvail && <div align="center" style={{ margin: 40 }}>
                <div style={{fontSize: 24, margin: 20}}>Pay ${values.totalPrice}</div>
                {priceOption1.map(price => price._id === values.cycleId && <div id={`paypal-button-container-${price.plan_id}`} key={price._id}></div>)}
            </div>}

            {renewal === "noauto" && domainAvail && <div align="center" style={{ margin: 40 }}>
                <Radio.Group onChange={onChange} defaultValue={values.payment}>
                    <Radio.Button value="pal" style={{ height: 80 }}>
                        <img src={Paypal} width="100" height="50" alt="Card Payment or Paypal" /><br />
                        Credit / Debit Card
                    </Radio.Button>
                    <Radio.Button value="bdo" style={{ height: 80 }}>
                        <img src={BDO} width="100" height="50" alt="BDO Payment" /><br />
                        BDO Deposit or Online
                    </Radio.Button>
                    <Radio.Button value="bpi" style={{ height: 80 }}>
                        <img src={BPI} width="100" height="50" alt="BPI Payment" /><br />
                        BPI Deposit or Online
                    </Radio.Button>
                    <Radio.Button value="uni" style={{ height: 80 }}>
                        <img src={Unionbank} width="100" height="50" alt="Unionbank Payment" /><br />
                        BPI Deposit or Online
                    </Radio.Button>
                </Radio.Group>
                {values.totalPrice > 0 && values.payment && values.payment !== "recurring" && values.payment !== "pal" && <button
                    type="button"
                    className="btn-primary btn-lg"
                    style={{ fontSize: 24, padding: "10px 40px", margin: 30 }}
                    onClick={handlePaymentCreate}
                >
                    Pay ${values.totalPrice} (<NumberFormat
                        value={Number(values.totalPrice * phpConvert).toFixed(2)}
                        displayType={"text"}
                        thousandSeparator={true}
                        prefix="₱"
                    />)
                </button>}
                
                {values.totalPrice > 0 && values.payment === "pal" && domainAvail && 
                    <div style={{ marginTop: 20 }}>
                        <div style={{fontSize: 24, margin: 20}}>Pay ${values.totalPrice}</div>
                        <PayPalScriptProvider options={{ "client-id": paypalClientId, currency: "USD", }}>
                            <PayPalButtons
                                createOrder={(data, actions) => {
                                    return actions.order.create({
                                        purchase_units: [
                                            {
                                                description: "Payment for Clavstore's Business Starter: " + estore.name,
                                                amount: {
                                                    value: Number(values.totalPrice).toFixed(2)
                                                }
                                            }
                                        ]
                                    })
                                }}
                                onApprove={async (data, actions) => {
                                    const order = await actions.order.capture();
                                    handleSubmit(order.purchase_units[0].payments.captures[0].id);
                                }}
                                onError={(err) => {
                                    toast.error(err);
                                }}
                            />
                        </PayPalScriptProvider>
                    </div>
                }
            </div>}
        </>
    );
}
 
export default AutoRenew;