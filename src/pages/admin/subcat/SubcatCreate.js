import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Joi from "joi-browser";
import { toast } from "react-toastify";
import { Button } from "antd";

import AdminNav from "../../../components/nav/AdminNav";
import SubcatInputs from "../../../components/forms/subcat/SubcatInputs";
import SubCustomTable from "../../../components/forms/subcat/SubCustomTable";
import EstoreExpired from "../../../components/common/EstoreExpired";
import AddDomain from "../../../components/common/addDomain";

import { createSubcat } from "../../../functions/subcat";
import { updateChanges } from "../../../functions/estore";

const initialState = {
  name: "",
  category: "",
  searchedCat: "",
  itemsCount: 0,
  pageSize: 20,
  currentPage: 1,
  sortkey: "",
  sortkeys: [
    { id: "1", label: "Ascending", value: "name", sort: 1 },
    { id: "2", label: "Descending", value: "name", sort: -1 },
  ],
  sort: -1,
  searchQuery: "",
};

const SubcatCreate = () => {
  let dispatch = useDispatch();

  const [values, setValues] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const { user, categories, subcats, estore } = useSelector(
    (state) => ({
      ...state,
    })
  );

  const schema = {
    name: Joi.string().min(2).max(32).required(),
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!values.category) {
      toast.error("Please select a category");
      return;
    }

    const validate = Joi.validate({ name: values.name }, schema, {
      abortEarly: false,
    });

    if (validate.error) {
      for (let item of validate.error.details) toast.error(item.message);
      return;
    }

    setLoading(true);

    createSubcat({ name: values.name, parent: values.category }, user.token)
      .then((res) => {
        setValues({
          ...values,
          name: "",
          category: "",
        })
        subcats.push(res.data.ops[0]);
        dispatch({
          type: "SUBCAT_LIST_IX",
          payload: subcats,
        });
        updateChanges(
          estore._id,
          "subcatChange",
          user.token
        ).then((res) => {
          dispatch({
            type: "ESTORE_INFO_XXI",
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
          
          <h4 style={{ margin: "20px 0" }}>Add Sub-Category</h4>
          <hr />

          <SubcatInputs
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
            Submit
          </Button>

          <h4 style={{ margin: "20px 0" }}>Your Sub-Categories</h4>
          <hr />

          <SubCustomTable
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

export default SubcatCreate;
