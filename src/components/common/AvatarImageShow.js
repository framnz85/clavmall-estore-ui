import React, { useState, useEffect } from "react";
import { Avatar } from "antd";

import noImage from "../../images/noimage.jpg";

const AvatarImageShow = ({ src, size, type }) => {
  const defaultEstoreId = process.env.REACT_APP_ESTORE_DEFAULT_ID;
  const [image, setImage] = useState(noImage);

  useEffect(() => {
    let isSubscribed = true;
    handleCheckImage(isSubscribed);
    return () => (isSubscribed = false);
  }, [src]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCheckImage = (isSubscribed) => {
    let image1 = "";
    let image2 = "";

    image1 =
      process.env.REACT_APP_CLAVMALL_IMG +
      "/estore_images/estore" +
      process.env.REACT_APP_ESTORE_ID +
      type +
      "/" +
      src;
    image2 =
      process.env.REACT_APP_CLAVMALL_IMG +
      "/estore_images/estore" +
      defaultEstoreId +
      type +
      "/" +
      src;

    checkIfImageExists(image1, (exist1) => {
      if (exist1 && isSubscribed) {
        return setImage(image1);
      } else {
        checkIfImageExists(
          image2,
          (exist2) => exist2 && isSubscribed && setImage(image2)
        );
      }
    });
  };

  const checkIfImageExists = (url, callback) => {
    const img = new Image();
    img.src = url;

    if (img.complete) {
      callback(true);
    } else {
      img.onload = () => {
        callback(true);
      };

      img.onerror = () => {
        callback(false);
      };
    }
  };

  return (
    image.length && (
      <Avatar src={image} size={size} shape="square" className="m-3" />
    )
  );
};

export default AvatarImageShow;
