import React, { useState } from "react";
import { useSelector } from "react-redux";
import { LoadingOutlined } from "@ant-design/icons";
import ShowingForms from "../../common/ShowingForms";

const ProductProperty = ({
  values,
  setValues,
  loading,
  handleChange,
  handleSupplierPriceChange,
  handleMarkupChange,
  handleMarkupTypeChange,
  handlePriceChange,
  handleCategoryChange,
  handleParentChange,
  subcatOptions,
  showSubcat,
  parentOptions,
  updatingProduct,
  handleVariantDetails,
  onFinish,
  edit,
}) => {
  const {
    title,
    description,
    supplierPrice,
    markup,
    markuptype,
    price,
    category,
    subcats,
    parent,
  } = values;

  const { categories, estore } = useSelector((state) => ({
    ...state,
  }));

  const [showInput, setShowInput] = useState(true);

  const plainOptions = ["%", estore.country && estore.country.currency];

  const formProperty = [
    {
      type: "text",
      name: "title",
      label: "Title",
      onChange: handleChange,
      value: title,
      disabled: loading,
      show: true,
      edit,
    },
    {
      type: "text",
      name: "description",
      label: "Description",
      onChange: handleChange,
      value: description,
      disabled: loading,
      show: true,
      edit,
    },
    {
      type: "number",
      name: "supplierPrice",
      label: "Supplier Price",
      onChange: handleSupplierPriceChange,
      value: supplierPrice,
      placeholder: "0.00",
      disabled: loading,
      show: true,
      edit,
    },
    {
      type: "number",
      name: "markup",
      label: "Markup",
      onChange: handleMarkupChange,
      value: markup,
      radio: {
        label: "In: ",
        options: plainOptions,
        onChange: (e) => {
          setValues({
            ...values, markuptype: e.target.value
          });
          handleMarkupTypeChange(e);
        },
        value: markuptype
      },
      disabled: loading,
      show: true,
      edit,
    },
    {
      type: "number",
      name: "price",
      label: "Final Price",
      onChange: handlePriceChange,
      value: price,
      placeholder: "0.00",
      disabled: loading,
      show: true,
      edit,
    },
    {
      type: "select",
      name: "category",
      label: "Category",
      onChange: handleCategoryChange,
      value: category,
      disabled: loading,
      options: categories.map(
        (cat) =>
          (cat = { ...cat, key: cat._id, value: cat._id, text: cat.name })
      ),
      show: true,
      edit,
    },
    {
      type: "ant select",
      name: "subcategory",
      label: "Sub-category",
      style: {
        width: "100%",
        paddingBottom: "15px",
      },
      mode: "multiple",
      onChange: (value) => setValues({ ...values, subcats: value }),
      value: updatingProduct ? subcats.map((subcat) => subcat) : subcats,
      disabled: loading,
      options: subcatOptions.map(
        (subcat) =>
          (subcat = {
            ...subcat,
            key: subcat._id,
            value: subcat._id,
            text: subcat.name,
          })
      ),
      show: showSubcat || updatingProduct,
    },
    {
      type: "select",
      name: "parent",
      label: "Parent Product",
      onChange: handleParentChange,
      value: parent,
      disabled: loading,
      options: parentOptions.map(
        (parent) =>
          (parent = {
            ...parent,
            key: parent._id,
            value: parent._id,
            text: parent.name,
          })
      ),
      show: true,
      edit,
    },
    {
      type: "form list",
      name: "variants",
      label: "Create Variant",
      data: values,
      onChange: handleVariantDetails,
      onFinish: onFinish,
      loading: loading,
      input: [
        {
          inputName: "name",
          inputFieldKey: "name",
          inputMessage: "Missing name",
          placeholder: "Name",
          showInput: true,
        },
        {
          inputName: "quantity",
          inputFieldKey: "quantity",
          inputMessage: "Missing quantity",
          placeholder: "Quantity",
          showInput: true,
        },
      ],
      defaultList: [
        {
          name: "variants",
          details: [{ name: "", quantity: "" }],
        },
      ],
      show: true,
      edit: false,
      showInput: showInput,
      setShowInput: setShowInput,
    },
  ];

  return (
    <>
      {loading && (
        <h4 style={{ margin: "20px 0" }}>
          <LoadingOutlined />
        </h4>
      )}

      <ShowingForms formProperty={formProperty} />
    </>
  );
};

export default ProductProperty;
