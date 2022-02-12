import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Pagination } from "antd";
import ProductCard from "../../components/cards/ProductCard";
import LoadingCard from "../../components/cards/LoadingCard";

const BestSeller = () => {
  const itemPerPage = 10;

  const { estore, products } = useSelector((state) => ({ ...state }));

  const [page, setPage] = useState(1);
  const [values, setValues] = useState([]);

  useEffect(() => {
    setValues([...products]);
  }, [products]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <h4
        className="alert alert-success text-center p-3 mt-5 mb-3 display-5 jumbotron"
        style={{ backgroundColor: estore.carouselColor }}
      >
        Best Seller
      </h4>

      <div className="container">
        {values.length < 1 ? (
          <LoadingCard count={10} />
        ) : (
          <div className="row" style={{ marginLeft: "2px" }}>
            {values
              .sort((a, b) => b.sold - a.sold)
              .slice((page - 1) * itemPerPage, page * itemPerPage)
              .map((product) => (
                <div
                  key={product._id}
                  className="col-m-2"
                  style={{ margin: "0 10px 10px 0" }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
          </div>
        )}
      </div>

      <Pagination
        current={page}
        total={(products.length / itemPerPage) * 10}
        onChange={(value) => setPage(value)}
        className="text-center pt-3"
      />
    </>
  );
};

export default BestSeller;
