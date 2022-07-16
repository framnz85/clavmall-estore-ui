import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Pagination } from "antd";
import ProductCard from "../cards/ProductCard";
import LoadingCard from "../cards/LoadingCard";
import { isMobile } from 'react-device-detect';

const NewArrival = () => {
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
        New Arrival
      </h4>

      <div className="container" style={isMobile ? {margin: "5px", padding: 0} : {}}>
        {values.length < 1 ? (
          <LoadingCard count={10} />
        ) : (
          <div className="row" style={{ marginLeft: "2px" }}>
            {values
              .sort((a, b) => {
                var c = new Date(a.createdAt);
                var d = new Date(b.createdAt);
                return d - c;
              })
              .slice((page - 1) * itemPerPage, page * itemPerPage)
              .map((product) => (
                <div
                  key={product._id}
                  className="col-m-2"
                  style={{ margin: "0 5px 5px 0" }}
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

export default NewArrival;
