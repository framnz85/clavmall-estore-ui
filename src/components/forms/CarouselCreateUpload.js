import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Resizer from "react-image-file-resizer";
import reactImageSize from "react-image-size";
import axios from "axios";
import { toast } from "react-toastify";
import { DeleteOutlined } from "@ant-design/icons";
import { Button, Checkbox } from "antd";

const CarouselCreateUpload = ({
  loading,
  setLoading,
  handleSubmit,
  handleChange,
  handleTextChange,
}) => {
  let dispatch = useDispatch();

  const { estore } = useSelector((state) => ({ ...state }));
  const { user } = useSelector((state) => ({ ...state }));

  const {
    carouselImages,
    textCarousel,
    showHomeCarousel,
    showRandomItems,
    showCategories,
    showNewArrival,
    showBestSeller,
  } = estore;

  const fileUploadAndResize = (e) => {
    let files = e.target.files;
    let allUploadedFiles = carouselImages;

    if (files) {
      setLoading(true);
      for (let i = 0; i < files.length; i++) {
        Resizer.imageFileResizer(
          files[i],
          1120,
          220,
          "JPEG",
          100,
          0,
          async (uri) => {
            const { width, height } = await reactImageSize(uri);

            if (width !== 1120 || height !== 220) {
              toast.error(
                "Carousel images should have an exact dimension of width: 1120 pixel, heigth: 220 pixel"
              );
              return;
            }

            axios
              .post(
                `${process.env.REACT_APP_API}/uploadimages`,
                {
                  image: uri,
                },
                {
                  headers: {
                    authtoken: user ? user.token : "",
                  },
                }
              )
              .then((res) => {
                setLoading(false);
                allUploadedFiles.push({ ...res.data, carouselURL: "" });

                dispatch({
                  type: "ESTORE_INFO",
                  payload: {
                    ...estore,
                    carouselImages: allUploadedFiles,
                  },
                });
                localStorage.setItem(
                  "estore",
                  JSON.stringify({
                    ...estore,
                    carouselImages: allUploadedFiles,
                  })
                );

                axios.put(
                  `${process.env.REACT_APP_API}/setting/imageupdate/${process.env.REACT_APP_ESTORE_ID}`,
                  {
                    carouselImages: allUploadedFiles,
                  },
                  {
                    headers: {
                      authtoken: user ? user.token : "",
                    },
                  }
                );
              })
              .catch((error) => {
                toast.error(error.message);
                setLoading(false);
              });
          },
          "base64"
        );
      }
    }
  };

  const handleImageRemove = (public_id) => {
    setLoading(true);
    axios
      .post(
        `${process.env.REACT_APP_API}/removeimage`,
        {
          public_id,
        },
        {
          headers: {
            authtoken: user ? user.token : "",
          },
        }
      )
      .then((res) => {
        setLoading(false);
        const { carouselImages } = estore;
        let filteredImages = carouselImages.filter((item) => {
          return item.public_id !== public_id;
        });

        dispatch({
          type: "ESTORE_INFO",
          payload: {
            ...estore,
            carouselImages: filteredImages,
          },
        });
        localStorage.setItem(
          "estore",
          JSON.stringify({
            ...estore,
            carouselImages: filteredImages,
          })
        );

        axios.put(
          `${process.env.REACT_APP_API}/setting/imageupdate/${process.env.REACT_APP_ESTORE_ID}`,
          {
            carouselImages: filteredImages,
          },
          {
            headers: {
              authtoken: user ? user.token : "",
            },
          }
        );
      })
      .catch((error) => {
        toast.error(error.message);
        setLoading(false);
      });
  };

  return (
    <div>
      <div className="row mb-3">
        {carouselImages &&
          carouselImages.map((image) => (
            <div key={image.public_id}>
              <img
                src={image.url}
                className="m-3"
                style={{ width: "60%", heigth: "60%" }}
                alt={image.public_id}
              />
              <DeleteOutlined
                className="text-danger"
                onClick={() => handleImageRemove(image.public_id)}
                style={{ cursor: "pointer" }}
              />
              <input
                type="text"
                name={image.public_id}
                className="form-control"
                value={image.carouselURL}
                onChange={(e) => handleChange(e, image.public_id)}
                disabled={loading}
                placeholder="Distanation URL"
              />
            </div>
          ))}
      </div>
      <div className="text-left">
        <label className="btn btn-secondary btn-raised mt-3">
          CHOOSE IMAGE FILE
          <input
            type="file"
            multiple
            hidden
            accept="images/*"
            onChange={fileUploadAndResize}
          />
        </label>
      </div>

      <div className="mt-5">
        <label>
          <b>Text Carousel</b>
        </label>
        <br />
        {textCarousel.map((txt) => (
          <input
            key={txt.id}
            name={txt.id}
            type="text"
            className="form-control"
            value={txt.text}
            onChange={(e) => handleTextChange(e, txt.id)}
            disabled={loading}
            placeholder="Type text here..."
          />
        ))}

        <div className="pt-5">
          <label>
            <b>Other Setting</b>
          </label>
          <br />
          <br />
          <Checkbox
            onChange={(e) => {
              dispatch({
                type: "ESTORE_INFO",
                payload: {
                  ...estore,
                  showHomeCarousel: e.target.checked,
                },
              });
              localStorage.setItem(
                "estore",
                JSON.stringify({
                  ...estore,
                  showHomeCarousel: e.target.checked,
                })
              );
            }}
            checked={showHomeCarousel}
          >
            <b>Show Carousel</b>
          </Checkbox>
        </div>
        <div className="pt-3">
          <Checkbox
            onChange={(e) => {
              dispatch({
                type: "ESTORE_INFO",
                payload: {
                  ...estore,
                  showRandomItems: e.target.checked,
                },
              });
              localStorage.setItem(
                "estore",
                JSON.stringify({
                  ...estore,
                  showRandomItems: e.target.checked,
                })
              );
            }}
            checked={showRandomItems}
          >
            <b>
              Show Random Items (This is the items right below the Text
              Carousel)
            </b>
          </Checkbox>
        </div>
        <div className="pt-3">
          <Checkbox
            onChange={(e) => {
              dispatch({
                type: "ESTORE_INFO",
                payload: {
                  ...estore,
                  showCategories: e.target.checked,
                },
              });
              localStorage.setItem(
                "estore",
                JSON.stringify({
                  ...estore,
                  showCategories: e.target.checked,
                })
              );
            }}
            checked={showCategories}
          >
            <b>Show Categories, Sub Categories, and Parents</b>
          </Checkbox>
        </div>
        <div className="pt-3">
          <Checkbox
            onChange={(e) => {
              dispatch({
                type: "ESTORE_INFO",
                payload: {
                  ...estore,
                  showNewArrival: e.target.checked,
                },
              });
              localStorage.setItem(
                "estore",
                JSON.stringify({
                  ...estore,
                  showNewArrival: e.target.checked,
                })
              );
            }}
            checked={showNewArrival}
          >
            <b>Show New Arrival</b>
          </Checkbox>
        </div>
        <div className="pt-3">
          <Checkbox
            onChange={(e) => {
              dispatch({
                type: "ESTORE_INFO",
                payload: {
                  ...estore,
                  showBestSeller: e.target.checked,
                },
              });
              localStorage.setItem(
                "estore",
                JSON.stringify({
                  ...estore,
                  showBestSeller: e.target.checked,
                })
              );
            }}
            checked={showBestSeller}
          >
            <b>Show Best Seller</b>
          </Checkbox>
        </div>
        <Button
          onClick={handleSubmit}
          type="primary"
          className="mb-3"
          block
          shape="round"
          size="large"
          disabled={loading}
          style={{ marginTop: "30px", width: "150px" }}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default CarouselCreateUpload;
