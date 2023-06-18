import React, {useEffect, useState} from 'react';
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "antd";

import { getAllMyPayments } from '../../functions/payment';
import paymentCategories from '../common/constants/paymentCategories';
import noImage from "../../images/noimage.jpg";

const PaymentOption = ({ addressSaved, products, cartCalculation }) => {
    let dispatch = useDispatch();
    let history = useHistory();

    const [payCategories, setPayCategories] = useState([]);
    const [order, setOrder] = useState({});

    const { user, inputs } = useSelector((state) => ({
        ...state,
    }));

    const { minorder } = user.address.addiv3;

    useEffect(() => {
        loadAllMyPayment();
        if (localStorage.getItem("order")) {
            setOrder(JSON.parse(localStorage.getItem("order")));
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const loadAllMyPayment = () => {
        getAllMyPayments(user.address ? user.address : {}).then((res) => {
            setPayCategories(res.data);
        });
    };

    const handlePaymentOption = (payopt) => {
        dispatch({
            type: "INPUTS_OBJECT_III",
            payload: {payopt: {...inputs.payopt, category: payopt}},
        });
        history.push("/payment");
    };
    
    return (
        <>
            {!order._id && <>
                <h4>Payment Option</h4>
                <div className="container">
                    <div className="row mt-4">
                        {!addressSaved && (
                            <div align="center" className="text-danger" style={{width: "100%"}}>
                            * Click <b>Save Addresses</b> button to continue<br /><br />
                            </div>
                        )}
                            {paymentCategories.map(cat => {
                                const payOtpt = payCategories.filter(p => p.category === cat.desc);
                                    
                                return payOtpt.length > 0 &&
                                    <Button 
                                        key={cat.num}
                                        type="primary"
                                        style={{ width: "auto", margin: "5px", height: "100%", borderRadius: 6, padding: "10px"}}
                                        disabled={
                                            !addressSaved ||
                                            !products.length ||
                                            cartCalculation.subtotal < Number(minorder)
                                        }
                                        onClick={() => handlePaymentOption(cat.desc)}
                                    >
                                        {payOtpt.map(p =>
                                            <img
                                                key={p._id}
                                                src={p.images && p.images.length > 0 ? process.env.REACT_APP_CLAVMALL_IMG + "/estore_images/estore" + process.env.REACT_APP_ESTORE_ID + "/thumb/" + p.images[0].url : noImage}
                                                alt={p.name}
                                                style={{ height: "80px", width: "80px", objectFit: "cover" }}
                                            />
                                        )}<br />
                                        {cat.icon} Pay {cat.desc}
                                    </Button>
                                }
                            )
                        }

                        <br /><br /><br /><br />
                    </div>
                </div>
            </>
            }
        </>
    );
}
 
export default PaymentOption;