import React from "react";
import {  useSelector } from "react-redux";
import { Button } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import ProductCard from "../cards/ProductCard";

const ShopProduct = ({
  values,
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
  } = values;

  return (
    <>
      {searchProducts.length < 1 && (
        <>
          {!loading && <p className="text-danger">No products found for this search</p>}
          <h4 style={{ margin: "50px 0 20px 0" }}>
            {loading ? <LoadingOutlined /> : "Items you may also like"}
          </h4>
          <div>
            {products.length > 0 &&
              products.slice(0, showItemCount).map((product) => {
                return (
                  <ProductCard product={product} priceShow={true} shop={true} key={product._id} />
                );
              })}
          </div>
        </>
      )}

      <div>
        {searchProducts.length > 0 &&
          searchProducts.slice(0, page * showItemCount).map((product) => {
            return (
              <ProductCard product={product} priceShow={true} shop={true} key={product._id} />
            );
          })}
        {searchProducts.length > 0 && (
          <Button
            block
            size="large"
            onClick={() => loadRandomProducts(page + 1)}
            style={{ marginBottom: "60px" }}
          >
            {loadMore ? <LoadingOutlined /> : "Load More"}
          </Button>
        )}
      </div>
    </>
  );
};

export default ShopProduct;
