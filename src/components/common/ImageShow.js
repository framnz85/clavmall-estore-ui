import React, { useState, useEffect } from "react";

import noImage from "../../images/noimage.jpg";
import nocarousel from "../../images/nocarousel.jpg";

const ImageShow = ({ alt, imgid, style = {}, type = "" }) => {
  const defaultEstoreId = process.env.REACT_APP_ESTORE_DEFAULT_ID;
  const [image, setImage] = useState(
    type === "carousel" ? nocarousel : noImage
  );

  useEffect(() => {
    let isSubscribed = true;
    handleCheckImage(isSubscribed);
    return () => (isSubscribed = false);
  }, [imgid]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCheckImage = (isSubscribed) => {
    let image1 = "";
    let image2 = "";

    const urlType = type === "carousel" ? (type = "") : type;

    image1 =
      process.env.REACT_APP_CLAVMALL_IMG +
      "/estore_images/estore" +
      process.env.REACT_APP_ESTORE_ID +
      urlType +
      "/" +
      imgid;
    image2 =
      process.env.REACT_APP_CLAVMALL_IMG +
      "/estore_images/estore" +
      defaultEstoreId +
      urlType +
      "/" +
      imgid;

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

  return image.length && <img alt={alt} src={image} style={style} />;
};

export default ImageShow;
