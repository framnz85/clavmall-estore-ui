import React from "react";
import { useSelector } from "react-redux";
import Resizer from "react-image-file-resizer";
import axios from "axios";
import { Avatar, Badge } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

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
  const { user } = useSelector((state) => ({ ...state }));

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
                .then(async (res) => {
                  uploadedImages.push(res.data);
                  setValues({ ...values, images: uploadedImages });
                  await handleImageUpdate(uploadedImages);
                  setLoading(false);
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
        .then(async (res) => {
          const { images } = values;
          let remainingImages = images.filter((item) => {
            return item.public_id !== public_id;
          });

          setValues({ ...values, images: remainingImages });
          await handleImageRemove(remainingImages);
          setLoading(false);
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
              <Avatar
                src={image.url}
                size={100}
                shape="square"
                className="m-3"
              />
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
            multiple
            hidden
            accept="images/*"
            onChange={fileUploadAndResize}
            disabled={loading}
          />
        </label>
      </div>
    </div>
  );
};

export default ImageUpload;
