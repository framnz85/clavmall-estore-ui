import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { getSubcats, getProductBySubcat } from "../../functions/subcat";
import SubcatHomeList from "./../../components/subcat/SubcatHomeList";

const SubcatHome = ({ match }) => {
  const dispatch = useDispatch();

  const { estore, products, subcats } = useSelector((state) => ({ ...state }));

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
      if (!localStorage.getItem("subcats")) {
        setLoading(true);
        getSubcats().then((subcat) => {
          dispatch({
            type: "SUBCAT_LIST",
            payload: subcat.data,
          });
          localStorage.setItem("subcats", JSON.stringify(subcat.data));
          setLoading(false);
        });
      }
    }
  };

  const loadProductSubcats = () => {
    const thisSubcat = subcats.filter((subcat) => subcat.slug === slug);

    if (thisSubcat[0]) {
      setSubcat(thisSubcat[0]);

      const productSubcat = products.filter((product) =>
        product.subcats.map((subcat) => subcat._id).includes(thisSubcat[0]._id)
      );

      if (productSubcat.length < 20) {
        setValues(productSubcat);
        getProductBySubcat(thisSubcat[0]._id).then((product) => {
          let unique = _.uniqWith([...products, ...product.data], _.isEqual);
          setValues(
            unique.filter((product) =>
              product.subcats
                .map((subcat) => subcat._id)
                .includes(thisSubcat[0]._id)
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
          products.filter((product) =>
            product.subcats
              .map((subcat) => subcat._id)
              .includes(thisSubcat[0]._id)
          )
        );
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
