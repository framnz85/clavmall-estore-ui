import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { getParents, getProductByParent } from "../../functions/parent";
import ParentHomeList from "./../../components/parent/ParentHomeList";

const ParentHome = ({ match }) => {
  const dispatch = useDispatch();

  const { estore, products, parents } = useSelector((state) => ({ ...state }));

  const [parent, setParent] = useState({});
  const [values, setValues] = useState([]);
  const [loading, setLoading] = useState(false);

  const { slug } = match.params;

  useEffect(() => {
    window.scrollTo(0, 0);
    loadParents();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    loadProductParents();
  }, [slug, parents]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const loadProductParents = () => {
    const thisParent = parents.filter((parent) => parent.slug === slug);

    if (thisParent[0]) {
      setParent(thisParent[0]);

      const productParent = products.filter(
        (product) => product.parent._id === thisParent[0]._id
      );

      if (productParent.length < 20) {
        setValues(productParent);
        getProductByParent(thisParent[0]._id).then((product) => {
          let unique = _.uniqWith([...products, ...product.data], _.isEqual);
          setValues(
            unique.filter((product) => product.parent._id === thisParent[0]._id)
          );
          dispatch({
            type: "PRODUCT_LIST",
            payload: unique,
          });
          localStorage.setItem("products", JSON.stringify(unique));
        });
      } else {
        setValues(
          products.filter((product) => product.parent._id === thisParent[0]._id)
        );
      }
    }
  };

  return (
    <ParentHomeList
      parent={parent}
      products={values}
      loading={loading}
      carouselColor={estore.carouselColor}
    />
  );
};

export default ParentHome;
