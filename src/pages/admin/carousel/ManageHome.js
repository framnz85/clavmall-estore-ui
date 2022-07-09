import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "antd";
import { toast } from "react-toastify";
import AdminNav from "../../../components/nav/AdminNav";
import ThemeColor from "../../../components/forms/carousel/ThemeColor";
import ImageCarousel from "../../../components/forms/carousel/ImageCarousel";
import TextCarousel from "../../../components/forms/carousel/TextCarousel";
import HomepageSetting from "../../../components/forms/carousel/HomepageSetting";
import { updateEstore } from "../../../functions/estore";

const initialState = {
  carouselImages: [],
  textCarousel: [],
  showHomeCarousel: false,
  showRandomItems: false,
  showCategories: false,
  showNewArrival: false,
  showBestSeller: false,
  headerColor: "",
  carouselColor: "",
  estoreChange: 0,
};

const ManageHomeCarousel = () => {
  let dispatch = useDispatch();

  const [values, setValues] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const { estore, user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadEstore();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadEstore = () => {
    if (estore) {
      setValues({
        ...values,
        ...estore,
      })
    }
  }

  const handleSubmit = () => {
    const echange = estore.estoreChange > 0 ? estore.estoreChange + 1 : 1;

    setLoading(true);
    updateEstore(
      estore._id,
      { ...estore, ...values, estoreChange: echange },
      user.token
    )
      .then((res) => {
        setValues({
          ...values,
          estoreChange: echange
        });
        dispatch({
          type: "ESTORE_INFO_XIII",
          payload: res.data,
        });
        toast.success(`Home setting successfully updated`);
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.message);
        setLoading(false);
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

          <ThemeColor
            values={values}
            setValues={setValues}
          />
          <br /><br />

          <ImageCarousel
            values={values}
            setValues={setValues}
            loading={loading}
            setLoading={setLoading}
          />
          <br /><br />

          <TextCarousel values={values} setValues={setValues} /><br />

          <HomepageSetting values={values} setValues={setValues} />

          <Button
            onClick={handleSubmit}
            type="primary"
            className="mb-3"
            block
            shape="round"
            size="large"
            disabled={loading}
            style={{ margin: "30px 30px 20px 15px", width: "150px" }}
          >
            Save Setting
          </Button>
          <br />
          <br />
        </div>
      </div>
    </div>
  );
};

export default ManageHomeCarousel;
