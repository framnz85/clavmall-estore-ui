import React from "react";
import ProductCard from "../../components/cards/ProductCard";
import LoadingCard from "../../components/cards/LoadingCard";
import CategoryProducts from "./../home/CategoryProducts";
import SubcatList from "./../home/SubcatList";
import ParentList from "./../home/ParentList";

const SubcatHomeList = ({ subcat, products, loading, carouselColor }) => {
  return (
    <>
      <h4
        className="alert alert-success text-center p-3 mt-5 mb-3 display-5 jumbotron"
        style={{ backgroundColor: carouselColor }}
      >
        All {subcat.name}
      </h4>

      <div className="container">
        {loading ? (
          <LoadingCard count={20} />
        ) : (
          <div className="row" style={{ marginLeft: "2px" }}>
            {products.map((product) => {
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
        )}
      </div>

      <CategoryProducts others={true} />

      <div className="bg-white mt-3 p-3">
        <SubcatList others={true} />
        <ParentList />
      </div>
    </>
  );
};

export default SubcatHomeList;
