import React from "react";
import { useSelector } from "react-redux";
import Resizer from "react-image-file-resizer";
import { Avatar, Badge } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

import AvatarImageShow from "../AvatarImageShow";

import { uploadFileImage, removeFileImage } from "../../../functions/admin";

const ImageUpload = ({
  values,
  setValues,
  width,
  height,
  loading,
  setLoading,
  edit,
  handleImageUpdate,
  handleImageRemove,
}) => {
  const { user, estore } = useSelector((state) => ({ ...state }));

  const fileUploadAndResize = (e) => {
    let files = e.target.files;
    let uploadedImages = values.images;

    if (files) {
      setLoading(true);
      for (let i = 0; i < files.length; i++) {
        Resizer.imageFileResizer(
          files[i],
          width,
          height,
          "JPEG",
          100,
          0,
          (uri) => {
            if (edit) {
              uploadFileImage(uri, estore, user.token)
                .then((res) => {
                  if (res.data.err) {
                    toast.error(res.data.err);
                    setLoading(false);
                  } else {
                    uploadedImages.push(res.data);
                    setValues({ ...values, images: uploadedImages });
                    handleImageUpdate(uploadedImages);
                    setLoading(false);
                  }
                })
                .catch((error) => {
                  toast.error(error.message);
                  setLoading(false);
                });
            } else {
              uploadedImages.push({
                public_id: Math.floor(Math.random() * 10 ** 10),
                url: uri,
              });
              setValues({ ...values, images: uploadedImages });
              setLoading(false);
            }
          },
          "base64"
        );
      }
    }
  };

  const removeThisImage = (public_id) => {
    setLoading(true);
    if (edit) {
      removeFileImage(public_id, estore, user.token)
        .then((res) => {
          if (res.data.err) {
            toast.error(res.data.err);
            setLoading(false);
            if (res.data.noexist) {
              const { images } = values;
              let remainingImages = images.filter((item) => {
                return item.public_id !== public_id;
              });

              setValues({ ...values, images: remainingImages });
              handleImageRemove(remainingImages);
            }
          } else {
            const { images } = values;
            let remainingImages = images.filter((item) => {
              return item.public_id !== public_id;
            });

            setValues({ ...values, images: remainingImages });
            handleImageRemove(remainingImages);
            setLoading(false);
          }
        })
        .catch((error) => {
          toast.error(error.message);
          setLoading(false);
        });
    } else {
      const { images } = values;
      let remainingImages = images.filter((item) => {
        return item.public_id !== public_id;
      });
      setValues({ ...values, images: remainingImages });
      setLoading(false);
    }
  };

  return (
    <div className="p-3 mb-5">
      <div className="row">
        {values.images &&
          values.images.map((image) => (
            <Badge
              key={image.public_id}
              count="x"
              onClick={() => removeThisImage(image.public_id)}
              style={{ cursor: "pointer" }}
            >
              {edit ? (
                <AvatarImageShow src={image.url} size={100} type="/thumb" />
              ) : (
                <Avatar
                  src={image.url}
                  size={100}
                  shape="square"
                  className="m-3"
                />
              )}
            </Badge>
          ))}
        <label
          className="btn btn-light btn-raised m-3 pt-2"
          style={{
            width: "100px",
            height: "100px",
            fontSize: "40px",
            color: "#999999",
          }}
        >
          {loading ? (
            <LoadingOutlined style={{ fontSize: "25px" }} />
          ) : (
            <div className="pt-2">+</div>
          )}
          <input
            type="file"
            change="getFile($event)"
            multiple
            hidden
            accept="image/*"
            onChange={fileUploadAndResize}
            disabled={loading}
          />
        </label>
      </div>
    </div>
  );
};

export default ImageUpload;
