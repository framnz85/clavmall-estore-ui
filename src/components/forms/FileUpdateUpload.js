import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Resizer from "react-image-file-resizer";
import axios from "axios";
import { toast } from "react-toastify";
import { Avatar, Badge } from "antd";
import { updateChanges } from "../../functions/estore";

const FileUpload = ({ values, setValues, setLoading }) => {
  const dispatch = useDispatch();

  const { user, admin } = useSelector((state) => ({ ...state }));
  const { slug } = values;

  const fileUploadAndResize = (e) => {
    let files = e.target.files;
    let allUploadedFiles = values.images;

    if (files) {
      setLoading(true);
      for (let i = 0; i < files.length; i++) {
        Resizer.imageFileResizer(
          files[i],
          514,
          514,
          "JPEG",
          100,
          0,
          (uri) => {
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
              .then((res) => {
                setLoading(false);
                allUploadedFiles.push(res.data);

                setValues({ ...values, images: allUploadedFiles });

                const newAdminProducts = admin.products.map((product) =>
                  product.slug === slug
                    ? { ...values, images: allUploadedFiles }
                    : product
                );

                dispatch({
                  type: "ADMIN_OBJECT",
                  payload: { ...admin, products: newAdminProducts },
                });
                localStorage.setItem(
                  "admin",
                  JSON.stringify({ ...admin, products: newAdminProducts })
                );

                updateChanges(
                  process.env.REACT_APP_ESTORE_ID,
                  "productChange",
                  user.token
                ).then((res) => {
                  dispatch({
                    type: "ESTORE_INFO",
                    payload: res.data,
                  });
                  localStorage.setItem("estore", JSON.stringify(res.data));
                });

                axios.put(
                  `${process.env.REACT_APP_API}/product/imageupdate/${slug}`,
                  {
                    images: allUploadedFiles,
                  },
                  {
                    headers: {
                      authtoken: user ? user.token : "",
                    },
                  }
                );
              })
              .catch((error) => {
                toast.error(error.message);
                setLoading(false);
              });
          },
          "base64"
        );
      }
    }
  };

  const handleImageRemove = (public_id) => {
    setLoading(true);
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
      .then((res) => {
        setLoading(false);
        const { images } = values;
        let filteredImages = images.filter((item) => {
          return item.public_id !== public_id;
        });

        setValues({ ...values, images: filteredImages });

        const newAdminProducts = admin.products.map((product) =>
          product.slug === slug
            ? { ...values, images: filteredImages }
            : product
        );

        dispatch({
          type: "ADMIN_OBJECT",
          payload: { ...admin, products: newAdminProducts },
        });
        localStorage.setItem(
          "admin",
          JSON.stringify({ ...admin, products: newAdminProducts })
        );

        updateChanges(
          process.env.REACT_APP_ESTORE_ID,
          "productChange",
          user.token
        ).then((res) => {
          dispatch({
            type: "ESTORE_INFO",
            payload: res.data,
          });
          localStorage.setItem("estore", JSON.stringify(res.data));
        });

        axios.put(
          `${process.env.REACT_APP_API}/product/imageupdate/${slug}`,
          {
            images: filteredImages,
          },
          {
            headers: {
              authtoken: user ? user.token : "",
            },
          }
        );
      })
      .catch((error) => {
        toast.error(error.message);
        setLoading(false);
      });
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

export default FileUpload;
