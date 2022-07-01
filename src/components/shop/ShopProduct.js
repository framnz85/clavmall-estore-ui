import React from "react";
import {  useSelector } from "react-redux";
import { Button } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import ProductCard from "../cards/ProductCard";

const ShopProduct = ({
  search,
  loading,
  loadMore,
  loadRandomProducts,
}) => {
  const { products } = useSelector((state) => ({
    ...state,
  }));

  const {
    products: searchProducts,
    page,
    showItemCount,
  } = search;

  return (
    <>
      {searchProducts.length < 1 && (
        <>
          <p className="text-danger">No products found for this search</p>
          <h4 style={{ margin: "50px 0 20px 0" }}>
            {loading ? <LoadingOutlined /> : "Items you may also like"}
          </h4>
          <div className="row">
            {products.length > 0 &&
              products.slice(0, showItemCount).map((product) => {
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
        </>
      )}

      <div className="row">
        {searchProducts.length > 0 &&
          searchProducts.slice(0, page * showItemCount).map((product) => {
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
        {searchProducts.length > 0 && (
          <Button
            block
            size="large"
            onClick={() => loadRandomProducts(page + 1, search)}
            style={{ marginRight: "66px", marginBottom: "20px" }}
          >
            {loadMore ? <LoadingOutlined /> : "Load More"}
          </Button>
        )}
      </div>
    </>
  );
};

export default ShopProduct;
