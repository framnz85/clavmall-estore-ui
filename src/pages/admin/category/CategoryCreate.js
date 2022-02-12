import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Joi from "joi-browser";
import { toast } from "react-toastify";
import { Modal } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import _ from "lodash";
import {
  createCategory,
  getCategories,
  removeCategory,
} from "../../../functions/category";
import AdminNav from "../../../components/nav/AdminNav";
import CategoryForm from "../../../components/forms/CategoryForms";
import LocalSearch from "../../../components/forms/LocalSearch";
import { updateChanges } from "../../../functions/estore";

const { confirm } = Modal;

const CategoryCreate = () => {
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");

  const { estore, user, categories, products } = useSelector((state) => ({
    ...state,
  }));

  useEffect(() => {
    loadCategories();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadCategories = () => {
    if (typeof window !== undefined) {
      if (!localStorage.getItem("categories")) {
        setLoading(true);
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
          setLoading(false);
        });
      }
    }
  };

  const schema = {
    name: Joi.string().min(2).max(32).required(),
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validate = Joi.validate({ name }, schema, {
      abortEarly: false,
    });
    if (validate.error) {
      for (let item of validate.error.details) toast.error(item.message);
      return;
    }
    setLoading(true);
    createCategory({ name }, user.token)
      .then((res) => {
        setLoading(false);
        setName("");
        toast.success(`"${res.data.name}" is created.`);
        categories.push(res.data);
        dispatch({
          type: "CATEGORY_LIST",
          payload: [...categories],
        });
        localStorage.setItem("categories", JSON.stringify(categories));
        updateChanges(
          process.env.REACT_APP_ESTORE_ID,
          "categoryChange",
          user.token
        ).then((res) => {
          dispatch({
            type: "ESTORE_INFO",
            payload: res.data,
          });
          localStorage.setItem("estore", JSON.stringify(res.data));
        });
      })
      .catch((error) => {
        if (error.response.status === 400 || 404)
          toast.error(error.response.data);
        else toast.error(error.message);
        setLoading(false);
      });
  };

  const handleRemove = async (slug, name) => {
    confirm({
      title: "Are you sure you want to delete " + name + "?",
      icon: <ExclamationCircleOutlined />,
      content:
        "Make sure you have deleted all the products under this category first.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        setLoading(true);
        removeCategory(slug, user.token)
          .then((res) => {
            setLoading(false);
            toast.error(`"${res.data.name}" deleted.`);
            const result = categories.filter(
              (category) => category.slug !== slug
            );
            dispatch({
              type: "CATEGORY_LIST",
              payload: [...result],
            });
            localStorage.setItem("categories", JSON.stringify(result));
            updateChanges(
              process.env.REACT_APP_ESTORE_ID,
              "categoryChange",
              user.token
            ).then((res) => {
              dispatch({
                type: "ESTORE_INFO",
                payload: res.data,
              });
              localStorage.setItem("estore", JSON.stringify(res.data));
            });
          })
          .catch((error) => {
            if (error.response.status === 400) toast.error(error.response.data);
            else toast.error(error.message);
            setLoading(false);
          });
      },
      onCancel() {},
    });
  };

  const searched = (keyword) => (category) =>
    category.name.toLowerCase().includes(keyword);

  return (
    <div className="container">
      <div className="row">
        <div className="col-m-2">
          <AdminNav />
        </div>
        <div className="col-md-10 bg-white mt-3 mb-5">
          <h4 style={{ margin: "20px 0" }}>Add Category</h4>
          <CategoryForm
            handleSubmit={handleSubmit}
            name={name}
            setName={setName}
            loading={loading}
            placeholder="Enter a category"
          />
          <hr />
          <h4 style={{ margin: "20px 0" }}>Your Categories</h4>
          <LocalSearch
            keyword={keyword}
            setKeyword={setKeyword}
            placeholder="Search category"
          />

          {loading && (
            <h4 style={{ margin: "20px 0" }}>
              <LoadingOutlined />
            </h4>
          )}

          {categories &&
            categories.filter(searched(keyword)).map((category) => (
              <div
                className="alert alert-success"
                key={category._id}
                style={{ backgroundColor: estore.carouselColor }}
              >
                {category.name}{" "}
                <span
                  onClick={() => handleRemove(category.slug, category.name)}
                  className="btn btn-sm float-right"
                >
                  <DeleteOutlined className="text-danger" />
                </span>{" "}
                <Link to={`/admin/category/${category.slug}`}>
                  <span className="btn btn-sm float-right">
                    <EditOutlined className="text-secondary" />
                  </span>
                </Link>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryCreate;
