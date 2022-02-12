import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input, Button, Select, Space } from "antd";
import { toast } from "react-toastify";
import {
  LoadingOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import _ from "lodash";
import { getCategories } from "../../functions/category";
import { getParents } from "../../functions/parent";

const { Option } = Select;

const ProductCreateForm = ({
  setValues,
  handleSubmit,
  handleChange,
  handleCategoryChange,
  handleParentChange,
  values,
  loading,
  subcatOptions,
  showSubcat,
  setSaveVariant,
}) => {
  const {
    title,
    description,
    supplierPrice,
    markup,
    price,
    category,
    subcats,
    parent,
  } = values;

  const dispatch = useDispatch();

  const { categories, products, parents } = useSelector((state) => ({
    ...state,
  }));

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({ variant: [{ name: "", quantity: "" }] });
  }, [form]); // eslint-disable-line react-hooks/exhaustive-deps

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
            type: "CATEGORY_LIST",
            payload: category.data.categories,
          });
          localStorage.setItem(
            "categories",
            JSON.stringify(category.data.categories)
          );

          let unique = _.uniqWith(
            [...products, ...category.data.products],
            _.isEqual
          );
          dispatch({
            type: "PRODUCT_LIST",
            payload: unique,
          });
          localStorage.setItem("products", JSON.stringify(unique));
        });
      }
    }
  };

  const loadParents = () => {
    if (typeof window !== undefined) {
      if (!localStorage.getItem("parents")) {
        getParents().then((parent) => {
          dispatch({
            type: "PARENT_LIST",
            payload: parent.data,
          });
          localStorage.setItem("parents", JSON.stringify(parent.data));
        });
      }
    }
  };

  const onFinish = (valuesData) => {
    if (valuesData.variant) {
      setSaveVariant(true);
      const quantitySum = getQuantitySum(valuesData.variant);
      setValues({
        ...values,
        variants: valuesData.variant,
        quantity: quantitySum,
      });
      toast.success("Variants saved!");
    } else toast.error("No variant save.");
  };

  const getQuantitySum = (data) => {
    let sum = 0;
    for (let value of data) {
      sum += parseFloat(value.quantity);
    }
    return sum;
  };

  const handleVariantDetails = () => {
    setSaveVariant(false);
  };

  const handleSupplierPriceChange = (e) => {
    e.preventDefault();
    const finalPrice = e.target.value * (1 + markup / 100);
    setValues({
      ...values,
      supplierPrice: e.target.value,
      price: parseFloat(finalPrice).toFixed(2),
    });
  };

  const handleMarkupChange = (e) => {
    e.preventDefault();
    const finalPrice = supplierPrice * (1 + e.target.value / 100);
    setValues({
      ...values,
      markup: e.target.value,
      price: parseFloat(finalPrice).toFixed(2),
    });
  };

  const handlePriceChange = (e) => {
    e.preventDefault();
    const supPrice = (100 * e.target.value) / (100 + parseFloat(markup));
    setValues({
      ...values,
      supplierPrice: parseFloat(supPrice).toFixed(2),
      price: e.target.value,
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            <b>Title</b>
          </label>
          <input
            type="text"
            name="title"
            className="form-control"
            value={title}
            onChange={handleChange}
            disabled={loading}
            autoFocus
          />
        </div>
        <div className="form-group">
          <label>
            <b>Description</b>
          </label>
          <input
            type="text"
            name="description"
            className="form-control"
            value={description}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>
            <b>Supplier Price</b>
          </label>
          <input
            type="number"
            name="supplierPrice"
            className="form-control"
            value={supplierPrice}
            onChange={handleSupplierPriceChange}
            disabled={loading}
            placeholder="0.00"
          />
        </div>

        <div className="form-group">
          <label>
            <b>Markup Percentage (%)</b>
          </label>
          <input
            type="number"
            name="markup"
            className="form-control"
            value={markup}
            onChange={handleMarkupChange}
            disabled={loading}
            placeholder="0%"
          />
        </div>

        <div className="form-group">
          <label>
            <b>Final Price</b>
          </label>
          <input
            type="number"
            name="price"
            className="form-control"
            value={price}
            onChange={handlePriceChange}
            disabled={loading}
            placeholder="0.00"
          />
        </div>

        <div className="form-group">
          <label>
            <b>Category</b>
          </label>
          <select
            name="category"
            className="form-control"
            onChange={handleCategoryChange}
            value={category}
          >
            <option value="" disabled hidden>
              - choose -
            </option>
            {categories.length > 0 &&
              categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>

        {showSubcat && (
          <div className="form-group">
            <label>
              <b>Sub-category</b>
            </label>
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="Select one or more sub-category"
              value={subcats}
              onChange={(value) => setValues({ ...values, subcats: value })}
            >
              {subcatOptions.length &&
                subcatOptions.map((sub) => (
                  <Option key={sub._id} value={sub._id}>
                    {sub.name}
                  </Option>
                ))}
            </Select>
          </div>
        )}

        <div className="form-group">
          <label>
            <b>Parent Product</b>
          </label>
          <select
            name="parent"
            className="form-control"
            onChange={handleParentChange}
            value={parent}
          >
            <option value="" disabled hidden>
              - choose -
            </option>
            {parents.length > 0 &&
              parents.map((varopt) => (
                <option key={varopt._id} value={varopt._id}>
                  {varopt.name}
                </option>
              ))}
          </select>
        </div>
      </form>

      <Form
        form={form}
        name="dynamic_form_nest_item"
        onFinish={onFinish}
        autoComplete="off"
      >
        <label>
          <b style={{ fontSize: "16px" }}>Create Variant</b>
        </label>
        <Form.List name="variant">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <Space
                  key={key}
                  style={{ display: "flex", marginBottom: 8 }}
                  align="baseline"
                >
                  <Form.Item
                    {...restField}
                    name={[name, "name"]}
                    fieldKey={[fieldKey, "name"]}
                    rules={[{ required: true, message: "Missing name" }]}
                  >
                    <Input
                      placeholder="Name (ex. 250grams, black, small, etc.)"
                      style={{ width: "340px", maxWidth: "auto" }}
                      onChange={handleVariantDetails}
                    />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "quantity"]}
                    fieldKey={[fieldKey, "quantity"]}
                    rules={[{ required: true, message: "Missing quantity" }]}
                  >
                    <Input
                      type="number"
                      placeholder="Quantity"
                      onChange={handleVariantDetails}
                    />
                  </Form.Item>
                  <MinusCircleOutlined
                    onClick={() => {
                      remove(name);
                      handleVariantDetails();
                    }}
                  />
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add Variant
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            Save Variants
          </Button>
        </Form.Item>
      </Form>

      {loading && (
        <h4 style={{ margin: "20px 0" }}>
          <LoadingOutlined />
        </h4>
      )}

      <Button
        onClick={handleSubmit}
        type="primary"
        className="mb-3"
        block
        shape="round"
        size="large"
        disabled={loading}
        style={{ marginTop: "30px", width: "150px" }}
      >
        Submit
      </Button>
    </div>
  );
};

export default ProductCreateForm;
