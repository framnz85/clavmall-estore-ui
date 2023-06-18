import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Carousel } from "antd";
import Jumbotron from "../../components/cards/Jumbotron";
import { isMobile } from "react-device-detect";

import ImageShow from "../common/ImageShow";

const HomeCarousel = () => {
  let { estore } = useSelector((state) => ({ ...state }));

  const contentStyle = {
    height: isMobile ? "" : "220px",
    lineHeight: "160px",
    textAlign: "center",
    background: "#ffffff",
  };

  return (
    <>
      <div
        className="jumbotron m-0 pt-4 pb-2"
        style={{ backgroundColor: "#ffffff" }}
      >
        <div
          className="container"
          style={isMobile ? { margin: 0, padding: 0 } : {}}
        >
          <Carousel autoplay>
            {estore.carouselImages
              .filter((image) => image.activation)
              .map((image) => (
                <Link key={image.public_id} to={image.carouselURL}>
                  <h3 style={contentStyle}>
                    <ImageShow
                      alt={estore.name + " Carousel"}
                      imgid={image.url}
                      style={isMobile ? { width: window.innerWidth } : {}}
                      type="carousel"
                    />
                  </h3>
                </Link>
              ))}
          </Carousel>
        </div>
      </div>
      <div
        className="alert alert-success text-danger h3 font-weight-bold text-center p-2 mb-4"
        style={{ backgroundColor: estore.carouselColor }}
      >
        <Jumbotron
          text={estore.textCarousel
            .filter((txt) => txt.name !== "")
            .map((txt) => txt.name)}
        />
      </div>
    </>
  );
};

export default HomeCarousel;
