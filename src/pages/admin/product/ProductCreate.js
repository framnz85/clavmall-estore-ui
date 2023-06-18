import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Joi from "joi-browser";
import { toast } from "react-toastify";
import { Button } from "antd";

import AdminNav from "../../../components/nav/AdminNav";
import ProductImage from "../../../components/forms/product/ProductImage";
import ProductInputsLoad from "../../../components/forms/product/ProductInputsLoad";
import EstoreExpired from "../../../components/common/EstoreExpired";
import AddDomain from "../../../components/common/addDomain";

import { createProduct } from "../../../functions/product";
import { updateChanges } from "../../../functions/estore";
import { uploadFileImage } from "../../../functions/admin";

const initialState = {
  title: "",
  description: "",
  supplierPrice: "",
  markup: 0,
  markuptype: "%",
  price: "",
  referral: 0,
  referraltype: "%",
  category: "",
  subcats: [],
  parent: "",
  quantity: "",
  variants: [{ name: "", quantity: "" }],
  images: [],
};

const ProductCreate = ({ history }) => {
  let dispatch = useDispatch();

  const { user, admin, estore } = useSelector((state) => ({ ...state }));

  const [values, setValues] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [subcatOptions, setSubcatOptions] = useState([]);
  const [parentOptions, setParentOptions] = useState([]);
  const [saveVariant, setSaveVariant] = useState(false);

  const schema = {
    title: Joi.string().max(128).required(),
    description: Joi.string().max(2000).allow(null, ''),
    supplierPrice: Joi.number(),
    markup: Joi.number(),
    markuptype: Joi.string(),
    price: Joi.number().required(),
    referral: Joi.number(),
    referraltype: Joi.string(),
    category: Joi.string().required(),
    subcats: Joi.array(),
    parent: Joi.string().required(),
    quantity: Joi.number(),
    variants: Joi.array(),
    images: Joi.array(),
  };

  const handleSubmit = async (e) => {
    const { supplierPrice, markup, images } = values;
    let result;
    let allUploadedFiles = [];

    e.preventDefault();

    const validate = Joi.validate(
      {
        ...values,
        supplierPrice: supplierPrice ? supplierPrice : 0,
        markup: markup ? markup : 0,
      },
      schema,
      {
        abortEarly: false,
      }
    );

    if (!saveVariant || !values.variants) {
      toast.error("Add and Save Variants first before you Submit");
      return;
    }

    if (validate.error) {
      for (let item of validate.error.details) toast.error(item.message);
      return;
    }

    setLoading(true);

    for (let i = 0; i < images.length; i++) {
      result = await uploadFileImage(images[i].url, estore, user.token);
      allUploadedFiles.push(result.data);
      setValues({ ...values, images: allUploadedFiles });
    }

    createProduct(
      {
        ...values,
        images: allUploadedFiles,
        supplierPrice: supplierPrice ? supplierPrice : 0,
        markup: markup ? markup : 0,
      },
      user.token
    )
      .then((res) => {
        toast.success(`${res.data.ops[0].title} is created`);
        setLoading(false);
        setValues({ ...initialState, images: [] });
        initialState.images = [];

        if (admin.products.values.length > 0) {
          admin.products.values.unshift({ ...res.data.ops[0], page: 1 });

          const newProdCount = parseInt(admin.products.itemsCount) + 1;

          dispatch({
            type: "ADMIN_OBJECT_XVIII",
            payload: {
              products: {
                ...admin.products,
                itemsCount: newProdCount
              }
            },
          });

          updateChanges(
            estore._id,
            "productChange",
            user.token
          ).then((res) => {
            dispatch({
              type: "ESTORE_INFO_XIX",
              payload: res.data,
            });
          });
        }

        history.push("/admin/products");
      })
      .catch((error) => {
        if (error.response.status === 400 || 404)
          toast.error(error.response.data);
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
          
          <h4 style={{ margin: "20px 0" }}>Product Create</h4>
          <hr />

          <ProductImage
            values={values}
            setValues={setValues}
            width={514}
            height={514}
            edit={false}
          />

          <ProductInputsLoad
            values={values}
            setValues={setValues}
            loading={loading}
            setLoading={setLoading}
            handleSubmit={handleSubmit}
            subcatOptions={subcatOptions}
            setSubcatOptions={setSubcatOptions}
            parentOptions={parentOptions}
            setParentOptions={setParentOptions}
            setSaveVariant={setSaveVariant}
            edit={false}
          />

          <Button
            onClick={handleSubmit}
            type="primary"
            className="mb-3"
            block
            shape="round"
            size="large"
            disabled={loading}
            style={{ marginTop: "30px", width: "150px" }}
          >
            Submit
          </Button>
          <br /><br />
          
          <div style={{ paddingBottom: 10 }}>
            <AddDomain />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCreate;
