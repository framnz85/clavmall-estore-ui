import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import ProductProperty from "./ProductProperty";
import { getCategorySubcats, getCategoryParents } from "../../../functions/category";

const ProductInputsChange = ({
  values,
  setValues,
  loading,
  subcatOptions,
  setSubcatOptions,
  parentOptions,
  setParentOptions,
  updatingProduct,
  setSaveVariant,
}) => {
  let dispatch = useDispatch();

  const { supplierPrice, markup, markuptype } = values;

  const [showSubcat, setshowSubcat] = useState(false);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSupplierPriceChange = (e) => {
    e.preventDefault();
    const finalPrice = markuptype === "%"
      ? e.target.value * (1 + markup / 100)
      : parseFloat(e.target.value) + parseFloat(markup);
    setValues({
      ...values,
      supplierPrice: e.target.value,
      price: parseFloat(finalPrice).toFixed(2),
    });
  };

  const handleMarkupChange = (e) => {
    e.preventDefault();
    const finalPrice = markuptype === "%"
      ? supplierPrice * (1 + e.target.value / 100)
      : parseFloat(supplierPrice) + parseFloat(e.target.value);
    setValues({
      ...values,
      markup: e.target.value,
      price: parseFloat(finalPrice).toFixed(2),
    });
  };

  const handleMarkupTypeChange = (e) => {
    e.preventDefault();
    const finalPrice = e.target.value === "%"
      ? supplierPrice * (1 + markup / 100)
      : parseFloat(supplierPrice) + parseFloat(markup);
    setValues({
      ...values,
      markuptype: e.target.value,
      price: parseFloat(finalPrice).toFixed(2),
    });
  }

  const handlePriceChange = (e) => {
    e.preventDefault();
    const supPrice = markuptype === "%"
      ? (100 * e.target.value) / (100 + parseFloat(markup))
      : parseFloat(e.target.value) - parseFloat(markup);
    setValues({
      ...values,
      supplierPrice: parseFloat(supPrice).toFixed(2),
      price: e.target.value,
    });
  };

  const handleCategoryChange = (e) => {
    e.preventDefault();
    setValues({ ...values, subcats: [], category: e.target.value });
    getCategorySubcats(e.target.value).then((res) => {
      setSubcatOptions(res.data);
      dispatch({
        type: "SUBCAT_LIST_IV",
        payload: res.data,
      });
    });
    setshowSubcat(true);
    getCategoryParents(e.target.value).then((res) => {
      setParentOptions(res.data);
      dispatch({
        type: "PARENT_LIST_XI",
        payload: res.data,
      });
    });
  };

  const handleParentChange = (e) => {
    e.preventDefault();
    setValues({ ...values, parent: e.target.value });
  };

  const handleVariantDetails = () => {
    setSaveVariant(false);
  };

  const getQuantitySum = (data) => {
    let sum = 0;
    for (let value of data) {
      sum += parseFloat(value.quantity);
    }
    return sum;
  };

  const onFinish = (valuesData) => {
    if (valuesData.variants) {
      setSaveVariant(true);
      const quantitySum = getQuantitySum(valuesData.variants);
      setValues({
        ...values,
        variants: valuesData.variants,
        quantity: quantitySum,
      });
      toast.warning("Variants saved! Make sure to click Update button below to save changes.");
    } else toast.error("No variant save.");
  };

  return (
    <>
      <ProductProperty
        values={values}
        setValues={setValues}
        loading={loading}
        handleChange={handleChange}
        handleSupplierPriceChange={handleSupplierPriceChange}
        handleMarkupChange={handleMarkupChange}
        handleMarkupTypeChange={handleMarkupTypeChange}
        handlePriceChange={handlePriceChange}
        handleCategoryChange={handleCategoryChange}
        handleParentChange={handleParentChange}
        subcatOptions={subcatOptions}
        showSubcat={showSubcat}
        parentOptions={parentOptions}
        updatingProduct={updatingProduct}
        handleVariantDetails={handleVariantDetails}
        onFinish={onFinish}
      />
    </>
  );
};

export default ProductInputsChange;
