import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Joi from "joi-browser";
import { toast } from "react-toastify";
import { updateParent } from "../../../functions/parent";
import AdminNav from "../../../components/nav/AdminNav";
import CategoryForm from "../../../components/forms/CategoryForms";
import { updateChanges } from "../../../functions/estore";

const ParentUpdate = ({ history, match }) => {
  const dispatch = useDispatch();

  const { user, parents } = useSelector((state) => ({ ...state }));

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadParent = () => {
      const parentName = parents.filter(
        (parent) => parent.slug === match.params.slug
      );
      if (parentName[0]) {
        setName(parentName[0].name);
      } else {
        history.push("/admin/parent");
      }
    };
    loadParent();
  }, [history, match, parents]);

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

    updateParent(match.params.slug, { name }, user.token)
      .then((res) => {
        setLoading(false);
        toast.success(`"${res.data.name}" is updated.`);

        parents.forEach((parent) => {
          if (parent.slug === match.params.slug) {
            parent.name = res.data.name;
            parent.slug = res.data.slug;
          }
        });

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
        history.push("/admin/parent");
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
          <h4 style={{ margin: "20px 0" }}>Update Parent Product</h4>
          <CategoryForm
            handleSubmit={handleSubmit}
            name={name}
            setName={setName}
            loading={loading}
            placeholder="Enter a parent type"
          />
        </div>
      </div>
    </div>
  );
};

export default ParentUpdate;
