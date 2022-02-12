import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Joi from "joi-browser";
import { toast } from "react-toastify";
import { Modal } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  CaretRightOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import _ from "lodash";
import { getCategories } from "../../../functions/category";
import {
  createSubcat,
  getSubcats,
  removeSubcat,
} from "../../../functions/subcat";
import AdminNav from "../../../components/nav/AdminNav";
import CategoryForm from "../../../components/forms/CategoryForms";
import LocalSearch from "../../../components/forms/LocalSearch";
import { updateChanges } from "../../../functions/estore";

const { confirm } = Modal;

const SubcatCreate = () => {
  const dispatch = useDispatch();

  const { estore, user, categories, products, subcats } = useSelector(
    (state) => ({
      ...state,
    })
  );

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState([]);
  const [subcatRender, setSubcatRender] = useState([]);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    loadCategories();
    loadSubcats();
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

  const loadSubcats = () => {
    if (typeof window !== undefined) {
      if (!localStorage.getItem("subcats")) {
        setLoading(true);
        getSubcats().then((subcat) => {
          dispatch({
            type: "SUBCAT_LIST",
            payload: subcat.data,
          });
          localStorage.setItem("subcats", JSON.stringify(subcat.data));
          setSubcatRender(subcat.data);
          setLoading(false);
        });
      } else {
        setSubcatRender(subcats);
      }
    }
  };

  const schema = {
    name: Joi.string().min(2).max(32).required(),
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category) {
      toast.error("Please select a category");
      return;
    }

    const validate = Joi.validate({ name }, schema, {
      abortEarly: false,
    });

    if (validate.error) {
      for (let item of validate.error.details) toast.error(item.message);
      return;
    }

    setLoading(true);

    createSubcat({ name, parent: category }, user.token)
      .then((res) => {
        setLoading(false);
        setName("");
        toast.success(`"${res.data.name}" is created.`);
        subcats.push(res.data);
        dispatch({
          type: "SUBCAT_LIST",
          payload: [...subcats],
        });
        localStorage.setItem("subcats", JSON.stringify(subcats));
        updateChanges(
          process.env.REACT_APP_ESTORE_ID,
          "subcatChange",
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
        "Make sure you have deleted all the products under this sub-category first.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        setLoading(true);
        removeSubcat(slug, user.token)
          .then((res) => {
            setLoading(false);
            toast.error(`"${res.data.name}" deleted.`);
            const result = subcats.filter((subcat) => subcat.slug !== slug);
            dispatch({
              type: "SUBCAT_LIST",
              payload: [...result],
            });
            localStorage.setItem("subcats", JSON.stringify(result));
            updateChanges(
              process.env.REACT_APP_ESTORE_ID,
              "subcatChange",
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

  const handleShowByCat = async (value) => {
    if (value) setSubcatRender(subcats.filter((sub) => sub.parent === value));
    else setSubcatRender(subcats);
  };

  const searched = (keyword) => (subcat) =>
    subcat.name.toLowerCase().includes(keyword);

  return (
    <div className="container">
      <div className="row">
        <div className="col-m-2">
          <AdminNav />
        </div>
        <div className="col-md-10 bg-white mt-3 mb-5">
          <h4 style={{ margin: "20px 0" }}>Add Sub-Category</h4>

          <div className="form-group">
            <select
              name="category"
              className="form-control"
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select a category</option>
              {categories.length > 0 &&
                categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
            </select>
          </div>

          <CategoryForm
            handleSubmit={handleSubmit}
            name={name}
            setName={setName}
            loading={loading}
            placeholder="Enter a sub-category"
          />
          <hr />
          <h4 style={{ margin: "20px 0" }}>Your Sub-Categories</h4>
          <div className="form-group">
            <select
              name="category"
              className="form-control"
              onChange={(e) => handleShowByCat(e.target.value)}
            >
              <option value="">Search by category</option>
              <option value="">All</option>
              {categories.length > 0 &&
                categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
            </select>
          </div>
          <LocalSearch
            keyword={keyword}
            setKeyword={setKeyword}
            placeholder="Search sub-category"
          />

          {loading && (
            <h4 style={{ margin: "20px 0" }}>
              <LoadingOutlined />
            </h4>
          )}

          {subcatRender.filter(searched(keyword)).map((subcat) => (
            <div
              className="alert alert-success"
              key={subcat._id}
              style={{ backgroundColor: estore.carouselColor }}
            >
              {subcat.name} &nbsp;&nbsp;&nbsp;
              <CaretRightOutlined />
              &nbsp;
              {categories.filter((c) => c._id === subcat.parent)[0].name}
              <span
                onClick={() => handleRemove(subcat.slug, subcat.name)}
                className="btn btn-sm float-right"
              >
                <DeleteOutlined className="text-danger" />
              </span>
              <Link to={`/admin/subcat/${subcat.slug}`}>
                <span className="btn btn-sm float-right">
                  <EditOutlined className="text-secondary" />
                </span>
              </Link>
            </div>
          ))}
          <div className="alert alert-secondary text-center">
            NOTE: To view your other sub-categories not show on this page,
            please use <b>Search by category</b> above.
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubcatCreate;
