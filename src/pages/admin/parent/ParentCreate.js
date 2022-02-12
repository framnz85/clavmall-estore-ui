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
import {
  createParent,
  getParents,
  removeParent,
} from "../../../functions/parent";
import AdminNav from "../../../components/nav/AdminNav";
import CategoryForm from "../../../components/forms/CategoryForms";
import LocalSearch from "../../../components/forms/LocalSearch";
import { updateChanges } from "../../../functions/estore";

const { confirm } = Modal;

const ParentCreate = () => {
  const dispatch = useDispatch();

  const { estore, user, parents } = useSelector((state) => ({ ...state }));

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    loadParents();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadParents = () => {
    if (typeof window !== undefined) {
      if (!localStorage.getItem("parents")) {
        setLoading(true);
        getParents().then((parent) => {
          dispatch({
            type: "PARENT_LIST",
            payload: parent.data,
          });
          localStorage.setItem("parents", JSON.stringify(parent.data));
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

    createParent({ name }, user.token)
      .then((res) => {
        setLoading(false);
        setName("");
        toast.success(`"${res.data.name}" is created.`);
        parents.push(res.data);
        dispatch({
          type: "PARENT_LIST",
          payload: [...parents],
        });
        localStorage.setItem("parents", JSON.stringify(parents));
        updateChanges(
          process.env.REACT_APP_ESTORE_ID,
          "parentChange",
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
        "Make sure you have deleted all the products under this parent product first.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        setLoading(true);
        removeParent(slug, user.token)
          .then((res) => {
            setLoading(false);
            toast.error(`"${res.data.name}" deleted.`);
            const result = parents.filter((parent) => parent.slug !== slug);
            dispatch({
              type: "PARENT_LIST",
              payload: [...result],
            });
            localStorage.setItem("categories", JSON.stringify(result));
            updateChanges(
              process.env.REACT_APP_ESTORE_ID,
              "parentChange",
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

  const searched = (keyword) => (parent) =>
    parent.name.toLowerCase().includes(keyword);

  return (
    <div className="container">
      <div className="row">
        <div className="col-m-2">
          <AdminNav />
        </div>
        <div className="col-md-10 bg-white mt-3 mb-5">
          <h4 style={{ margin: "20px 0" }}>Add Parent Product</h4>
          <CategoryForm
            handleSubmit={handleSubmit}
            name={name}
            setName={setName}
            loading={loading}
            placeholder="Ex. Pampers, Bear Brand, etc."
          />
          <hr />
          <h4 style={{ margin: "20px 0" }}>Your Parent Products</h4>
          <LocalSearch
            keyword={keyword}
            setKeyword={setKeyword}
            placeholder="Search parent type"
          />

          {loading && (
            <h4 style={{ margin: "20px 0" }}>
              <LoadingOutlined />
            </h4>
          )}

          {parents.filter(searched(keyword)).map((parent) => (
            <div
              className="alert alert-success"
              key={parent._id}
              style={{ backgroundColor: estore.carouselColor }}
            >
              {parent.name}{" "}
              <span
                onClick={() => handleRemove(parent.slug, parent.name)}
                className="btn btn-sm float-right"
              >
                <DeleteOutlined className="text-danger" />
              </span>{" "}
              <Link to={`/admin/parent/${parent.slug}`}>
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

export default ParentCreate;
