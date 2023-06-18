import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Modal, Pagination } from "antd";

import { getAllMyPayments, deleteMyPayment } from "../../../functions/payment";
import { removeFileImage } from "../../../functions/admin";

import noImage from "../../../images/noimage.jpg";
import TableHeader from "../../common/table/TableHeader";
import TableBody from "../../common/table/TableBody";
import InputSearch from "../../common/form/InputSearch";

const { confirm } = Modal;

const MyPaymentTable = ({ myValues, setMyValues }) => {
  let dispatch = useDispatch();
  const { myPayments, itemsCount, pageSize, currentPage, sortkey, sort } =
    myValues;

  const { user, admin, estore } = useSelector((state) => ({ ...state }));

  const [keyword, setKeyword] = useState("");

  const columns = [
    {
      key: "number",
      label: "#",
      index: true,
    },
    {
      key: "image",
      label: "Image",
      content: (payment) =>
        <img
          alt={payment.name}
          src={payment.images && payment.images.length > 0 ? process.env.REACT_APP_CLAVMALL_IMG + "/estore_images/estore" + process.env.REACT_APP_ESTORE_ID + "/thumb/" + payment.images[0].url : noImage}
          className="m-1"
          style={{ height: "150px", width: "150px", objectFit: "cover" }}
        />,
    },
    {
      key: "name",
      path: "name",
      label: "Name",
      content: (payment) => payment.name,
    },
    {
      key: "category",
      path: "category",
      label: "Category",
      content: (payment) => payment.category,
    },
    {
      key: "details",
      label: "Details",
      content: (payment) =>
        payment.details.map((detail) => {
          return (
            <div key={detail._id} style={{width: '300px', whiteSpace: 'pre-wrap', overflowWrap: 'break-word'}}>
              <b>{detail.desc}</b>: {detail.value}
              <br />
            </div>
          );
        }),
    },
    {
      key: "action",
      content: (payment) => {
        return (
          <div style={{width: 50}}>
            <Link to={`/admin/payment/${payment._id}`}>
              <EditOutlined className="text-secondary mr-2" />
            </Link>
            <DeleteOutlined
              className="text-danger"
              onClick={() => deleteSingle(payment)}
            />
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    loadAllMyPayment();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadAllMyPayment = () => {
    if (admin.myPayments) {
      setMyValues({
        ...myValues,
        myPayments: admin.myPayments,
        itemsCount: admin.myPayments.length,
      });
    } else {
      getAllMyPayments().then((res) => {
        setMyValues({
          ...myValues,
          myPayments: res.data,
          itemsCount: res.data.length,
        });
        dispatch({
          type: "ADMIN_OBJECT_VI",
          payload: { myPayments: res.data },
        });
      });
    }
  };

  const handlePageChange = async (page) => {
    setMyValues({
      ...myValues,
      currentPage: page,
    });
  };

  const handleSort = (sortName) => {
    setMyValues({
      ...myValues,
      currentPage: 1,
      sortkey: sortName,
      sort: -sort,
    });
  };

  const searched = (keyword) => (category) =>
    category.name.toLowerCase().includes(keyword);

  const deleteSingle = (payment) => {
    confirm({
      title: "Are you sure you want to delete " + payment.name + " payment?",
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        deleteMyPayment(payment._id, user.token).then(() => {
          for (let i = 0; i < payment.images.length; i++) {
            removeFileImage(payment.images[i].public_id, estore, user.token);
          }
          setMyValues({
            ...myValues,
            myPayments: myPayments.filter(
              (myValue) => myValue._id !== payment._id
            ),
            itemsCount: itemsCount - 1,
          });
          dispatch({
            type: "ADMIN_OBJECT_VI",
            payload: {
              myPayments: myPayments.filter(
                (myValue) => myValue._id !== payment._id
              ),
            },
          });
        });
      },
      onCancel() {},
    });
  };

  return (
    <div>
      <InputSearch
        keyword={keyword}
        setKeyword={setKeyword}
        placeholder="Search payment"
        data={myValues}
        setData={setMyValues}
      />
      <table className="table">
        <TableHeader columns={columns} onSort={handleSort} sort={sort} />
        <TableBody
          columns={columns}
          data={
            myPayments
              .filter(searched(keyword))
              .sort((a, b) =>
                a[sortkey] > b[sortkey]
                  ? sort
                  : b[sortkey] > a[sortkey]
                  ? -sort
                  : 0
              )
              .slice(currentPage * pageSize - pageSize, currentPage * pageSize)
            // .find((element) => element.name === "bdo")
          }
          currentPage={currentPage}
          pageSize={pageSize}
        />
      </table>
      <Pagination
        className="text-center pt-3"
        onChange={handlePageChange}
        current={currentPage}
        pageSize={pageSize}
        total={itemsCount}
      />
      <br />
    </div>
  );
};

export default MyPaymentTable;
