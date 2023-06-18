import React from "react";
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
  showSubcat,
  setshowSubcat,
  newGroupings,
  setNewGroupings,
  submitNewCategory,
  submitNewSubcat,
  submitNewParent
}) => {
  let dispatch = useDispatch();

  const { supplierPrice, markup, markuptype, referral, referraltype } = values;

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

  const handleReferralChange = (e) => {
    e.preventDefault();
    const markupValue = markuptype === "%"
      ? supplierPrice * (markup / 100)
      : parseFloat(e.target.value);
    const referralValue = referraltype === "%"
      ? supplierPrice * (e.target.value / 100)
      : parseFloat(e.target.value);
    if (referralValue >= markupValue) {
      toast.error('Referral Commission should be lower than Markup');
      setValues({
        ...values,
        referral: 0,
      });
    } else {
      setValues({
        ...values,
        referral: e.target.value,
      });
    }
  }

  const handleReferralTypeChange = (e) => {
    e.preventDefault();
    const markupValue = markuptype === "%"
      ? supplierPrice * (markup / 100)
      : parseFloat(e.target.value);
    const referralValue = e.target.value === "%"
      ? supplierPrice * (referral / 100)
      : parseFloat(referral);
    if (referralValue >= markupValue) {
      toast.error('Referral Commission should be lower than Markup');
      setValues({
        ...values,
        referral: 0,
        referraltype: "%"
      });
    } else {
      setValues({
        ...values,
        referraltype: e.target.value,
      });
    }
  }

  const handleCategoryChange = (e) => {
    e.preventDefault();
    if (e.target.value === "1") {
      setNewGroupings({
        ...newGroupings,
        category: { id: "1", name: "" }
      });
    } else {
      setValues({ ...values, subcats: [], parent: "", category: e.target.value });
      setNewGroupings({ ...newGroupings, category: {}, subcat: {}, parent: {}});
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
    }
  };

  const handleSubcatChange = (value) => {
    if (value.includes(1)) {
      setNewGroupings({
        ...newGroupings,
        subcat: { id: "1", name: "" }
      });
    } else {
      setValues({ ...values, subcats: value });
      setNewGroupings({ ...newGroupings, category: {}, subcat: {}, parent: {}});
    }
  };

  const handleParentChange = (e) => {
    e.preventDefault();
    if (e.target.value === "1") {
      setNewGroupings({
        ...newGroupings,
        parent: { id: "1", name: "" }
      });
    } else {
      setValues({ ...values, parent: e.target.value });
      setNewGroupings({ ...newGroupings, category: {}, subcat: {}, parent: {}});
    }
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
        handleReferralChange={handleReferralChange}
        handleReferralTypeChange={handleReferralTypeChange}
        handleCategoryChange={handleCategoryChange}
        handleSubcatChange={handleSubcatChange}
        handleParentChange={handleParentChange}
        subcatOptions={subcatOptions}
        showSubcat={showSubcat}
        parentOptions={parentOptions}
        updatingProduct={updatingProduct}
        handleVariantDetails={handleVariantDetails}
        onFinish={onFinish}
        newGroupings={newGroupings}
        setNewGroupings={setNewGroupings}
        submitNewCategory={submitNewCategory}
        submitNewSubcat={submitNewSubcat}
        submitNewParent={submitNewParent}
      />
    </>
  );
};

export default ProductInputsChange;
