import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Button } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { isMobile } from 'react-device-detect';

import ProductCard from "../../components/cards/ProductCard";
import LoadingCard from "../../components/cards/LoadingCard";

import { getRandomProducts } from "../../functions/product";
import getUnique from "../common/getUnique";

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
  return array;
};

const ItemsForYou = () => {
  let dispatch = useDispatch();

  const { estore, products, user } = useSelector((state) => ({ ...state }));

  const [page, setPage] = useState(0);
  const [ifyProducts, setIfyProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadMore, setLoadMore] = useState(false);

  useEffect(() => {
    loadRandomProducts(1);
    if (!sessionStorage.getItem("productShuffle")) {
      const suffledProducts = shuffleArray([...products]);
      setIfyProducts(suffledProducts);
      if (products) {
          dispatch({
              type: "PRODUCT_LIST_VIII",
              payload: suffledProducts,
          });
      }
    } else {
      setIfyProducts([...products]);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadRandomProducts = (nextPage) => {
    setPage(nextPage);
    const maxRandNum = nextPage === 1 ? 60 : 60 + nextPage * 20;
    if (products.length < maxRandNum) {
      nextPage === 1 ? setLoading(true) : setLoadMore(true);
      getRandomProducts(
        nextPage === 1 ? 60 : 20,
        user.address ? user.address : {}
      )
        .then((res) => {
          const unique = getUnique(products, res.data);
          setIfyProducts(unique.all);
          dispatch({
            type: "PRODUCT_LIST_VIII",
            payload: res.data,
          });
          setLoading(false);
          setLoadMore(false);
        })
        .catch((error) => {
          toast.error(error.message);
          setLoading(false);
          setLoadMore(false);
        });
    }
  };

  return (
    <>
      <h4
        className="alert alert-success text-center p-3 mt-5 mb-3 display-5 jumbotron"
        style={{ backgroundColor: estore.carouselColor }}
      >
        Items For You
      </h4>

      <div className="container" style={isMobile ? {margin: "5px", padding: 0} : {}}>
        {loading ? (
          <LoadingCard count={page * 20} />
        ) : (
          <div className="row" style={{ marginLeft: "2px" }}>
            {ifyProducts.slice(0, page * 20).map((product) => {
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
        <div style={{ margin: "0 2px" }}>
          <Button
            block
            size="large"
            onClick={() => loadRandomProducts(page + 1)}
          >
            {loadMore ? <LoadingOutlined /> : "Load More"}
          </Button>
        </div>
      </div>
    </>
  );
};

export default ItemsForYou;
