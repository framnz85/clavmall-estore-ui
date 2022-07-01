import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Joi from "joi-browser";
import { toast } from "react-toastify";
import axios from "axios";
import { Button } from "antd";
import AdminNav from "../../../components/nav/AdminNav";
import ProductImage from "../../../components/forms/product/ProductImage";
import ProductInputsLoad from "../../../components/forms/product/ProductInputsLoad";
import { createProduct } from "../../../functions/product";
import { updateChanges } from "../../../functions/estore";

const initialState = {
  title: "",
  description: "",
  supplierPrice: "",
  markup: "",
  price: "",
  category: "",
  subcats: [],
  parent: "",
  quantity: "",
  variants: [{ name: "", quantity: "" }],
  images: [],
};

const ProductCreate = ({ history }) => {
  let dispatch = useDispatch();

  const { user, admin } = useSelector((state) => ({ ...state }));

  const [values, setValues] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [subcatOptions, setSubcatOptions] = useState([]);
  const [saveVariant, setSaveVariant] = useState(false);

  const schema = {
    title: Joi.string().max(128).required(),
    description: Joi.string().max(2000),
    supplierPrice: Joi.number(),
    markup: Joi.number(),
    price: Joi.number().required(),
    category: Joi.string().required(),
    subcats: Joi.array(),
    parent: Joi.string().required(),
    quantity: Joi.number(),
    variants: Joi.array(),
    images: Joi.array(),
  };

  const uploadImage = (image) => {
    return axios.post(
      `${process.env.REACT_APP_API}/uploadimages`,
      {
        image: image.url,
      },
      {
        headers: {
          authtoken: user ? user.token : "",
        },
      }
    );
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
      result = await uploadImage(images[i]);
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
        toast.success(`${res.data.title} is created`);
        setLoading(false);
        setValues({ ...initialState, images: [] });
        initialState.images = [];

        if (admin.products.values.length > 0) {
          admin.products.values.unshift({ ...res.data, page: 1 });

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
            process.env.REACT_APP_ESTORE_ID,
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
            handleSubmit={handleSubmit}
            subcatOptions={subcatOptions}
            setSubcatOptions={setSubcatOptions}
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
          <br />
          <br />
        </div>
      </div>
    </div>
  );
};

export default ProductCreate;
