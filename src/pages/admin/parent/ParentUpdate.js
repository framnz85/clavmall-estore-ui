import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Joi from "joi-browser";
import { toast } from "react-toastify";
import { Button } from "antd";

import AdminNav from "../../../components/nav/AdminNav";
import ParentInputs from "../../../components/forms/parent/ParentInputs";
import AddDomain from "../../../components/common/addDomain";

import { getCategories } from "../../../functions/category";
import { updateParent } from "../../../functions/parent";
import { updateChanges } from "../../../functions/estore";

const initialState = {
  name: "",
  category: "",
  itemsCount: 0,
  pageSize: 20,
  currentPage: 1,
  sortkey: "",
  sort: -1,
  searchQuery: "",
};

const ParentUpdate = ({ history, match }) => {
  let dispatch = useDispatch();

  const [values, setValues] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const { user, categories, parents, estore } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadCategories();
    loadParent();
    return () => (setValues({}))
  }, [history, match, parents]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadCategories = () => {
    if (typeof window !== undefined) {
      if (!localStorage.getItem("categories")) {
        setLoading(true);
        getCategories(user.address ? user.address : {}).then((category) => {
          dispatch({
            type: "CATEGORY_LIST_XI",
            payload: category.data.categories,
          });
          dispatch({
              type: "PRODUCT_LIST_XIV",
              payload: category.data.products,
          });
          setLoading(false);
        });
      }
    }
  };

  const loadParent = () => {
    const parentName = parents.filter(
      (parent) => parent.slug === match.params.slug
    );
    if (parentName[0]) {
      setValues({
        ...values,
        name: parentName[0].name,
        category: parentName[0].parent,
      });
    } else {
      history.push("/admin/parent");
    }
  };

  const schema = {
    name: Joi.string().min(2).max(32).required(),
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validate = Joi.validate({ name: values.name }, schema, {
      abortEarly: false,
    });

    if (validate.error) {
      for (let item of validate.error.details) toast.error(item.message);
      return;
    }

    setLoading(true);

    updateParent(match.params.parSlug, match.params.slug, { name: values.name, parent: values.category }, user.token)
      .then((res) => {
        setValues({
          ...values,
          name: "",
          category: "",
        })

        parents.forEach((parent) => {
          if (parent.slug === match.params.slug) {
            parent.name = res.data.name;
            parent.slug = res.data.slug;
          }
        });

        dispatch({
          type: "PARENT_LIST_IX",
          payload: parents,
        });
        updateChanges(
          estore._id,
          "parentChange",
          user.token
        ).then((res) => {
          dispatch({
            type: "ESTORE_INFO_XVIII",
            payload: res.data,
          });
        });
        history.push("/admin/parent");
        setLoading(false);
        toast.success(`"${res.data.name}" is updated.`);
      })
      .catch((error) => {
        if (error.response.status === 400 || 404)
          toast.error(error.response.data);
        else toast.error(error.message);
        setLoading(false);
      });
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-m-2">
          <AdminNav />
        </div>
        <div className="col-md-10 bg-white mt-3 mb-5">
          <h4 style={{ margin: "20px 0" }}>Update Product Parent</h4>
          <hr />

          <ParentInputs
            values={values}
            setValues={setValues}
            loading={loading}
            setLoading={setLoading}
            categories={categories}
            edit={false}
          />

          <Button
            onClick={handleSubmit}
            type="primary"
            className="mb-3"
            block
            shape="round"
            size="large"
            disabled={values.name.length < 2 || loading}
            style={{ marginTop: "30px", width: "150px" }}
          >
            Save
          </Button>
          <br /><br />
          <br /><br />
          
          <div style={{ paddingBottom: 10 }}>
            <AddDomain />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentUpdate;
