import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import ProductInputsChange from "./ProductInputsChange";

import { getCategories } from "../../../functions/category";

const ProductCreation = ({
  values,
  setValues,
  loading,
  subcatOptions,
  setSubcatOptions,
  parentOptions,
  setParentOptions,
  setSaveVariant,
  updatingProduct,
}) => {
  let dispatch = useDispatch();

  useEffect(() => {
    loadCategories();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadCategories = () => {
    console.log(1);
    if (typeof window !== undefined) {console.log(2);
      if (!localStorage.getItem("categories")) {console.log(3);
        getCategories().then((category) => {console.log(category);
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
      />
    </div>
  );
};

export default ProductCreation;
