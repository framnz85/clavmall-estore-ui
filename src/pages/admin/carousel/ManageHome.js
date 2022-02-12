import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Radio } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { updateEstore } from "../../../functions/estore";
import AdminNav from "../../../components/nav/AdminNav";
import CarouselCreateUpload from "../../../components/forms/CarouselCreateUpload";

const themeColors = [
  { head: "#009A57", txt: "" },
  { head: "#4169E1", txt: "#ceebfd" },
  { head: "#DC143C", txt: "#ffd4cc" },
  { head: "#ff6933", txt: "#ffdacc" },
  { head: "#8A2BE2", txt: "#e6d2f9" },
  { head: "#333333", txt: "#d9d9d9" },
  { head: "#a52a2a", txt: "#f5d6d6" },
  { head: "#ccad00", txt: "#fffbe6" },
];

const ManageHomeCarousel = () => {
  let dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const { estore, user } = useSelector((state) => ({ ...state }));

  const handleSubmit = (echange) => {
    setLoading(true);
    echange++;
    updateEstore(
      process.env.REACT_APP_ESTORE_ID,
      { ...estore, estoreChange: echange },
      user.token
    )
      .then((res) => {
        toast.success(`Home setting successfully updated`);
        dispatch({
          type: "ESTORE_INFO",
          payload: res.data,
        });
        localStorage.setItem("estore", JSON.stringify(res.data));
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.message);
        setLoading(false);
      });
  };

  const handleChange = (e, public_id) => {
    const { carouselImages } = estore;
    const index = carouselImages.findIndex(
      (image) => image.public_id === public_id
    );
    carouselImages[index] = {
      ...carouselImages[index],
      carouselURL: e.target.value,
    };
    dispatch({
      type: "ESTORE_INFO",
      payload: {
        ...estore,
        carouselImages,
      },
    });
    localStorage.setItem(
      "estore",
      JSON.stringify({ ...estore, carouselImages })
    );
  };

  const handleTextChange = (e, id) => {
    const { textCarousel } = estore;
    const index = textCarousel.findIndex((txt) => txt.id === id);
    textCarousel[index] = {
      ...textCarousel[index],
      text: e.target.value,
    };
    dispatch({
      type: "ESTORE_INFO",
      payload: {
        ...estore,
        textCarousel,
      },
    });
    localStorage.setItem("estore", JSON.stringify({ ...estore, textCarousel }));
  };

  const onColorChange = (e, echange) => {
    const index = themeColors.findIndex(
      (color) => color.head === e.target.value
    );
    echange++;

    updateEstore(
      process.env.REACT_APP_ESTORE_ID,
      {
        ...estore,
        headerColor: e.target.value,
        carouselColor: themeColors[index].txt,
        estoreChange: echange,
      },
      user.token
    )
      .then((res) => {
        dispatch({
          type: "ESTORE_INFO",
          payload: res.data,
        });
        localStorage.setItem("estore", JSON.stringify(res.data));
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-m-2">
          <AdminNav />
        </div>
        <div className="col-md-10 bg-white mt-3 mb-5">
          <h4 style={{ margin: "20px 0" }}>Manage Home</h4>
          <hr />

          <div className="p-3">
            <label>
              <b>Theme Color</b>
            </label>

            <br />
            <Radio.Group
              defaultValue={estore.headerColor}
              size="large"
              onChange={(e) => onColorChange(e, estore.estoreChange)}
            >
              {themeColors.map((color) => (
                <Radio.Button
                  value={color.head}
                  key={color.head}
                  style={{
                    color: "#ffffff",
                    backgroundColor: color.head,
                    width: "80px",
                  }}
                >
                  {color.head === estore.headerColor ? (
                    <CheckCircleOutlined style={{ fontSize: "20px" }} />
                  ) : (
                    <span
                      style={{
                        color: color.head,
                      }}
                    >
                      .
                    </span>
                  )}
                </Radio.Button>
              ))}
            </Radio.Group>
          </div>

          <div className="p-3">
            <br />

            <label>
              <b>Image Carousel</b>
            </label>

            <br />
            <CarouselCreateUpload
              loading={loading}
              setLoading={setLoading}
              handleSubmit={() => handleSubmit(estore.estoreChange)}
              handleChange={handleChange}
              handleTextChange={handleTextChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageHomeCarousel;
