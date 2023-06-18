import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "antd";
import { toast } from "react-toastify";

import { applyCoupon } from '../../functions/user';

const GotCoupon = ({
    cartDefault,
    discountError,
    setDiscountError,
    cartCalculation,
    setCartCalculation,
    setAddressSaved,
    loading,
    coupon,
    setCoupon,
}) => {
    let dispatch = useDispatch();

    const { user, inputs } = useSelector((state) => ({
        ...state,
    }));

    useEffect(() => {
        setCoupon(inputs.couponCode);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    
    const applyDiscountCoupon = () => {
        const { subtotal, delfee, servefee } = cartCalculation;
        applyCoupon(user.token, coupon).then((res) => {
        if (res.data.err) {
            setDiscountError(res.data.err);
        } else if (res.data) {
            const totalDiscount = cartDefault.discount + res.data.couponAmount;
            const newGrandTotal = subtotal + delfee +  servefee - totalDiscount;
            setCartCalculation({
                ...cartCalculation,
                discount: totalDiscount,
                grandTotal: newGrandTotal,
            });
            dispatch({
                type: "INPUTS_OBJECT_II",
                payload: {
                    couponCode: coupon,
                    couponAmount: res.data.couponAmount,
                },
            });
            toast.success("Discount successfully placed");
            setDiscountError("");
            setAddressSaved(false);
        }
        });
    };
    
    return (
        <>
            <h4>Got Coupon?</h4>
            <input
                type="text"
                className="form-control"
                value={coupon}
                onChange={(e) => { setCoupon(e.target.value); setAddressSaved(false);} }
                placeholder="Enter coupon"
            />
            {discountError && (
                <div className="text-danger mt-2">{discountError}</div>
            )}
            <br />
            <Button
                type="primary"
                onClick={applyDiscountCoupon}
                disabled={loading}
                size="large"
            >
                Apply
            </Button>
            <br /><br />
        </>
    );
}
 
export default GotCoupon;