import React, { useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";

import ShowingForms from "../../common/ShowingForms";

const PaymentProperty = ({
  values,
  setValues,
  edit,
  loading,
  handleChangeCategory,
  handleChangeName,
  handleVariantDetails,
  onFinish,
}) => {
  const { category, categories, payment, paymentChoices } = values;

  const [showInput, setShowInput] = useState(true);

  const formProperty = [
    {
      type: "select",
      name: "category",
      label: "Payment Category",
      onChange: edit ? () => "" : handleChangeCategory,
      value:
        edit && category.desc
          ? category.desc
          : category.num > 0
          ? category.num
          : "",
      disabled: loading,
      options: categories.map(
        (cat) =>
          (cat = { ...cat, key: cat.num, value: cat.num, text: cat.desc })
      ),
      show: true,
      edit,
    },
    {
      type: "select",
      name: "name",
      label: "Payment Name",
      onChange: edit ? () => "" : handleChangeName,
      value: edit ? payment.name : payment && payment._id ? payment._id : "",
      disabled: loading,
      optgroup: category && category.num === "1" ? [
        {
          key: 2,
          label: "Select",
          options: paymentChoices.map(
            (payment) =>
              (payment = {
                ...payment,
                key: payment._id,
                value: payment._id,
                text: payment.name,
              })
          ),
        },
      ] : [
        {
          key: 1,
          label: "Create New",
          options: [{ key: 1, value: 1, text: "+ Create" }],
        },
        {
          key: 2,
          label: "Suggested",
          options: paymentChoices.map(
            (payment) =>
              (payment = {
                ...payment,
                key: payment._id,
                value: payment._id,
                text: payment.name,
              })
          ),
        },
      ],
      show: paymentChoices.length > 0,
      edit,
    },
    {
      name: "create",
      onChange: (e) =>
        setValues({
          ...values,
          payment: { ...payment, name: e.target.value },
        }),
      value: payment.name,
      placeholder: "Type payment name here",
      disabled: loading,
      show: payment._id === "1",
      edit: false,
    },
    {
      type: "form list",
      name: "details",
      label: "Payment Details",
      data: payment,
      onChange: handleVariantDetails,
      onFinish: onFinish,
      loading: loading,
      input: [
        {
          inputName: "desc",
          inputFieldKey: "desc",
          inputMessage: "Missing description",
          placeholder: "Description",
          showInput: showInput,
        },
        {
          inputName: "value",
          inputFieldKey: "value",
          inputMessage: "Missing value",
          placeholder: "Value",
          showInput: true,
        },
      ],
      defaultList: [
        {
          name: "default",
          details: [{ desc: "", value: "" }],
        },
        {
          name: "Stripe",
          details:
            payment.name === "Stripe" && payment.details[0].desc
              ? payment.details
              : [
                  { desc: "Publishable key", value: "" },
                  { desc: "Secret key", value: "" },
                ],
        },
        {
          name: "Paypal",
          details:
            payment.name === "Paypal" && payment.details[0].desc
              ? payment.details
              : [
                  { desc: "Client ID", value: "" },
                  { desc: "Secret", value: "" },
                ],
        },
      ],
      show: payment._id,
      edit: false,
      showInput: showInput,
      setShowInput: setShowInput,
    },
  ];

  return (
    <>
      {loading && (
        <h4 style={{ margin: "20px 0" }}>
          <LoadingOutlined />
        </h4>
      )}

      <ShowingForms formProperty={formProperty} />
    </>
  );
};

export default PaymentProperty;
