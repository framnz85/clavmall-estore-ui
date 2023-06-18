import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Joi from "joi-browser";
import { Button } from "antd";
import { toast } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";

import AdminNav from "../../../components/nav/AdminNav";
import CouponInputs from "../../../components/forms/coupon/CouponInputs";
import CouponTable from "../../../components/forms/coupon/CouponTable";
import EstoreExpired from "../../../components/common/EstoreExpired";
import AddDomain from "../../../components/common/addDomain";

import { createCoupon } from "../../../functions/coupon";

const initialState = {
  name: "",
  code: "",
  expiry: "",
  discount: "",
  coupons: [],
  itemsCount: 0,
  pageSize: 20,
  currentPage: 1,
  sortkey: "",
  sort: -1,
  searchQuery: "",
};

const CreateCoupon = () => {
  let dispatch = useDispatch();

  const [values, setValues] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const { user, admin } = useSelector((state) => ({
    ...state,
  }));

  const schema = {
    name: Joi.string().min(1).max(256).required(),
    code: Joi.string().min(3).max(64).required(),
    discount: Joi.number().required(),
    expiry: Joi.date().required(),
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validate = Joi.validate({
      name: values.name,
      code: values.code,
      discount: values.discount,
      expiry: values.expiry
    }, schema, {
      abortEarly: false,
    });

    if (validate.error) {
      for (let item of validate.error.details) toast.error(item.message);
      return;
    }

    setLoading(true);
    createCoupon({
      name: values.name,
      code: values.code,
      expiry: values.expiry,
      discount: values.discount,
    }, user.token)
      .then((res) => {
        admin.coupons.push(res.data.ops[0]);
        setValues({
          ...values,
          name: "",
          code: "",
          expiry: "",
          discount: "",
          coupons: admin.coupons,
        })
        setLoading(false);
        dispatch({
          type: "ADMIN_OBJECT_XII",
          payload: { coupons: [...admin.coupons] },
        });
        toast.success(`"${res.data.ops[0].name}" is created`);
      })
      .catch((error) => {
        if (error.response.status === 400) toast.error(error.response.data);
        else toast.error(error.message);
        setLoading(false);
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
          
          <h4 style={{ margin: "20px 0" }}>Create Coupon</h4>
          <hr />

          <CouponInputs
            values={values}
            setValues={setValues}
            loading={loading}
            edit={false}
          />

          <Button
            onClick={handleSubmit}
            type="primary"
            className="mb-3"
            block
            shape="round"
            size="large"
            disabled={
              values.name.length < 0 || values.code.length < 2 || values.discount === "" || values.expiry === "" || loading
            }
            style={{ marginTop: "30px", width: "150px" }}
          >
            Save
          </Button>

          <h4 style={{ margin: "20px 0" }}>Existing Coupons</h4>
          <hr />

          <CouponTable
            values={values}
            setValues={setValues}
            setLoading={setLoading}
          />
          <br /><br />
          
          <div style={{ paddingBottom: 10 }}>
            <AddDomain />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCoupon;
