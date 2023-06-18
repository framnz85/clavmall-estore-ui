import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Switch } from "antd";
import { toast } from "react-toastify";

import AdminNav from "../../../components/nav/AdminNav";
import InputText from "../../../components/common/form/InputText";
import ThemeColor from "../../../components/forms/carousel/ThemeColor";
import ImageCarousel from "../../../components/forms/carousel/ImageCarousel";
import TextCarousel from "../../../components/forms/carousel/TextCarousel";
import HomepageSetting from "../../../components/forms/carousel/HomepageSetting";
// import OtherSettings from "../../../components/forms/carousel/AffiliateSetting";
import AiChatSetting from "../../../components/forms/carousel/AiChatSetting";
import EstoreExpired from "../../../components/common/EstoreExpired";
import AddDomain from "../../../components/common/addDomain";

import { updateEstore } from "../../../functions/estore";

const initialState = {
  name: "",
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
      });
    }
  };

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
          estoreChange: echange,
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
          <EstoreExpired />

          <h4 style={{ margin: "20px 0" }}>Manage Home</h4>
          <hr />

          <div className="p-3">
            <h6 style={{ fontWeight: "bold" }}>Website ID: </h6>
            <h6>{values._id}</h6>
            <br />
            <InputText
              inputProperty={{
                name: "name",
                label: "Store Name",
                onChange: (e) => setValues({ ...values, name: e.target.value }),
                value: values.name,
                disabled: loading,
                show: true,
                edit: false,
              }}
            />
          </div>

          <ThemeColor values={values} setValues={setValues} />
          <br />
          <br />

          <ImageCarousel
            values={values}
            setValues={setValues}
            loading={loading}
            setLoading={setLoading}
          />
          <br />
          <br />

          <TextCarousel values={values} setValues={setValues} />
          <br />

          <HomepageSetting values={values} setValues={setValues} />
          <br />

          {/* <OtherSettings values={values} setValues={setValues} /> */}

          <AiChatSetting values={values} setValues={setValues} />

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

          <b>Website Status</b>
          <Switch
            checked={values.status === "active"}
            onChange={(checked) => {
              setValues({ ...values, status: checked ? "active" : "pause" });
              toast.warning("Make sure to click the Save Setting button");
            }}
            style={{ marginLeft: "10px" }}
            disabled={values.status === "stop"}
          />
          <br />
          <br />

          <div style={{ paddingBottom: 10 }}>
            <AddDomain />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageHomeCarousel;
