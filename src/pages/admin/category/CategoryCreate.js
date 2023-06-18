import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Joi from "joi-browser";
import { toast } from "react-toastify";
import { Button } from "antd";

import AdminNav from "../../../components/nav/AdminNav";
import CategoryInputs from "../../../components/forms/category/CategoryInputs";
import CatCustomTable from "../../../components/forms/category/CatCustomTable";
import EstoreExpired from "../../../components/common/EstoreExpired";
import CategoryImage from "../../../components/forms/category/CategoryImage";
import AddDomain from "../../../components/common/addDomain";

import { createCategory } from "../../../functions/category";
import { uploadThumbImage } from "../../../functions/admin";
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

const CategoryCreate = () => {
  let dispatch = useDispatch();

  const [values, setValues] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const { user, categories, estore } = useSelector((state) => ({
    ...state,
  }));

  const schema = {
    name: Joi.string().min(2).max(32).required(),
  };

  const handleSubmit = async (e) => {
    let result;
    let allUploadedFiles = [];
    
    e.preventDefault();

    const validate = Joi.validate({ name: values.name }, schema, {
      abortEarly: false,
    });

    if (validate.error) {
      for (let item of validate.error.details) toast.error(item.message);
      return;
    }
    setLoading(true);

    for (let i = 0; i < values.images.length; i++) {
      result = await uploadThumbImage(values.images[i].url, estore, user.token);
      allUploadedFiles.push(result.data);
    }

    createCategory({ name: values.name, images: allUploadedFiles }, user.token)
      .then((res) => {
        setValues({
          ...values,
          name: "",
          images: [],
        })
        categories.push(res.data.ops[0]);
        dispatch({
          type: "CATEGORY_LIST_IX",
          payload: categories,
        });
        updateChanges(
          estore._id,
          "categoryChange",
          user.token
        ).then((res) => {
          dispatch({
            type: "ESTORE_INFO_XIV",
            payload: res.data,
          });
        });
        setLoading(false);
        toast.success(`"${res.data.ops[0].name}" is created.`);
      })
      .catch((error) => {
        toast.error(error.message);
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
          <EstoreExpired />
          
          <h4 style={{ margin: "20px 0" }}>Add Category</h4>
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
            Submit
          </Button>

          <h4 style={{ margin: "20px 0" }}>Your Categories</h4>
          <hr />

          <CatCustomTable
            values={values}
            setValues={setValues}
            loading={loading}
            setLoading={setLoading}
          />
          <br /><br />
          
          <div style={{ paddingBottom: 10 }}>
            <AddDomain />
          </div>

        </div>
      </div>
    </div>
  );
};

export default CategoryCreate;
