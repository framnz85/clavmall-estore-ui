import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Joi from "joi-browser";
import { toast } from "react-toastify";
import { updateCategory } from "../../../functions/category";
import AdminNav from "../../../components/nav/AdminNav";
import CategoryForm from "../../../components/forms/CategoryForms";
import { updateChanges } from "../../../functions/estore";

const CategoryUpdate = ({ history, match }) => {
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const { user, categories } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    const loadCategory = () => {
      const categoryName = categories.filter(
        (category) => category.slug === match.params.slug
      );
      if (categoryName[0]) {
        setName(categoryName[0].name);
      } else {
        history.push("/admin/category");
      }
    };

    loadCategory();
  }, [history, match, categories]);

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

    updateCategory(match.params.slug, { name }, user.token)
      .then((res) => {
        setLoading(false);
        toast.success(`"${res.data.name}" is updated.`);

        categories.forEach((category) => {
          if (category.slug === match.params.slug) {
            category.name = res.data.name;
            category.slug = res.data.slug;
          }
        });

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
          <CategoryForm
            handleSubmit={handleSubmit}
            name={name}
            setName={setName}
            loading={loading}
            placeholder="Enter a category"
          />
        </div>
      </div>
    </div>
  );
};

export default CategoryUpdate;
