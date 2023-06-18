import React from "react";
import StarRatings from "react-star-ratings";

export const showAverage = (p, dim) => {
  let result = 0;
  let length = 0;

  if (p && p.ratings && p.ratings.length > 0) {
    let ratingsArray = p && p.ratings;
    let total = [];
    length = ratingsArray.length;
    ratingsArray.map((r) => total.push(r.star));

    let totalReduce = total.reduce((p, n) => p + n, 0);
    let highest = length * 5;
    result = (totalReduce * 5) / highest;
  }

  return (
    <div className="pb-2" style={{ clear: "both" }}>
      <div style={{ fontSize: "12px", float: "left" }}>
        <StarRatings
          rating={result}
          numberOfStars={5}
          starRatedColor="#FFD700"
          starDimension={dim}
          starSpacing="0px"
          editing={false}
        />
      </div>
      <div
        className="align-bottom ml-1 mt-1"
        style={{ fontSize: "11px", float: "left", color: "#333333" }}
      >
        ({length})
      </div>
    </div>
  );
};

export default showAverage;
