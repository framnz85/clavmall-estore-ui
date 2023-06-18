import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import ImageUpload from "../../common/fileupload/ImageUpload";

import { updateChanges } from "../../../functions/estore";
import { imageupdate } from "../../../functions/product";

const ProductImage = ({ values, setValues, width, height, edit }) => {
  let dispatch = useDispatch();
  const { slug } = values;

  const { user, admin, estore } = useSelector((state) => ({ ...state }));

  const [loading, setLoading] = useState(false);

  const updateProductImage = (images) => {
    const newAdminProducts = admin.products.values.map((product) =>
      product.slug === slug ? { ...values, images } : product
    );

    dispatch({
      type: "ADMIN_OBJECT_X",
      payload: {
        products: {
          ...admin.products,
          values: newAdminProducts
        }
      },
    });

    updateChanges(
      estore._id,
      "productChange",
      user.token
    ).then((res) => {
      dispatch({
        type: "ESTORE_INFO_X",
        payload: res.data,
      });
    });

    imageupdate(slug, images, user.token);
  };

  const removeProductImage = (images) => {
    const newAdminProducts = admin.products.values.map((product) =>
      product.slug === slug ? { ...values, images } : product
    );

    dispatch({
      type: "ADMIN_OBJECT_X",
      payload: {
        products: {
          ...admin.products,
          values: newAdminProducts
        }
      },
    });

    updateChanges(
      estore._id,
      "productChange",
      user.token
    ).then((res) => {
      dispatch({
        type: "ESTORE_INFO_X",
        payload: res.data,
      });
    });

    imageupdate(slug, images, user.token);
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
