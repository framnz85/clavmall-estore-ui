import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import ProductInputsChange from "./ProductInputsChange";

import { getCategories } from "../../../functions/category";
import { getParents } from "../../../functions/parent";

const ProductCreation = ({
  values,
  setValues,
  loading,
  subcatOptions,
  setSubcatOptions,
  setSaveVariant,
  updatingProduct,
}) => {
  let dispatch = useDispatch();

  useEffect(() => {
    loadCategories();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    loadParents();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadCategories = () => {
    if (typeof window !== undefined) {
      if (!localStorage.getItem("categories")) {
        getCategories().then((category) => {
          dispatch({
            type: "CATEGORY_LIST_VI",
            payload: category.data.categories,
          });
          dispatch({
            type: "PRODUCT_LIST_V",
            payload: category.data.products,
          });
        });
      }
    }
  };

  const loadParents = () => {
    if (typeof window !== undefined) {
      if (!localStorage.getItem("parents")) {
        getParents().then((parent) => {
          dispatch({
            type: "PARENT_LIST_V",
            payload: parent.data,
          });
        });
      }
    }
  };

  return (
    <div>
      <ProductInputsChange
        values={values}
        setValues={setValues}
        loading={loading}
        subcatOptions={subcatOptions}
        setSubcatOptions={setSubcatOptions}
        updatingProduct={updatingProduct}
        setSaveVariant={setSaveVariant}
      />
    </div>
  );
};

export default ProductCreation;
