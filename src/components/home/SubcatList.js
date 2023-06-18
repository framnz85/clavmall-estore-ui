import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
import { getSubcats } from "../../functions/subcat";

const SubcatList = ({ others }) => {
  let dispatch = useDispatch();

  const { subcats } = useSelector((state) => ({ ...state }));

  const [values, setValues] = useState([...subcats]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSubcats();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadSubcats = () => {
    if (typeof window !== undefined) {
      if (!localStorage.getItem("subcats")) {
        setLoading(true);
        getSubcats().then((subcat) => {
          dispatch({
            type: "SUBCAT_LIST_VI",
            payload: subcat.data,
          });
          setValues(subcat.data);
          setLoading(false);
        });
      }
    }
  };

  const showSubcats = () =>
    values
      .filter(subcat => subcat._id !== "all")
      .sort(() => Math.random() - 0.5)
      .slice(0, 36)
      .map((s) => (
        <Link
          to={`/subcats/${s.slug}`}
          key={s._id}
          className="row text-secondary m-2 pl-2"
        >
          {s.name}
        </Link>
      ));

  return (
    <div className="container pb-3 mt-3">
      {others ? <h5>Other Sub Categories</h5> : <h5>Sub Categories</h5>}
      <div className="row bg-white text-center m-1 p-0">
        {loading ? (
          <h4 className="text-center" style={{ margin: "20px 0" }}>
            <LoadingOutlined />
          </h4>
        ) : (
          showSubcats()
        )}
      </div>
    </div>
  );
};

export default SubcatList;
