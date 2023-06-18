import React from "react";
import { Card, Skeleton } from "antd";
import { isMobile } from 'react-device-detect';

const LoadingCard = ({ count }) => {
  const cards = () => {
    let totalCards = [];

    for (let i = 0; i < count; i++) {
      totalCards.push(
        <Card.Grid
          style={{
            height: "210px",
            width: isMobile ? "50%" : "16.66%",
            margin: "0",
            backgroundColor: "#fff",
            border: "3px solid #efefef",
          }}
          key={i}
        >
          <Skeleton active></Skeleton>
        </Card.Grid>
      );
    }

    return totalCards;
  };

  return (
    <div className="row pb-5" style={{ marginLeft: "2px" }}>
      {cards()}
    </div>
  );
};
export default LoadingCard;
