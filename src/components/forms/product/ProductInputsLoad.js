import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Joi from "joi-browser";
import { toast } from "react-toastify";

import ProductInputsChange from "./ProductInputsChange";

import {
  getCategories,
  createCategory,
  getCategorySubcats,
  getCategoryParents
} from "../../../functions/category";
import { createSubcat } from "../../../functions/subcat";
import { createParent } from "../../../functions/parent";
import { updateChanges } from "../../../functions/estore";

const initialGroupings = {
  category: {},
  subcat: {},
  parent: {}
}

const ProductInputsLoad = ({
  values,
  setValues,
  loading,
  setLoading,
  subcatOptions,
  setSubcatOptions,
  parentOptions,
  setParentOptions,
  setSaveVariant,
  updatingProduct,
}) => {
  let dispatch = useDispatch();

  const [newGroupings, setNewGroupings] = useState(initialGroupings);
  const [showSubcat, setshowSubcat] = useState(false);

  const { user, categories, subcats, parents, estore } = useSelector((state) => ({
      ...state,
  }));

  useEffect(() => {
    loadCategories();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadCategories = () => {
    getCategories(user.address ? user.address : {}).then((category) => {
      dispatch({
        type: "CATEGORY_LIST_VI",
        payload: category.data.catComplete,
      });
      dispatch({
        type: "PRODUCT_LIST_V",
        payload: category.data.products,
      });
    });
  };

  const schema = {
    name: Joi.string().min(2).max(32).required(),
  };

  const submitNewCategory = () => {
    const validate = Joi.validate({ name: newGroupings.category.name }, schema, {
      abortEarly: false,
    });

    if (validate.error) {
      for (let item of validate.error.details) toast.error(item.message);
      return;
    }
    setLoading(true);

    createCategory({ name: newGroupings.category.name }, user.token)
      .then((res) => {
        categories.push(res.data.ops[0]);
        dispatch({
          type: "CATEGORY_LIST_VI",
          payload: categories,
        });
        setNewGroupings(initialGroupings);
        updateChanges(
          estore._id,
          "categoryChange",
          user.token
        ).then((res) => {
          dispatch({
            type: "ESTORE_INFO_XXIII",
            payload: res.data,
          });
        });
        setLoading(false);
        toast.success(`"${res.data.ops[0].name}" category is created.`);
      })
      .catch((error) => {
        toast.error(error.message);
        setLoading(false);
      });
  };

  const submitNewSubcat = () => {
    if (!newGroupings.subcat.parent) {
      toast.error("Please select a category");
      return;
    }

    const validate = Joi.validate({ name: newGroupings.subcat.name }, schema, {
      abortEarly: false,
    });

    if (validate.error) {
      for (let item of validate.error.details) toast.error(item.message);
      return;
    }

    setLoading(true);

    createSubcat({
      name: newGroupings.subcat.name,
      parent: newGroupings.subcat.parent
    }, user.token)
      .then((res) => {
        subcats.push(res.data.ops[0]);
        dispatch({
          type: "SUBCAT_LIST_XII",
          payload: subcats,
        });
        setNewGroupings(initialGroupings);
        updateChanges(
          estore._id,
          "subcatChange",
          user.token
        ).then((res) => {
          dispatch({
            type: "ESTORE_INFO_XXIII",
            payload: res.data,
          });
        });
        getCategorySubcats(values.category).then((res) => {
          setSubcatOptions(res.data);
          dispatch({
            type: "SUBCAT_LIST_VIII",
            payload: res.data,
          });
        });
        setLoading(false);
        toast.success(`"${res.data.ops[0].name}" sub-category is created.`);
      })
      .catch((error) => {
        toast.error(error.message);
        setLoading(false);
      });
  }

  const submitNewParent = () => {
    if (!newGroupings.parent.parent) {
      toast.error("Please select a category");
      return;
    }

    const validate = Joi.validate({ name: newGroupings.parent.name }, schema, {
      abortEarly: false,
    });

    if (validate.error) {
      for (let item of validate.error.details) toast.error(item.message);
      return;
    }

    setLoading(true);

    createParent({
      name: newGroupings.parent.name,
      parent: newGroupings.parent.parent
    }, user.token)
      .then((res) => {
        parents.push(res.data.ops[0]);
        dispatch({
          type: "PARENT_LIST_XIV",
          payload: parents,
        });
        setNewGroupings(initialGroupings);
        updateChanges(
          estore._id,
          "parentChange",
          user.token
        ).then((res) => {
          dispatch({
            type: "ESTORE_INFO_XXIII",
            payload: res.data,
          });
        });
        getCategoryParents(values.category).then((res) => {
          setParentOptions(res.data);
          dispatch({
            type: "PARENT_LIST_XIII",
            payload: res.data,
          });
        });
        setLoading(false);
        toast.success(`"${res.data.ops[0].name}" parent is created.`);
      })
      .catch((error) => {
        if (error.response.status === 400 || 404)
          toast.error(error.response.data);
        else toast.error(error.message);
        setLoading(false);
      });
  }

  return (
    <div>
      <ProductInputsChange
        values={values}
        setValues={setValues}
        loading={loading}
        subcatOptions={subcatOptions}
        setSubcatOptions={setSubcatOptions}
        parentOptions={parentOptions}
        setParentOptions={setParentOptions}
        updatingProduct={updatingProduct}
        setSaveVariant={setSaveVariant}
        showSubcat={showSubcat}
        setshowSubcat={setshowSubcat}
        newGroupings={newGroupings}
        setNewGroupings={setNewGroupings}
        submitNewCategory={submitNewCategory}
        submitNewSubcat={submitNewSubcat}
        submitNewParent={submitNewParent}
      />
    </div>
  );
};

export default ProductInputsLoad;
