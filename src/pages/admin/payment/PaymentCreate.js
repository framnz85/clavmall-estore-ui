import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Joi from "joi-browser";
import { Button } from "antd";

import AdminNav from "../../../components/nav/AdminNav";
import PaymentInputs from "../../../components/forms/payment/PaymentInputs";
import MyPaymentTable from "../../../components/forms/payment/MyPaymentTable";
import EstoreExpired from "../../../components/common/EstoreExpired";
import PaymentImage from "../../../components/forms/payment/PaymentImage";
import AddDomain from "../../../components/common/addDomain";

import { createMyPayment } from "../../../functions/payment";
import { uploadThumbImage } from "../../../functions/admin";
import paymentCategories from "../../../components/common/constants/paymentCategories";

const initialState = {
  payments: [],
  category: {},
  categories: paymentCategories,
  payment: {
    details: [{ desc: "", value: "" }],
  },
  paymentChoices: [],
  images: [],
};

const myInitialState = {
  myPayments: [],
  itemsCount: 0,
  pageSize: 10,
  currentPage: 1,
  sortkey: "",
  sort: -1,
  searchQuery: "",
};

const PaymentCreate = () => {
  let dispatch = useDispatch();

  const [values, setValues] = useState(initialState);
  const [myValues, setMyValues] = useState(myInitialState);

  const { user, admin, estore } = useSelector((state) => ({ ...state }));

  const [loading, setLoading] = useState(false);
  const [saveDetails, setSaveDetails] = useState(false);

  const schema = {
    category: Joi.string().min(2).max(255).required(),
    name: Joi.string().min(2).max(255).required(),
    details: Joi.array(),
  };

  const handleSubmit = async () => {
    let result;
    let allUploadedFiles = [];
    const replicateValue = { ...values.payment };
    delete replicateValue._id;
    delete replicateValue.__v;
    const validate = Joi.validate(replicateValue, schema, {
      abortEarly: false,
    });

    if (validate.error) {
      for (let item of validate.error.details) toast.error(item.message);
      return;
    }

    if (!saveDetails) {
      toast.error("Add and Save Details first before you Submit");
      return;
    }

    if (values.images && values.images.length > 2) {
      toast.error(
        "You can only add up to 2 images. First image is a payment logo and the second is a QR Code"
      );
      return;
    }

    setLoading(true);

    for (let i = 0; i < values.images.length; i++) {
      result = await uploadThumbImage(values.images[i].url, estore, user.token);
      allUploadedFiles.push(result.data);
      setValues({ ...values, images: allUploadedFiles });
    }

    const paySubmit = { ...values.payment, images: allUploadedFiles };
    if (paySubmit._id === "1") delete paySubmit._id;

    createMyPayment(paySubmit, user.token)
      .then((res) => {
        setValues({ ...initialState, payments: admin.allPayments });
        setMyValues({
          ...myValues,
          myPayments: [...myValues.myPayments, res.data.ops[0]],
          itemsCount: myValues.itemsCount + 1,
        });
        dispatch({
          type: "ADMIN_OBJECT_XV",
          payload: { myPayments: [...myValues.myPayments, res.data.ops[0]] },
        });
        toast.success("Payment successfully added.");
        setLoading(false);
        setSaveDetails(false);
      })
      .catch((error) => {
        toast.error(error.message);
        setLoading(false);
        setSaveDetails(false);
      });
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-m-2">
          <AdminNav />
        </div>
        <div className="col-md-10 bg-white mt-3 mb-5">
          <EstoreExpired />

          <h4 style={{ margin: "20px 0" }}>Payment Create</h4>
          <hr />

          <PaymentInputs
            values={values}
            setValues={setValues}
            loading={loading}
            setLoading={setLoading}
            handleSubmit={handleSubmit}
            setSaveDetails={setSaveDetails}
            edit={false}
          />

          {values.paymentChoices.length > 0 && (
            <>
              <label>
                <b>Add Image</b>
              </label>
              <PaymentImage
                values={values}
                setValues={setValues}
                width={150}
                height={150}
                edit={false}
              />
            </>
          )}

          <Button
            onClick={handleSubmit}
            type="primary"
            className="mb-3"
            block
            shape="round"
            size="large"
            disabled={loading || !values.payment._id}
            style={{ marginTop: "30px", width: "150px" }}
          >
            Submit
          </Button>

          <h4 style={{ margin: "20px 0" }}>My Payments</h4>
          <hr />

          <MyPaymentTable myValues={myValues} setMyValues={setMyValues} />
          <br />
          <br />

          <div style={{ paddingBottom: 10 }}>
            <AddDomain />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCreate;
