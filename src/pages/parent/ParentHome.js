import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import ParentHomeList from "./../../components/parent/ParentHomeList";

import { getParents, getProductByParent } from "../../functions/parent";
import { getCategories } from "../../functions/category";
import getUnique from "../../components/common/getUnique";

const ParentHome = ({ match }) => {
  let dispatch = useDispatch();

  const { estore, products, parents, user } = useSelector(
    (state) => ({
      ...state,
    })
  );

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
      if (!localStorage.getItem("parents") || parents.length < 100) {
        setLoading(true);
        getParents().then((parent) => {
          dispatch({
            type: "PARENT_LIST_X",
            payload: parent.data,
          });
          setLoading(false);
        });
      }
    }
  };

  const loadProductParents = () => {
    const thisParent = parents.filter((parent) => parent.slug === slug);

    if (thisParent[0]) {
      setParent(thisParent[0]);
      document.title = thisParent[0].name + " | " + estore.name;

      const productParent = products.filter(
        (product) => product.parent && product.parent._id === thisParent[0]._id
      );

      if (productParent.length < 20) {
        setValues(productParent);
        getProductByParent(
          thisParent[0]._id,
          user.address ? user.address : {}
        ).then((product) => {
          const unique = getUnique(products, product.data);
          setValues(
            unique.all.filter((product) => product.parent && product.parent._id === thisParent[0]._id)
          );
          dispatch({
            type: "PRODUCT_LIST_XVI",
            payload: product.data,
          });
        });
      } else {
        setValues(
          products.filter((product) => product.parent && product.parent._id === thisParent[0]._id)
        );
      }
    }

    loadCategories();
  };

  const loadCategories = () => {
    if (typeof window !== undefined) {
      if (
        !localStorage.getItem("categories") ||
        !localStorage.getItem("products") ||
        !JSON.parse(localStorage.getItem("products")).length
      ) {
        setLoading(true);
        getCategories(user.address ? user.address : {}).then((category) => {
          dispatch({
            type: "CATEGORY_LIST_XIII",
            payload: category.data.categories,
          });
          dispatch({
              type: "PRODUCT_LIST_XVI",
              payload: category.data.products,
          });
          setLoading(false);
        });
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
