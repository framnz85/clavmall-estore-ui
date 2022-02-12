import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Joi from "joi-browser";
import { toast } from "react-toastify";
import { getProduct, updateProduct } from "../../../functions/product";
import AdminNav from "../../../components/nav/AdminNav";
import ProductUpdateForm from "../../../components/forms/ProductUpdateForm";
import { getCategorySubcats } from "../../../functions/category";
import FileUpdateUpload from "../../../components/forms/FileUpdateUpload";
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
  sold: "",
  variants: [],
  images: [],
};

const ProductUpdate = ({ history, match }) => {
  const dispatch = useDispatch();

  const { user, admin, subcats, products } = useSelector((state) => ({
    ...state,
  }));
  const { slug } = match.params;

  const [values, setValues] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [subcatOptions, setSubcatOptions] = useState([]);
  const [saveVariant, setSaveVariant] = useState(true);

  useEffect(() => {
    loadProduct();
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadProduct = () => {
    const prodValues = admin.products.filter(
      (product) => product.slug === slug
    );
    if (prodValues.length < 1) {
      getProduct(slug).then((prod) => {
        admin.products.push({ ...prod.data, page: 1 });
        dispatch({
          type: "ADMIN_OBJECT",
          payload: admin,
        });
        localStorage.setItem("admin", JSON.stringify(admin));
        setValues({
          ...values,
          ...prod.data,
          category: prod.data.category._id,
          subcats: prod.data.subcats.map((sub) => sub._id),
          parent: prod.data.parent._id,
        });
        const subcatValues = subcats.filter(
          (subcat) => subcat.parent === prodValues[0].category._id
        );
        if (subcatValues.length < 1) {
          getCategorySubcats(prod.data.category._id).then((res) => {
            setSubcatOptions(res.data);
          });
        } else {
          setSubcatOptions(subcatValues);
        }
      });
    } else {
      const categoryId = prodValues[0].category._id || prodValues[0].category;
      const parentId = prodValues[0].parent._id || prodValues[0].parent;
      setValues({
        ...values,
        ...prodValues[0],
        category: categoryId,
        subcats: prodValues[0].subcats.map((sub) => sub._id || sub),
        parent: parentId,
      });
      const subcatValues = subcats.filter(
        (subcat) => subcat.parent === categoryId
      );
      if (subcatValues.length < 1) {
        getCategorySubcats(categoryId).then((res) => {
          setSubcatOptions(res.data);
        });
      } else {
        setSubcatOptions(subcatValues);
      }
    }
  };

  const schema = {
    _id: Joi.string().required(),
    title: Joi.string().max(128).required(),
    slug: Joi.string(),
    description: Joi.string().max(2000),
    supplierPrice: Joi.number(),
    markup: Joi.number(),
    price: Joi.number().required(),
    category: Joi.string().required(),
    subcats: Joi.array(),
    parent: Joi.string().required(),
    quantity: Joi.number(),
    sold: Joi.number(),
    variants: Joi.array(),
    images: Joi.array(),
  };

  const handleSubmit = (e) => {
    const { supplierPrice, markup, page } = values;

    e.preventDefault();

    delete values.createdAt;
    delete values.updatedAt;
    delete values.ratings;
    delete values.page;
    delete values.__v;

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

    updateProduct(
      values.slug,
      {
        ...values,
        supplierPrice: supplierPrice ? supplierPrice : 0,
        markup: markup ? markup : 0,
      },
      user.token
    )
      .then((res) => {
        toast.success(`${res.data.title} is updated`);

        const newAdminProducts = admin.products.map((product) =>
          product.slug === slug ? { ...res.data, page } : product
        );

        dispatch({
          type: "ADMIN_OBJECT",
          payload: { ...admin, products: newAdminProducts },
        });
        localStorage.setItem(
          "admin",
          JSON.stringify({ ...admin, products: newAdminProducts })
        );

        const newProducts = products.filter((product) => product.slug !== slug);

        dispatch({
          type: "PRODUCT_LIST",
          payload: newProducts,
        });
        localStorage.setItem("products", JSON.stringify(newProducts));

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
        setLoading(false);
        history.push("/admin/products");
      })
      .catch((error) => {
        if (error.response && error.response.status === (400 || 404))
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
          <h4 style={{ margin: "20px 0" }}>Product Update</h4>
          <hr />

          <div className="p-3">
            <FileUpdateUpload
              values={values}
              setValues={setValues}
              setLoading={setLoading}
            />
          </div>

          <ProductUpdateForm
            setValues={setValues}
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            handleCategoryChange={handleCategoryChange}
            handleParentChange={handleParentChange}
            values={values}
            loading={loading}
            subcatOptions={subcatOptions}
            saveVariant={saveVariant}
            setSaveVariant={setSaveVariant}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductUpdate;
