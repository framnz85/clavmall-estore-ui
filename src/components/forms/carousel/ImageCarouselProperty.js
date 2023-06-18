import React from "react";
import { useSelector } from "react-redux";
import { DeleteOutlined } from "@ant-design/icons";

import ImageShow from "../../common/ImageShow";
import ShowingForms from "../../common/ShowingForms";
import AntCheckbox from "../../common/form/AntCheckbox";

const listSelect = {
  categorylist: "category",
  subcatlist: "subcats",
  parentlist: "parent",
};

const ImageCarouselProperty = ({
  values,
  subcatOptions,
  parentOptions,
  handleActivateChange,
  handleFolderChange,
  handleChildChange,
  handleImageRemove,
}) => {
  const { categories } = useSelector((state) => ({ ...state }));

  const { carouselImages } = values;

  const formProperty = [
    {
      type: "ant checked",
      name: "category",
      label: "Category",
      style: {
        float: "left",
      },
      value: false,
    },
    {
      type: "ant select",
      name: "categorylist",
      style: {
        width: "180px",
        float: "left",
      },
      value: "",
      options: categories.map(
        (category) =>
          (category = {
            ...category,
            key: category._id,
            value: category.slug,
            text: category.name,
          })
      ),
      show: true,
    },
    {
      type: "ant checked",
      name: "subcats",
      label: "Sub-Category",
      style: {
        float: "left",
        marginLeft: "10px",
      },
      value: false,
    },
    {
      type: "ant select",
      name: "subcatlist",
      style: {
        width: "180px",
        float: "left",
      },
      value: "",
      options: subcatOptions.map(
        (subcat) =>
          (subcat = {
            ...subcat,
            key: subcat._id,
            value: subcat.slug,
            text: subcat.name,
          })
      ),
      show: true,
    },
    {
      type: "ant checked",
      name: "parent",
      label: "Parent",
      style: {
        float: "left",
        marginLeft: "10px",
      },
      value: false,
    },
    {
      type: "ant select",
      name: "parentlist",
      style: {
        width: "180px",
        float: "left",
      },
      value: "",
      options: parentOptions.map(
        (parent) =>
          (parent = {
            ...parent,
            key: parent._id,
            value: parent.slug,
            text: parent.name,
          })
      ),
      show: true,
    },
  ];

  return (
    <div className="row mb-3">
      {carouselImages &&
        carouselImages.map((image) => {
          const modifiedProperty = formProperty.map((property) =>
            property.name === image.carouselURL.split("/")[0]
              ? {
                  ...property,
                  onChange: () =>
                    handleFolderChange(
                      image.public_id,
                      image.carouselURL.split("/")[0]
                    ),
                  value: true,
                }
              : property.type === "ant checked"
              ? {
                  ...property,
                  onChange: () =>
                    handleFolderChange(image.public_id, property.name),
                }
              : {
                  ...property,
                  onChange: (value) =>
                    handleChildChange(
                      image.public_id,
                      listSelect[property.name],
                      value
                    ),
                  value:
                    listSelect[property.name] ===
                    image.carouselURL.split("/")[0]
                      ? image.carouselURL.split("/")[1]
                      : "",
                }
          );
          return (
            <div key={image.public_id}>
              <ImageShow
                alt={image.public_id}
                imgid={image.url}
                style={{ width: "60%", heigth: "60%" }}
                type="carousel"
              />
              <DeleteOutlined
                className="text-danger"
                onClick={() => handleImageRemove(image.public_id)}
                style={{ cursor: "pointer" }}
              />
              <br />
              <div style={{ margin: "0 7px 0 15px" }}>
                <AntCheckbox
                  inputProperty={{
                    label: "Activate",
                    onChange: (e) =>
                      handleActivateChange(image.public_id, e.target.checked),
                    value: image.activation,
                  }}
                />
                {`Distination URL: "${
                  window.location.origin + "/" + image.carouselURL
                }"`}
                <br />
                <ShowingForms formProperty={modifiedProperty} />
                <br />
                <br />
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default ImageCarouselProperty;
