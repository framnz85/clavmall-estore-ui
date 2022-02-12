import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tabs } from "antd";
import _ from "lodash";
import {
  getProduct,
  productStar,
  getRelated,
  getParent,
} from "../functions/product";
import SingleProduct from "../components/product/SingleProduct";
import ProductCard from "../components/cards/ProductCard";

const { TabPane } = Tabs;

const initialState = {
  _id: "",
  title: "",
  description: "",
  supplierPrice: "",
  markup: "",
  price: "",
  category: "",
  subcats: [],
  parent: "",
  quantity: "",
  variants: [],
  images: [],
  ratings: [],
};

const Product = ({ match }) => {
  const dispatch = useDispatch();

  const { user, products } = useSelector((state) => ({ ...state }));

  const [product, setProduct] = useState(initialState);
  const [related, setRelated] = useState([]);
  const [parent, setParent] = useState([]);
  const [star, setStar] = useState(0);

  const slug = match.params.slug;

  useEffect(() => {
    window.scrollTo(0, 0);
    loadSingleProduct();
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadSingleProduct = () => {
    const thisProduct = products.filter((product) => product.slug === slug);
    if (thisProduct[0]) {
      setProduct({ ...initialState, ...thisProduct[0] });
      loadRatingDefault(thisProduct[0]);
      loadParentProducts(thisProduct[0]._id, thisProduct[0].parent);
      loadRelatedProducts(thisProduct[0]._id, thisProduct[0].category);
    } else {
      getProduct(slug).then((res) => {
        setProduct({ ...initialState, ...res.data });
        loadRatingDefault(res.data);
        loadParentProducts(res.data._id, res.data.parent);
        loadRelatedProducts(res.data._id, res.data.category);

        products.push(res.data);
      });
    }
  };

  const loadRatingDefault = (thisProduct) => {
    if (thisProduct.ratings && user) {
      let existingRatingObject = thisProduct.ratings.find(
        (ele) => ele.postedBy === user._id
      );
      setStar(existingRatingObject ? existingRatingObject.star : 0);
    }
  };

  const loadParentProducts = (prodId, parId) => {
    const parProducts = products.filter(
      (product) => product.parent === parId && product.slug !== slug
    );
    if (parProducts.length < 60) {
      getParent(prodId).then((res) => {
        setParent(res.data);

        let unique = _.uniqWith([...products, ...res.data], _.isEqual);
        dispatch({
          type: "PRODUCT_LIST",
          payload: unique,
        });
        localStorage.setItem("products", JSON.stringify(unique));
      });
    } else {
      setParent(parProducts);
    }
  };

  const loadRelatedProducts = (prodId, catId) => {
    const relProducts = products.filter(
      (product) => product.category === catId && product.slug !== slug
    );
    if (relProducts.length < 60) {
      getRelated(prodId).then((res) => {
        setRelated(res.data);

        let unique = _.uniqWith([...products, ...res.data], _.isEqual);
        dispatch({
          type: "PRODUCT_LIST",
          payload: unique,
        });
        localStorage.setItem("products", JSON.stringify(unique));
      });
    } else {
      setRelated(relProducts);
    }
  };

  const onStarClick = (newRating, name) => {
    setStar(newRating);
    productStar(name, newRating, user.token).then((res) => {
      const newProducts = products.map((product) =>
        product._id === res.data._id ? res.data : product
      );

      setProduct(res.data);

      dispatch({
        type: "PRODUCT_LIST",
        payload: newProducts,
      });
      localStorage.setItem("products", JSON.stringify(newProducts));
    });
  };

  return (
    <>
      <div className="container bg-white mt-3 p-4">
        <div className="row pt-4">
          <SingleProduct
            product={product}
            onStarClick={onStarClick}
            star={star}
          />
        </div>
      </div>

      <div className="container bg-white mt-3 p-4">
        <div className="row p-2">
          <Tabs type="card" defaultActiveKey="1" style={{ width: "100%" }}>
            <TabPane tab="Description" key="1">
              {product.description && product.description}
            </TabPane>
            <TabPane tab="More" key="2">
              More info soon...
            </TabPane>
          </Tabs>
        </div>
      </div>

      {parent.length > 0 && (
        <div className="container bg-white mt-3 p-3">
          <div className="row">
            <div className="col text-center pt-3 pb-3">
              <hr />
              <h5>Other Variant</h5>
              <hr />

              <div className="row" style={{ marginLeft: "2px" }}>
                {parent.map((product) => {
                  return (
                    <div
                      key={product._id}
                      className="col-m-2"
                      style={{ margin: "0 10px 10px 0" }}
                    >
                      <ProductCard product={product} priceShow={true} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {related.length > 0 && (
        <div className="container bg-white mt-3 p-3">
          <div className="row">
            <div className="col text-center pt-3 pb-3">
              <hr />
              <h5>Related Products</h5>
              <hr />

              <div className="row" style={{ marginLeft: "2px" }}>
                {related.map((product) => {
                  return (
                    <div
                      key={product._id}
                      className="col-m-2"
                      style={{ margin: "0 10px 10px 0" }}
                    >
                      <ProductCard product={product} priceShow={true} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="m-3">Footer</div>
    </>
  );
};

export default Product;
