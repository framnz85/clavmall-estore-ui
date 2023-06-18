import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Joi from "joi-browser";
import { toast } from "react-toastify";
import { Button, Switch } from "antd";

import AdminNav from "../../../components/nav/AdminNav";
import ProductImage from "../../../components/forms/product/ProductImage";
import ProductInputsLoad from "../../../components/forms/product/ProductInputsLoad";
import NotAvailableForms from "../../../components/common/NotAvailableForm";
import NotAvailableCard from "../../../components/common/NotAvailableCard";
import AddDomain from "../../../components/common/addDomain";

import { getProduct, updateProduct } from "../../../functions/product";
import {
  getCategorySubcats,
  getCategoryParents,
} from "../../../functions/category";
import { updateChanges } from "../../../functions/estore";

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
  sold: "",
  variants: [{ name: "", quantity: "" }],
  images: [],
  noAvail: [],
  activate: false,
  itemsCount: 0,
  pageSize: 10,
  currentPage: 1,
  sortkey: "",
  sort: -1,
  searchQuery: "",
};

const ProductUpdate = ({ history, match }) => {
  let dispatch = useDispatch();

  const { user, admin, products, estore } = useSelector((state) => ({
    ...state,
  }));
  const { slug } = match.params;

  const [values, setValues] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [subcatOptions, setSubcatOptions] = useState([]);
  const [parentOptions, setParentOptions] = useState([]);
  const [saveVariant, setSaveVariant] = useState(true);

  useEffect(() => {
    loadProduct();
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadProduct = () => {
    const prodValues = admin.products.values.filter(
      (product) => product.slug === slug
    );
    if (prodValues.length < 1) {
      getProduct(slug).then((prod) => {
        admin.products.values.push({ ...prod.data, page: 1 });
        dispatch({
          type: "ADMIN_OBJECT_XIX",
          payload: admin,
        });
        setValues({
          ...values,
          ...prod.data,
          category: prod.data.category && prod.data.category._id,
          subcats:
            prod.data.subcats && prod.data.subcats.map((sub) => sub && sub._id),
          parent: prod.data.parent && prod.data.parent._id,
        });
        getCategorySubcats(prod.data.category._id).then((res) => {
          setSubcatOptions(res.data);
          dispatch({
            type: "SUBCAT_LIST_VIII",
            payload: res.data,
          });
        });
        getCategoryParents(prod.data.category._id).then((res) => {
          setParentOptions(res.data);
          dispatch({
            type: "PARENT_LIST_XIII",
            payload: res.data,
          });
        });
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
      getCategorySubcats(categoryId).then((res) => {
        setSubcatOptions(res.data);
        dispatch({
          type: "SUBCAT_LIST_VIII",
          payload: res.data,
        });
      });
      getCategoryParents(categoryId).then((res) => {
        setParentOptions(res.data);
        dispatch({
          type: "PARENT_LIST_XIII",
          payload: res.data,
        });
      });
    }
  };

  const schema = {
    _id: Joi.string().required(),
    title: Joi.string().max(128).required(),
    slug: Joi.string(),
    description: Joi.string().max(2000).allow(null, ""),
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
    sold: Joi.number(),
    variants: Joi.array(),
    images: Joi.array(),
    noAvail: Joi.array(),
    activate: Joi.boolean(),
  };

  const handleSubmit = (e) => {
    const { supplierPrice, markup } = values;
    const replicateValue = { ...values };

    e.preventDefault();

    delete replicateValue.createdAt;
    delete replicateValue.updatedAt;
    delete replicateValue.ratings;
    delete replicateValue.page;
    delete replicateValue.__v;
    delete replicateValue.itemsCount;
    delete replicateValue.pageSize;
    delete replicateValue.currentPage;
    delete replicateValue.sortkey;
    delete replicateValue.sort;
    delete replicateValue.searchQuery;

    const validate = Joi.validate(
      {
        ...replicateValue,
        supplierPrice: replicateValue.supplierPrice ? supplierPrice : 0,
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

        const newAdminProducts = admin.products.values.map((product) =>
          product.slug === slug
            ? {
                ...res.data,
                page: 1,
                category: product.category,
                subcats: product.subcats,
                parent: product.parent,
              }
            : product
        );

        dispatch({
          type: "ADMIN_OBJECT_XIX",
          payload: {
            products: {
              ...admin.products,
              values: newAdminProducts,
            },
          },
        });

        const newProducts = products.filter((product) => product.slug !== slug);

        dispatch({
          type: "PRODUCT_LIST_XIII",
          payload: newProducts,
        });

        updateChanges(estore._id, "productChange", user.token).then((res) => {
          dispatch({
            type: "ESTORE_INFO_XX",
            payload: res.data,
          });
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

  return (
    <div className="container">
      <div className="row">
        <div className="col-m-2">
          <AdminNav />
        </div>

        <div className="col-md-10 bg-white mt-3 mb-5">
          <h4 style={{ margin: "20px 0" }}>Product Update</h4>
          <hr />

          <ProductImage
            values={values}
            setValues={setValues}
            width={514}
            height={514}
            edit={true}
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
            updatingProduct={true}
          />

          <h4 style={{ margin: "40px 0 20px 0" }}>Not Available</h4>
          <hr />

          <NotAvailableForms values={values} setValues={setValues} />
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
            disabled={loading}
            style={{ marginTop: "30px", width: "150px", marginRight: "20px" }}
          >
            Update
          </Button>

          <b>Active</b>
          <Switch
            checked={values.activate}
            onChange={(checked) =>
              setValues({
                ...values,
                activate: checked,
              })
            }
            style={{ marginLeft: "10px" }}
          />

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

export default ProductUpdate;
