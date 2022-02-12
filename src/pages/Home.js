import React from "react";
import { useSelector } from "react-redux";
import { LoadingOutlined } from "@ant-design/icons";
import HomeCarousel from "../components/home/HomeCarousel";
import CategoryProducts from "../components/home/CategoryProducts";
import NewArrival from "../components/home/NewArrival";
import BestSeller from "../components/home/BestSeller";
import RandomProducts from "../components/home/RandomProducts";
import ItemsForYou from "../components/home/ItemsForYou";
import SubcatList from "../components/home/SubcatList";
import ParentList from "./../components/home/ParentList";

const Home = ({ loading }) => {
  const { estore } = useSelector((state) => ({ ...state }));

  const {
    showHomeCarousel,
    showRandomItems,
    showCategories,
    showNewArrival,
    showBestSeller,
  } = estore;

  return (
    <>
      {!estore.name && <LoadingOutlined />}
      {showHomeCarousel && <HomeCarousel loading={loading} />}
      {showRandomItems && <RandomProducts />}
      {showCategories && <CategoryProducts />}
      {showNewArrival && <NewArrival />}
      {showBestSeller && <BestSeller />}
      {estore.name && <ItemsForYou />}
      {showCategories && (
        <div className="bg-white mt-3 p-3">
          <SubcatList />
          <ParentList />
        </div>
      )}
    </>
  );
};

export default Home;
