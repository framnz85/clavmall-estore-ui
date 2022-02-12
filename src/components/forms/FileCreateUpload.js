import React from "react";
import Resizer from "react-image-file-resizer";
import { Avatar, Badge } from "antd";

const FileCreateUpload = ({ values, setValues }) => {
  const fileUploadAndResize = (e) => {
    let files = e.target.files;
    let allUploadedFiles = values.images;

    if (files) {
      for (let i = 0; i < files.length; i++) {
        Resizer.imageFileResizer(
          files[i],
          514,
          514,
          "JPEG",
          100,
          0,
          (uri) => {
            allUploadedFiles.push({
              public_id: Math.floor(Math.random() * 10 ** 10),
              url: uri,
            });
            setValues({ ...values, images: allUploadedFiles });
          },
          "base64"
        );
      }
    }
  };

  const handleImageRemove = (public_id) => {
    const { images } = values;
    let filteredImages = images.filter((item) => {
      return item.public_id !== public_id;
    });

    setValues({ ...values, images: filteredImages });
  };

  return (
    <div>
      <div className="row">
        {values.images &&
          values.images.map((image) => (
            <Badge
              key={image.public_id}
              count="x"
              onClick={() => handleImageRemove(image.public_id)}
              style={{ cursor: "pointer" }}
            >
              <Avatar
                src={image.url}
                size={100}
                shape="square"
                className="m-3"
              />
            </Badge>
          ))}
      </div>
      <div className="text-center">
        <label className="btn btn-secondary btn-raised">
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
    </div>
  );
};

export default FileCreateUpload;
