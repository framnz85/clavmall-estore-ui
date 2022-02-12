import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { Modal, Pagination } from "antd";
import { LoadingOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import AdminNav from "../../../components/nav/AdminNav";
import { getProducts, getProductsCount } from "../../../functions/product";
import AdminProductCard from "../../../components/cards/AdminProductCard";
import { removeProduct } from "../../../functions/product";
import { updateChanges } from "../../../functions/estore";

const { confirm } = Modal;

const AllProducts = () => {
  const itemPerPage = 20;

  const dispatch = useDispatch();
  const { user, admin } = useSelector((state) => ({ ...state }));
  const { prodCount, prodPages, products } = admin;

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadAllProducts();
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (typeof window !== undefined) {
      if (!localStorage.getItem("admin") || prodCount === 0) {
        getProductsCount().then((res) => {
          dispatch({
            type: "ADMIN_OBJECT",
            payload: { prodCount: parseInt(res.data) },
          });
          localStorage.setItem(
            "admin",
            JSON.stringify({ ...admin, prodCount: parseInt(res.data) })
          );
        });
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadAllProducts = () => {
    if (typeof window !== undefined) {
      if (!localStorage.getItem("admin") || !prodPages.includes(page)) {
        setLoading(true);
        getProducts("createdAt", "desc", page, itemPerPage)
          .then((res) => {
            const result = res.data.map((product) => ({ ...product, page }));

            dispatch({
              type: "ADMIN_OBJECT",
              payload: {
                prodPages: [...prodPages, page],
                products: [...products, ...result],
              },
            });
            localStorage.setItem(
              "admin",
              JSON.stringify({
                ...admin,
                prodPages: [...prodPages, page],
                products: [...products, ...result],
              })
            );
            setLoading(false);
          })
          .catch((error) => {
            toast.error(error.message);
            setLoading(false);
          });
      }
    }
  };

  const removeImage = (public_id) => {
    return axios.post(
      `${process.env.REACT_APP_API}/removeimage`,
      {
        public_id,
      },
      {
        headers: {
          authtoken: user ? user.token : "",
        },
      }
    );
  };

  const handleRemove = (slug, title, images) => {
    confirm({
      title: "Are you sure you want to delete " + title + "?",
      icon: <ExclamationCircleOutlined />,
      content: "Deleting this product will also delete all its images.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        removeProduct(slug, user.token)
          .then(async (res) => {
            for (let i = 0; i < images.length; i++) {
              await removeImage(images[i].public_id);
            }

            toast.error(`${res.data.title} is deleted`);

            const newAdminProducts = admin.products.filter(
              (product) => product.slug !== slug
            );

            const newProdCount = parseInt(admin.prodCount) - 1;

            dispatch({
              type: "ADMIN_OBJECT",
              payload: {
                ...admin,
                prodCount: newProdCount,
                products: newAdminProducts,
              },
            });
            localStorage.setItem(
              "admin",
              JSON.stringify({
                ...admin,
                prodCount: newProdCount,
                products: newAdminProducts,
              })
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
          })
          .catch((error) => {
            if (error.response.status === 400 || 404)
              toast.error(error.response.data);
            else toast.error(error.message);
          });
      },
      onCancel() {},
    });
  };

  return (
    <div className="container">
      <div className="row pb-5">
        <div className="col-m-2">
          <AdminNav />
        </div>
        <div className="col">
          <h4 style={{ margin: "20px 0" }}>
            {loading ? <LoadingOutlined /> : "All Products"}
          </h4>
          <div className="row">
            {products &&
              products
                .filter((product) => product.page === page)
                .map((product) => (
                  <div
                    key={product._id}
                    className="col-m-2"
                    style={{ margin: "0 10px 10px 0" }}
                  >
                    <AdminProductCard
                      product={product}
                      handleRemove={handleRemove}
                      canEdit={true}
                    />
                  </div>
                ))}
          </div>

          <Pagination
            current={page}
            total={(prodCount / itemPerPage) * 10}
            onChange={(value) => setPage(value)}
            className="text-center pt-3"
          />
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
