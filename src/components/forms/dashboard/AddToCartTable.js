import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import NumberFormat from "react-number-format";
import { Link } from "react-router-dom";
import { Pagination, Modal } from "antd";
import { toast } from "react-toastify";
import {
  UnorderedListOutlined,
  LoadingOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { isMobile } from "react-device-detect";

import TableHeader from "../../common/table/TableHeader";
import TableBody from "../../common/table/TableBody";

import { getAllCarts } from "../../../functions/admin";
import { emptyCartById } from "../../../functions/user";

const initialState = {
  carts: [],
  itemsCount: 0,
  pageSize: 20,
  currentPage: 1,
  sortkey: "createdAt",
  sort: -1,
  searchQuery: "",
};

const AddToCartTable = () => {
  const [values, setValues] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cartDelete, setCartDelete] = useState({});

  const { user } = useSelector((state) => ({ ...state }));

  const {
    carts,
    itemsCount,
    pageSize,
    currentPage,
    sortkey,
    sort,
    searchQuery,
  } = values;

  useEffect(() => {
    loadAddToCarts();
  }, [values.currentPage, values.sortkey, values.sort]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadAddToCarts = () => {
    setLoading(true);
    getAllCarts(
      sortkey,
      sort,
      currentPage,
      pageSize,
      searchQuery,
      user.token
    ).then((res) => {
      setValues({
        ...values,
        carts: res.data.carts,
      });
      setLoading(false);
    });
  };

  const columns = [
    {
      key: "createdAt",
      path: "createdAt",
      label: "Date Created",
      content: (cart) => new Date(cart.createdAt).toLocaleDateString(),
    },
    {
      key: "_id",
      path: "_id",
      label: "Cart ID",
      content: (cart) => cart._id,
    },
    {
      key: "orderedBy.name",
      path: "orderedBy.name",
      label: "Ordered By",
      content: (cart) => cart.orderedBy && cart.orderedBy.name,
    },
    {
      key: "cartTotal",
      path: "cartTotal",
      label: "Cart Total",
      content: (cart) => (
        <NumberFormat
          value={cart.cartTotal.toFixed(2)}
          displayType={"text"}
          thousandSeparator={true}
          prefix={"₱"}
        />
      ),
    },
    {
      key: "action",
      content: (cart) => {
        return (
          <div
            style={{
              width: isMobile ? "100%" : 40,
              fontSize: isMobile ? 20 : 14,
            }}
          >
            <Link to={`/admin/cart/${cart._id}`}>
              <UnorderedListOutlined />
            </Link>
            <DeleteOutlined
              style={{
                marginLeft: 10,
                color: "red",
                cursor: "pointer",
                float: isMobile ? "right" : "none",
                marginTop: isMobile ? 8 : 0,
              }}
              onClick={() => {
                setIsModalOpen(true);
                setCartDelete(cart);
              }}
            />
          </div>
        );
      },
    },
  ];

  const handleSort = (sortName) => {
    setValues({
      ...values,
      currentPage: 1,
      sortkey: sortName,
      sort: -sort,
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const removeCart = () => {
    setIsModalOpen(false);
    emptyCartById(cartDelete.orderedBy._id, user.token).then(() => {
      setValues({
        ...values,
        carts: carts.filter((c) => c._id !== cartDelete._id),
      });
      toast.error(`Cart of ${cartDelete.orderedBy.name} is now empty`);
    });
  };

  return (
    <div>
      <table className="table">
        <TableHeader columns={columns} onSort={handleSort} sort={sort} />
        <TableBody
          columns={columns}
          data={carts}
          currentPage={currentPage}
          pageSize={pageSize}
        />
      </table>
      {loading && (
        <div align="center">
          <LoadingOutlined />
          <br />
        </div>
      )}
      <Pagination
        className="text-center pt-3"
        onChange={(value) => setValues({ ...values, currentPage: value })}
        current={currentPage}
        pageSize={pageSize}
        total={itemsCount}
      />

      <Modal
        title="Empty Client Cart"
        visible={isModalOpen}
        onOk={removeCart}
        onCancel={handleCancel}
        okText="Empty"
      >
        <p style={{ textAlign: "center" }}>
          Are you sure you want to empty the cart of{" "}
          {cartDelete && cartDelete.orderedBy && cartDelete.orderedBy.name}?
        </p>
      </Modal>
    </div>
  );
};

export default AddToCartTable;
