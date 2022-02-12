import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Joi from "joi-browser";
import { toast } from "react-toastify";
import _ from "lodash";
import { getCategories } from "../../../functions/category";
import { updateSubcat } from "../../../functions/subcat";
import AdminNav from "../../../components/nav/AdminNav";
import CategoryForm from "../../../components/forms/CategoryForms";
import { updateChanges } from "../../../functions/estore";

const SubcatUpdate = ({ history, match }) => {
  const dispatch = useDispatch();

  const { user, products, categories, subcats } = useSelector((state) => ({
    ...state,
  }));

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [parent, setParent] = useState("");

  useEffect(() => {
    loadCategories();
    loadSubcat();
  }, [match]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const loadSubcat = () => {
    const subcatName = subcats.filter(
      (subcat) => subcat.slug === match.params.slug
    );
    if (subcatName[0]) {
      setName(subcatName[0].name);
      setParent(subcatName[0].parent);
    } else {
      history.push("/admin/category");
    }
  };

  const schema = {
    name: Joi.string().min(2).max(32).required(),
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!parent) {
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

    updateSubcat(match.params.slug, { name, parent }, user.token)
      .then((res) => {
        setLoading(false);
        setName("");
        toast.success(`"${res.data.name}" is updated.`);

        subcats.forEach((subcat) => {
          if (subcat.slug === match.params.slug) {
            subcat.name = res.data.name;
            subcat.slug = res.data.slug;
          }
        });

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
        history.push("/admin/subcat");
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
          <h4 style={{ margin: "20px 0" }}>Update Sub-Category</h4>

          <div className="form-group">
            <select
              name="category"
              className="form-control"
              onChange={(e) => setParent(e.target.value)}
              value={parent}
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
        </div>
      </div>
    </div>
  );
};

export default SubcatUpdate;
