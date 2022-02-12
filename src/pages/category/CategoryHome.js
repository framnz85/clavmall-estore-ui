import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { getCategories, getProductByCategory } from "../../functions/category";
import CategoryHomeList from "./../../components/category/CategoryHomeList";

const CategoryHome = ({ match }) => {
  const dispatch = useDispatch();

  const { estore, categories, products } = useSelector((state) => ({
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

  const loadProductCategory = () => {
    const thisCategory = categories.filter(
      (category) => category.slug === match.params.slug
    );
    if (thisCategory[0]) {
      setCategory(thisCategory[0]);

      const productCategory = products.filter(
        (product) => product.category._id === thisCategory[0]._id
      );

      if (productCategory.length < 20) {
        setValues(productCategory);
        getProductByCategory(thisCategory[0]._id).then((product) => {
          let unique = _.uniqWith([...products, ...product.data], _.isEqual);
          setValues(
            unique.filter(
              (product) => product.category._id === thisCategory[0]._id
            )
          );
          dispatch({
            type: "PRODUCT_LIST",
            payload: unique,
          });
          localStorage.setItem("products", JSON.stringify(unique));
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
