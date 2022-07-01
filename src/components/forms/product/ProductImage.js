import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import ImageUpload from "../../common/fileupload/ImageUpload";
import { updateChanges } from "../../../functions/estore";

const ProductImage = ({ values, setValues, width, height, edit }) => {
  let dispatch = useDispatch();
  const { slug } = values;

  const { user, admin } = useSelector((state) => ({ ...state }));

  const [loading, setLoading] = useState(false);

  const updateProductImage = (images) => {
    const newAdminProducts = admin.products.map((product) =>
      product.slug === slug ? { ...values, images } : product
    );

    dispatch({
      type: "ADMIN_OBJECT_X",
      payload: { products: newAdminProducts },
    });

    updateChanges(
      process.env.REACT_APP_ESTORE_ID,
      "productChange",
      user.token
    ).then((res) => {
      dispatch({
        type: "ESTORE_INFO_X",
        payload: res.data,
      });
    });

    axios.put(
      `${process.env.REACT_APP_API}/product/imageupdate/${slug}`,
      {
        images,
      },
      {
        headers: {
          authtoken: user ? user.token : "",
        },
      }
    );
  };

  const removeProductImage = (images) => {
    const newAdminProducts = admin.products.map((product) =>
      product.slug === slug ? { ...values, images } : product
    );

    dispatch({
      type: "ADMIN_OBJECT_X",
      payload: { products: newAdminProducts },
    });

    updateChanges(
      process.env.REACT_APP_ESTORE_ID,
      "productChange",
      user.token
    ).then((res) => {
      dispatch({
        type: "ESTORE_INFO_X",
        payload: res.data,
      });
    });

    axios.put(
      `${process.env.REACT_APP_API}/product/imageupdate/${slug}`,
      {
        images,
      },
      {
        headers: {
          authtoken: user ? user.token : "",
        },
      }
    );
  };

  return (
    <>
      <ImageUpload
        values={values}
        setValues={setValues}
        width={width}
        height={height}
        loading={loading}
        setLoading={setLoading}
        edit={edit}
        handleImageUpdate={updateProductImage}
        handleImageRemove={removeProductImage}
      />
    </>
  );
};

export default ProductImage;
