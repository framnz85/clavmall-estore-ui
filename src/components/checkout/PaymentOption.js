import React, {useEffect, useState} from 'react';
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "antd";

import { getAllMyPayments } from '../../functions/payment';
import paymentCategories from '../common/constants/paymentCategories';

const PaymentOption = ({ addressSaved, products, cartCalculation }) => {
    let dispatch = useDispatch();
    let history = useHistory();

    const [payCategories, setPayCategories] = useState([]);

    const { user, inputs } = useSelector((state) => ({
        ...state,
    }));

    const { minorder } = user.address.addiv3;

    useEffect(() => {
        loadAllMyPayment();
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
        <h4>Payment Option</h4>
            <div className="container">
                <div className="row mt-4">
                {!addressSaved && (
                    <div align="center" className="text-danger" style={{width: "100%"}}>
                    * Click <b>Save</b> button to continue<br /><br />
                    </div>
                )}
                    {paymentCategories.map(cat => 
                         payCategories.filter(
                            p => p.category === cat.desc
                        ).length > 0 &&
                            <Button 
                                key={cat.num}
                                type="primary"
                                size="large"
                                style={{ width: "100%", marginBottom: "15px" }}
                                disabled={
                                    !addressSaved ||
                                    !products.length ||
                                    cartCalculation.subtotal < Number(minorder)
                                }
                                onClick={() => handlePaymentOption(cat.desc)}
                            >
                                {cat.icon}
                                Pay {cat.desc}
                            </Button>
                    )
                }

                <br /><br /><br /><br />
                </div>
            </div>
        </>
    );
}
 
export default PaymentOption;