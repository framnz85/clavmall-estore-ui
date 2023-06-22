import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Joi from "joi-browser";
import { Button } from "antd";

import AdminNav from "../../../components/nav/AdminNav";
import PaymentInputs from "../../../components/forms/payment/PaymentInputs";
import NotAvailableForm from "../../../components/common/NotAvailableForm";
import NotAvailableCard from "../../../components/common/NotAvailableCard";
import PaymentImage from "../../../components/forms/payment/PaymentImage";
import AddDomain from "../../../components/common/addDomain";

import {
  getMyPayment,
  getAllPayments,
  updateMyPayment,
} from "../../../functions/payment";
import paymentCategories from "../../../components/common/constants/paymentCategories";

const initialState = {
  payments: [],
  category: {},
  categories: paymentCategories,
  payment: {
    details: [{ desc: "", value: "" }],
  },
  images: [],
  paymentChoices: [],
  noAvail: [],
  itemsCount: 0,
  pageSize: 10,
  currentPage: 1,
  sortkey: "",
  sort: -1,
  searchQuery: "",
};

const PaymentUpdate = ({ history, match }) => {
  let dispatch = useDispatch();
  const payid = match.params.payid;

  const [values, setValues] = useState(initialState);

  const { user, admin } = useSelector((state) => ({ ...state }));

  const [loading, setLoading] = useState(false);
  const [saveDetails, setSaveDetails] = useState(true);

  const schema = {
    category: Joi.string().min(2).max(255).required(),
    name: Joi.string().min(2).max(255).required(),
    details: Joi.array(),
    noAvail: Joi.array(),
    images: Joi.array(),
  };

  useEffect(() => {
    loadAPayment();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadAPayment = () => {
    const payment = admin.myPayments
      ? admin.myPayments.filter((payment) => payment._id === payid)
      : {};
    if (payment[0]) {
      loadToValues(payment[0]);
    } else {
      getMyPayment(payid).then((res) => {
        setValues({
          ...values,
          category: values.categories.filter(
            (cat) => cat.desc === res.data.category
          )[0],
          payment: res.data,
        });
        loadToValues(res.data);
      });
    }
  };

  const loadToValues = (data) => {
    if (admin.allPayments) {
      setValues({
        ...values,
        category: values.categories.filter(
          (cat) => cat.desc === data.category
        )[0],
        payment: data,
        images: data.images,
        paymentChoices: admin.allPayments.filter(
          (pay) => pay.category === data.category
        ),
        noAvail: data.noAvail,
        itemsCount: data.noAvail.length,
      });
    } else {
      getAllPayments().then((res) => {
        setValues({
          ...values,
          payments: res.data,
          category: values.categories.filter(
            (cat) => cat.desc === data.category
          )[0],
          payment: data,
          images: data.images,
          paymentChoices: res.data.filter(
            (pay) => pay.category === data.category
          ),
          noAvail: data.noAvail,
          itemsCount: data.noAvail.length,
        });
        dispatch({
          type: "ADMIN_OBJECT_XVI",
          payload: { allPayments: res.data },
        });
      });
    }
  };

  const handleSubmit = () => {
    const replicateValue = { ...values.payment };
    delete replicateValue.__v;
    delete replicateValue._id;
    delete replicateValue.updatedAt;
    delete replicateValue.createdAt;
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

    const paySubmit = {
      ...values.payment,
      noAvail: values.noAvail,
      images: values.images,
    };

    updateMyPayment(paySubmit, user.token).then((res) => {
      if (admin.myPayments)
        dispatch({
          type: "ADMIN_OBJECT_XVI",
          payload: {
            myPayments: admin.myPayments.map((payment) =>
              payment._id === paySubmit._id ? res.data : payment
            ),
          },
        });
      toast.success("Payment successfully updated.");
      history.push("/admin/payment");
    });
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-m-2">
          <AdminNav />
        </div>
        <div className="col-md-10 bg-white mt-3 mb-5">
          <h4 style={{ margin: "20px 0" }}>Payment Update</h4>
          <hr />

          <PaymentInputs
            values={values}
            setValues={setValues}
            loading={loading}
            setLoading={setLoading}
            handleSubmit={handleSubmit}
            setSaveDetails={setSaveDetails}
            edit={true}
          />

          <label>
            <b>Add Image</b>
          </label>
          <PaymentImage
            values={values}
            setValues={setValues}
            width={150}
            height={150}
            edit={true}
          />

          <h4 style={{ margin: "40px 0 20px 0" }}>Not Available</h4>
          <hr />

          <NotAvailableForm values={values} setValues={setValues} />
          <br />
          <br />

          <NotAvailableCard values={values} setValues={setValues} />
          <br />

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
            Update
          </Button>
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

export default PaymentUpdate;
