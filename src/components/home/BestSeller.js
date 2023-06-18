import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Pagination } from "antd";
import ProductCard from "../../components/cards/ProductCard";
import LoadingCard from "../../components/cards/LoadingCard";
import { isMobile } from 'react-device-detect';

const BestSeller = ({loading}) => {
  const itemPerPage = isMobile ? 6 : 12;

  const { estore, products } = useSelector((state) => ({ ...state }));

  const [page, setPage] = useState(1);
  const [values, setValues] = useState([]);

  useEffect(() => {
    setValues([...products]);
  }, [loading]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <h4
        className="alert alert-success text-center p-3 mt-5 mb-3 display-5 jumbotron"
        style={{ backgroundColor: estore.carouselColor }}
      >
        Best Seller
      </h4>

      <div className="container">
        {loading ? (
          <div style={{marginRight: 10}}>
            <LoadingCard count={isMobile ? 6 : 12} />
          </div>
        ) : (
          <div>
            {values
              .sort((a, b) => b.sold - a.sold)
              .slice((page - 1) * itemPerPage, page * itemPerPage)
              .map((product) => (
                <ProductCard product={product} key={product._id} />
              ))}
          </div>
        )}
      </div>
      <div style={{ clear: "both" }}>
        <Pagination
          current={page}
          total={(products.length / itemPerPage) * 10}
          onChange={(value) => setPage(value)}
          className="text-center pt-3"
        />
      </div>
    </>
  );
};

export default BestSeller;
