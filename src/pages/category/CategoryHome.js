import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import CategoryHomeList from "./../../components/category/CategoryHomeList";

import { getCategories, getProductByCategory } from "../../functions/category";
import getUnique from "../../components/common/getUnique";

const CategoryHome = ({ match }) => {
  let dispatch = useDispatch();

  const { estore, categories, products, user } = useSelector((state) => ({
    ...state,
  }));

  const [category, setCategory] = useState({});
  const [values, setValues] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadCategories();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    loadProductCategory();
  }, [match.params.slug, categories]); // eslint-disable-line react-hooks/exhaustive-deps

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
            type: "CATEGORY_LIST_XII",
            payload: category.data.categories,
          });
          dispatch({
              type: "PRODUCT_LIST_XV",
              payload: category.data.products,
          });
          setLoading(false);
        });
      }
    }
  };

  const loadProductCategory = () => {
    const thisCategory = categories.filter(
      (category) => category.slug === match.params.slug
    );

    if (thisCategory[0]) {
      setCategory(thisCategory[0]);
      document.title = thisCategory[0].name + " | " + estore.name;

      const productCategory = products.filter(
        (product) => product.category._id === thisCategory[0]._id
      );

      if (productCategory.length < 20) {
        setValues(productCategory);
        getProductByCategory(
          thisCategory[0]._id,
          user.address ? user.address : {}
        ).then((product) => {
          const unique = getUnique(products, product.data);
          setValues(
            unique.all.filter(
              (product) => product.category._id === thisCategory[0]._id
            )
          );
          dispatch({
            type: "PRODUCT_LIST_XV",
            payload: product.data,
          });
        });
      } else {
        setValues(
          products.filter(
            (product) => product.category._id === thisCategory[0]._id
          )
        );
      }
    }
  };

  return (
    <CategoryHomeList
      category={category}
      products={values}
      loading={loading}
      carouselColor={estore.carouselColor}
    />
  );
};

export default CategoryHome;
