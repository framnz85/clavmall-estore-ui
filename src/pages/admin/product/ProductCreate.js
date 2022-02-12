import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Joi from "joi-browser";
import { toast } from "react-toastify";
import axios from "axios";
import { createProduct } from "../../../functions/product";
import AdminNav from "../../../components/nav/AdminNav";
import ProductCreateForm from "../../../components/forms/ProductCreateForm";
import { getCategorySubcats } from "../../../functions/category";
import FileCreateUpload from "../../../components/forms/FileCreateUpload";
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
  variants: [],
  images: [],
};

const ProductCreate = ({ history }) => {
  const dispatch = useDispatch();

  const { user, admin, subcats } = useSelector((state) => ({ ...state }));

  const [values, setValues] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [subcatOptions, setSubcatOptions] = useState([]);
  const [showSubcat, setshowSubcat] = useState(false);
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

        if (admin.products.length > 0) {
          admin.products.unshift({ ...res.data, page: 1 });

          const newProdCount = parseInt(admin.prodCount) + 1;

          dispatch({
            type: "ADMIN_OBJECT",
            payload: { ...admin, prodCount: newProdCount },
          });
          localStorage.setItem(
            "admin",
            JSON.stringify({ ...admin, prodCount: newProdCount })
          );

          updateChanges(
            process.env.REACT_APP_ESTORE_ID,
            "productChange",
            user.token
          ).then((res) => {
            dispatch({
              type: "ESTORE_INFO",
              payload: res.data,
            });
            localStorage.setItem("estore", JSON.stringify(res.data));
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

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (e) => {
    e.preventDefault();
    setValues({ ...values, subcats: [], category: e.target.value });

    const subcatValues = subcats.filter(
      (subcat) => subcat.parent === e.target.value
    );
    if (subcatValues.length < 1) {
      getCategorySubcats(e.target.value).then((res) => {
        setSubcatOptions(res.data);
      });
    } else {
      setSubcatOptions(subcatValues);
    }
    setshowSubcat(true);
  };

  const handleParentChange = (e) => {
    e.preventDefault();
    setValues({ ...values, parent: e.target.value });
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

          <div className="p-3">
            <FileCreateUpload values={values} setValues={setValues} />
          </div>

          <ProductCreateForm
            setValues={setValues}
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            handleCategoryChange={handleCategoryChange}
            handleParentChange={handleParentChange}
            values={values}
            loading={loading}
            subcatOptions={subcatOptions}
            showSubcat={showSubcat}
            setSaveVariant={setSaveVariant}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCreate;
