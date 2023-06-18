import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import ThumbUpload from "../../common/fileupload/ThumbUpload";

import { imageupdate } from "../../../functions/payment";

const PaymentImage = ({ values, setValues, width, height, edit }) => {
  let dispatch = useDispatch();
  const { _id: payid } = values.payment;

  const { user, admin } = useSelector((state) => ({ ...state }));

  const [loading, setLoading] = useState(false);

  const updatePaymentImage = (images) => {
    if (admin.myPayments) {
      const newMyPayments = admin.myPayments.map((payment) =>
        payment._id === payid ? { ...values.payment, images } : payment
      );

      setValues({ ...values, images });

      dispatch({
        type: "ADMIN_OBJECT_X",
        payload: { myPayments: newMyPayments },
      });
    }

    imageupdate(payid, images, user.token);
  };

  const removePaymentImage = (images) => {
    if (admin.myPayments) {
      const newMyPayments = admin.myPayments.map((payment) =>
        payment._id === payid ? { ...values.payment, images } : payment
      );

      setValues({ ...values, images });

      dispatch({
        type: "ADMIN_OBJECT_X",
        payload: { myPayments: newMyPayments },
      });
    }

    imageupdate(payid, images, user.token);
  };

  return (
    <>
      <ThumbUpload
        values={values}
        setValues={setValues}
        width={width}
        height={height}
        loading={loading}
        setLoading={setLoading}
        edit={edit}
        handleImageUpdate={updatePaymentImage}
        handleImageRemove={removePaymentImage}
      />
    </>
  );
};

export default PaymentImage;
