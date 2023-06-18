import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ProductCard from "../../components/cards/ProductCard";
import LoadingCard from "../../components/cards/LoadingCard";
import { isMobile } from 'react-device-detect';

const RandomProducts = ({loading}) => {
  const { products } = useSelector((state) => ({ ...state }));

  const [values, setValues] = useState([]);

  useEffect(() => {
    shuffleArray([...products]);
  }, [loading]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const limit = isMobile ? 4 : 6;

  return (
    <div className="container">
      {loading ? (
        <LoadingCard count={limit} />
      ) : (
        <>
          {values.slice(0, limit).map((product) => {
            return <ProductCard product={product} priceShow={true} key={product._id} />;
          })}
        </>
      )}
      <div style={{clear: "both"}}></div>
    </div>
  );
};

export default RandomProducts;
