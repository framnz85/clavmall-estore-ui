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
  handleReferralChange,
  handleReferralTypeChange,
  handleCategoryChange,
  handleSubcatChange,
  handleParentChange,
  subcatOptions,
  showSubcat,
  parentOptions,
  updatingProduct,
  handleVariantDetails,
  onFinish,
  newGroupings,
  setNewGroupings,
  submitNewCategory,
  submitNewSubcat,
  submitNewParent,
  edit,
}) => {
  const {
    title,
    description,
    supplierPrice,
    markup,
    markuptype,
    price,
    referral,
    referraltype,
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
      type: "number",
      name: "referral",
      label: "Referral Commission",
      onChange: handleReferralChange,
      value: referral,
      radio: {
        label: "In: ",
        options: plainOptions,
        onChange: (e) => {
          setValues({
            ...values, referraltype: e.target.value
          });
          handleReferralTypeChange(e);
        },
        value: referraltype
      },
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
      optgroup: [
          {
              key: 1,
              label: "Create New",
              options: [{ key: 1, value: 1, text: "+ Create" }],
          },
          {
              key: 2,
              label: "Suggested",
              options: categories
                .sort((x, y) => {
                  if (x.name < y.name) { return -1; }
                  if (x.name > y.name) { return 1; }
                  return 0
                })
                .map(
                  (cat) =>
                    (cat = { ...cat, key: cat._id, value: cat._id, text: cat.name })
                ),
          },
      ],
      show: true,
      edit,
    },
    {
      type: "text",
      name: "newcategory",
      onChange: (e) => setNewGroupings({
          ...newGroupings,
          category: { id: "1", name: e.target.value }
        })
      ,
      value: newGroupings.category && newGroupings.category.name,
      placeholder: "New Category",
      disabled: loading,
      show: newGroupings.category && newGroupings.category.id === "1",
      edit,
    },
    {
      type: "button",
      name: "submitnewCategory",
      label: "Submit New Category",
      onSubmit: submitNewCategory,
      disabled: loading,
      show: newGroupings.category && newGroupings.category.id === "1",
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
      onChange: handleSubcatChange,
      value: updatingProduct ? subcats.map((subcat) => subcat) : subcats,
      disabled: loading,
      optgroup: [
          {
              key: 1,
              label: "Create New",
              options: [{ key: 1, value: 1, text: "+ Create" }],
          },
          {
              key: 2,
              label: "Suggested",
              options: subcatOptions
                .sort((x, y) => {
                  if (x.name < y.name) { return -1; }
                  if (x.name > y.name) { return 1; }
                  return 0
                })
                .map(
                  (subcat) =>
                    (subcat = {
                      ...subcat,
                      key: subcat._id,
                      value: subcat._id,
                      text: subcat.name,
                    })
                ),
          },
      ],
      show: showSubcat || updatingProduct,
    },
    {
      type: "text",
      name: "newsubcat",
      onChange: (e) => setNewGroupings({
          ...newGroupings,
          subcat: { id: "1", name: e.target.value, parent: values.category }
        })
      ,
      value: newGroupings.subcat && newGroupings.subcat.name,
      placeholder: "New Sub-Category",
      disabled: loading,
      show: newGroupings.subcat && newGroupings.subcat.id === "1",
      edit,
    },
    {
      type: "button",
      name: "submitnewSubcat",
      label: "Submit New Sub-Category",
      onSubmit: submitNewSubcat,
      disabled: loading,
      show: newGroupings.subcat && newGroupings.subcat.id === "1",
    },
    {
      type: "select",
      name: "parent",
      label: "Parent Product",
      onChange: handleParentChange,
      value: parent,
      disabled: loading,
      optgroup: [
          {
              key: 1,
              label: "Create New",
              options: [{ key: 1, value: 1, text: "+ Create" }],
          },
          {
              key: 2,
              label: "Suggested",
              options: parentOptions
                .sort((x, y) => {
                  if (x.name < y.name) { return -1; }
                  if (x.name > y.name) { return 1; }
                  return 0
                })
                .map(
                  (parent) =>
                    (parent = {
                      ...parent,
                      key: parent._id,
                      value: parent._id,
                      text: parent.name,
                    })
                ),
          },
      ],
      show: showSubcat || updatingProduct,
      edit,
    },
    {
      type: "text",
      name: "newparent",
      onChange: (e) => setNewGroupings({
          ...newGroupings,
          parent: { id: "1", name: e.target.value, parent: values.category }
        })
      ,
      value: newGroupings.parent && newGroupings.parent.name,
      placeholder: "New Parent",
      disabled: loading,
      show: newGroupings.parent && newGroupings.parent.id === "1",
      edit,
    },
    {
      type: "button",
      name: "submitnewParent",
      label: "Submit New Parent",
      onSubmit: submitNewParent,
      disabled: loading,
      show: newGroupings.parent && newGroupings.parent.id === "1",
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
