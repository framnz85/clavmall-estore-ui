import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import ThumbUpload from "../../common/fileupload/ThumbUpload";

import { imageupdate } from "../../../functions/category";

const CategoryImage = ({ values, setValues, width, height, edit }) => {
  let dispatch = useDispatch();
  const { slug } = values;

  const { user, categories } = useSelector((state) => ({ ...state }));

  const [loading, setLoading] = useState(false);

  const updateCategoryImage = (images) => {
    if (categories) {
      const newCategories = categories.map((category) =>
        category.slug === slug ? { ...category, images } : category
      );

      setValues({ ...values, images });

      dispatch({
        type: "CATEGORY_LIST_X",
        payload: newCategories,
      });
    }

    imageupdate(slug, images, user.token);
  };

  const removeCategoryImage = (images) => {
    setValues({ ...values, images });

    imageupdate(slug, images, user.token);
  };

  return (
    <>
      <ThumbUpload
        values={values}
        setValues={setValues}
        width={width}
        height={height}
        loading={loading}
        setLoading={setLoading}
        edit={edit}
        handleImageUpdate={updateCategoryImage}
        handleImageRemove={removeCategoryImage}
      />
    </>
  );
};

export default CategoryImage;
