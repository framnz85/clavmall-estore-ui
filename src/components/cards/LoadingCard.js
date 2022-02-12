import React from "react";
import { Card, Skeleton } from "antd";

const LoadingCard = ({ count }) => {
  const cards = () => {
    let totalCards = [];

    for (let i = 0; i < count; i++) {
      totalCards.push(
        <Card
          className="col-m-2"
          style={{ height: "303px", width: "214px", margin: "0 10px 10px 0" }}
          key={i}
        >
          <Skeleton active></Skeleton>
        </Card>
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
