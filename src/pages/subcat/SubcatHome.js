import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import SubcatHomeList from "./../../components/subcat/SubcatHomeList";

import { getSubcats, getProductBySubcat } from "../../functions/subcat";
import { getCategories } from "../../functions/category";
import getUnique from "../../components/common/getUnique";

const SubcatHome = ({ match }) => {
  let dispatch = useDispatch();

  const { estore, products, subcats, user } = useSelector(
    (state) => ({ ...state })
  );

  const [subcat, setSubcat] = useState({});
  const [values, setValues] = useState([]);
  const [loading, setLoading] = useState(false);

  const { slug } = match.params;

  useEffect(() => {
    window.scrollTo(0, 0);
    loadSubcats();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    loadProductSubcats();
  }, [slug, subcats]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadSubcats = () => {
    if (typeof window !== undefined) {
      if (!localStorage.getItem("subcats") || subcats.length < 100) {
        setLoading(true);
        getSubcats().then((subcat) => {
          dispatch({
            type: "SUBCAT_LIST_XI",
            payload: subcat.data,
          });
          setLoading(false);
        });
      }
    }
  };

  const loadProductSubcats = () => {
    const thisSubcat = subcats.filter((subcat) => subcat.slug === slug);

    if (thisSubcat[0]) {
      setSubcat(thisSubcat[0]);
      document.title = thisSubcat[0].name + " | " + estore.name;

      const productSubcat = products.filter((product) =>
        product.subcats.map((subcat) => subcat && subcat._id).includes(thisSubcat[0]._id)
      );

      if (productSubcat.length < 20) {
        setValues(productSubcat);
        getProductBySubcat(
          thisSubcat[0]._id,
          user.address ? user.address : {}
        ).then((product) => {
          let result = [];
          product.data && product.data.map((data) => {
              const existProduct = products.filter(product => product._id === data._id);
              if (!existProduct.length) result.push(data);
              return result;
          });
          const unique = getUnique(products, product.data);
          setValues(
            unique.all.filter((product) =>
              product.subcats
                .map((subcat) => subcat && subcat._id)
                .includes(thisSubcat[0]._id)
            )
          );
          dispatch({
            type: "PRODUCT_LIST_XIX",
            payload: product.data,
          });
        });
      } else {
        setValues(
          products.filter((product) =>
            product.subcats
              .map((subcat) => subcat && subcat._id)
              .includes(thisSubcat[0]._id)
          )
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
            type: "CATEGORY_LIST_XIV",
            payload: category.data.categories,
          });
          dispatch({
              type: "PRODUCT_LIST_XIX",
              payload: category.data.products,
          });
          setLoading(false);
        });
      }
    }
  };

  return (
    <SubcatHomeList
      subcat={subcat}
      products={values}
      loading={loading}
      carouselColor={estore.carouselColor}
    />
  );
};

export default SubcatHome;
