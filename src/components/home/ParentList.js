import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
import { getParents } from "../../functions/parent";

const ParentList = () => {
  let dispatch = useDispatch();

  const { parents } = useSelector((state) => ({ ...state }));

  const [values, setValues] = useState([...parents]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadParents();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadParents = () => {
    if (typeof window !== undefined) {
      if (!localStorage.getItem("parents")) {
        setLoading(true);
        getParents(50).then((parent) => {
          dispatch({
            type: "PARENT_LIST_VI",
            payload: parent.data,
          });
          setValues(parent.data);
          setLoading(false);
        });
      }
    }
  };

  const showParents = () =>
    values
      .filter(parent => parent._id !== "all")
      .sort(() => Math.random() - 0.5)
      .slice(0, 36)
      .map((p) => (
        <Link
          to={`/parent/${p.slug}`}
          key={p._id}
          className="row text-secondary m-2 pl-2"
        >
          {p.name}
        </Link>
      ));

  return (
    <div className="container pb-5 mt-3">
      <h5>Top Brands</h5>
      <div className="row bg-white text-center m-1 p-0">
        {loading ? (
          <h4 className="text-center" style={{ margin: "20px 0" }}>
            <LoadingOutlined />
          </h4>
        ) : (
          showParents()
        )}
      </div>
    </div>
  );
};

export default ParentList;
