import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ProductCard from "../../components/cards/ProductCard";
import LoadingCard from "../../components/cards/LoadingCard";
import { isMobile } from 'react-device-detect';

const RandomProducts = () => {
  const { products } = useSelector((state) => ({ ...state }));

  const [values, setValues] = useState([]);

  useEffect(() => {
    shuffleArray([...products]);
  }, [products]); // eslint-disable-line react-hooks/exhaustive-deps

  const shuffleArray = (array) => {
    let currentIndex = array.length,
      randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    setValues(array);
  };

  return (
    <>
      <div className="container" style={isMobile ? {margin: "5px", padding: 0} : {}}>
        {values.length < 1 ? (
          <LoadingCard count={5} />
        ) : (
          <div className="row" style={{ marginLeft: "2px" }}>
            {values.slice(0, 5).map((product) => {
              return (
                <div
                  key={product._id}
                  className="col-m-2"
                  style={{ margin: "0 5px 5px 0" }}
                >
                  <ProductCard product={product} priceShow={true} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default RandomProducts;
