import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Joi from "joi-browser";
import { toast } from "react-toastify";
import { Button } from "antd";

import AdminNav from "../../../components/nav/AdminNav";
import CategoryInputs from "../../../components/forms/category/CategoryInputs";
import CategoryImage from "../../../components/forms/category/CategoryImage";
import AddDomain from "../../../components/common/addDomain";

import { updateCategory } from "../../../functions/category";
import { updateChanges } from "../../../functions/estore";

const initialState = {
  name: "",
  slug: "",
  images: [],
  itemsCount: 0,
  pageSize: 20,
  currentPage: 1,
  sortkey: "",
  sort: -1,
  searchQuery: "",
};

const CategoryUpdate = ({ history, match }) => {
  let dispatch = useDispatch();

  const [values, setValues] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const { user, categories, estore } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadCategory();
  }, [history, match, categories]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadCategory = () => {
    const categoryName = categories.filter(
      (category) => category.slug === match.params.slug
    );
    if (categoryName[0]) {
      setValues({
        ...values,
        slug: categoryName[0].slug,
        name: categoryName[0].name,
        images: categoryName[0].images
      });
    } else {
      history.push("/admin/category");
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

    updateCategory(match.params.slug, { name: values.name, images: values.images }, user.token)
      .then((res) => {
        setLoading(false);
        toast.success(`"${res.data.name}" is updated.`);

        categories.forEach((category) => {
          if (category.slug === match.params.slug) {
            category.name = res.data.name;
            category.slug = res.data.slug;
            category.images = res.data.images;
          }
        });

        dispatch({
          type: "CATEGORY_LIST_X",
          payload: categories,
        });
        updateChanges(
          estore._id,
          "categoryChange",
          user.token
        ).then((res) => {
          dispatch({
            type: "ESTORE_INFO_XV",
            payload: res.data,
          });
        });
        history.push("/admin/category");
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
          <h4 style={{ margin: "20px 0" }}>Update Category</h4>
          <hr />

          <CategoryInputs
            values={values}
            setValues={setValues}
            loading={loading}
            setLoading={setLoading}
            edit={false}
          />
          
          <label><b>Add Image</b></label>
          <CategoryImage
            values={values}
            setValues={setValues}
            width={150}
            height={150}
            edit={true}
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
          
          <div style={{ paddingBottom: 10 }}>
            <AddDomain />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryUpdate;
