import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import PaymentProperty from "./PaymentProperty";

import { getAllPayments } from "../../../functions/payment";

const PaymentInputs = ({
  values,
  setValues,
  loading,
  setLoading,
  setSaveDetails,
  edit,
}) => {
  let dispatch = useDispatch();
  const { payments, categories, payment, paymentChoices } = values;

  const { admin } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadAllPayment();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadAllPayment = () => {
    if (admin.allPayments) {
      setValues({ ...values, payments: admin.allPayments });
    } else {
      setLoading(true);
      getAllPayments().then((res) => {
        setValues({ ...values, payments: res.data });
        dispatch({
          type: "ADMIN_OBJECT_VII",
          payload: { allPayments: res.data },
        });
        setLoading(false);
      });
    }
  };

  const handleChangeCategory = (e) => {
    const category = categories.filter(
      (category) => category.num === e.target.value
    );
    const paymentChoices = payments.filter(
      (payment) => payment.category === category[0].desc
    );
    setValues({
      ...values,
      category: category[0],
      payment: {
        ...payment,
        category: category[0].desc,
        _id: category[0].desc === "Cash on Delivery" ? "1" : "",
        name: category[0].desc === "Cash on Delivery" ? "COD" : "",
      },
      paymentChoices,
    });
  };

  const handleChangeName = (e) => {
    let result = [];
    if (e.target.value === "1") {
      result = [
        {
          ...payment,
          _id: "1",
          name: "",
          category: values.category.desc,
        },
      ];
    } else {
      result = paymentChoices.filter(
        (payment) => payment._id === e.target.value
      );
    }

    setValues({
      ...values,
      payment: { ...payment, ...result[0] },
    });
  };

  const handleVariantDetails = () => {
    setSaveDetails(false);
  };

  const onFinish = (valuesData) => {
    if (valuesData.details) {
      setSaveDetails(true);
      setValues({
        ...values,
        payment: { ...payment, details: valuesData.details },
      });
      toast.success("Details saved!");
    } else toast.error("No details save.");
  };

  return (
    <>
      <PaymentProperty
        values={values}
        setValues={setValues}
        edit={edit}
        loading={loading}
        handleChangeCategory={handleChangeCategory}
        handleChangeName={handleChangeName}
        handleVariantDetails={handleVariantDetails}
        onFinish={onFinish}
      />
      {payment.category !== "Credit/Debit Card" && payment._id && <>
        <div style={{ color: "red" }}>
          Payment Details example =&gt; <b>Descrition:</b> Account Number, <b>Value</b>: 1234567890
        </div><br /><br />
      </>}
    </>
  );
};

export default PaymentInputs;
