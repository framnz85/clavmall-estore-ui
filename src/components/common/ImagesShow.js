import React, { useState, useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import { Card } from "antd";

import noImage from "../../images/noimage.jpg";

const ImagesShow = ({ imgArray, prodName }) => {
  const defaultEstoreId = process.env.REACT_APP_ESTORE_DEFAULT_ID;
  const [images, setImages] = useState([]);

  useEffect(() => {
    setImages(
      imgArray.map((img) => {
        return { ...img, url: noImage };
      })
    );
    let isSubscribed = true;
    imgArray.forEach((img, index) =>
      handleCheckImages(isSubscribed, img, ++index)
    );
    return () => (isSubscribed = false);
  }, [imgArray]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCheckImages = (isSubscribed, imgObj, index) => {
    let image1 = "";
    let image2 = "";

    image1 =
      process.env.REACT_APP_CLAVMALL_IMG +
      "/estore_images/estore" +
      process.env.REACT_APP_ESTORE_ID +
      "/" +
      imgObj.url;
    image2 =
      process.env.REACT_APP_CLAVMALL_IMG +
      "/estore_images/estore" +
      defaultEstoreId +
      "/" +
      imgObj.url;

    checkIfImageExists(image1, (exist1) => {
      if (exist1 && isSubscribed) {
        imgArray = imgArray.map((img) => {
          if (img.public_id === imgObj.public_id) {
            return { ...img, url: image1, checked: true };
          } else {
            return img;
          }
        });
        const checkIfChecked = imgArray.find((img) => !img.checked);
        if (!checkIfChecked) {
          setImages([...imgArray]);
        }
      } else {
        checkIfImageExists(image2, (exist2) => {
          console.log(index);
          if (exist2 && isSubscribed) {
            imgArray = imgArray.map((img) => {
              if (img.public_id === imgObj.public_id) {
                return { ...img, url: image2, checked: true };
              } else {
                return img;
              }
            });
            const checkIfChecked = imgArray.find((img) => !img.checked);
            if (!checkIfChecked) {
              setImages([...imgArray]);
            }
          } else {
            imgArray = imgArray.map((img) => {
              if (img.public_id === imgObj.public_id) {
                return { ...img, url: noImage, checked: true };
              } else {
                return img;
              }
            });
            const checkIfChecked = imgArray.find((img) => !img.checked);
            if (!checkIfChecked) {
              setImages([...imgArray]);
            }
          }
        });
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
    <>
      {images && images.length > 0 ? (
        <Carousel showArrows={true} showThumbs={true} autoPlay infiniteLoop>
          {images &&
            images.map((img) => (
              <div key={img.public_id}>
                <img src={img.url} alt={prodName + " " + img.public_id} />
              </div>
            ))}
        </Carousel>
      ) : (
        <Card cover={<img src={noImage} alt="eStore" className="mb-3" />} />
      )}
    </>
  );
};

export default ImagesShow;
