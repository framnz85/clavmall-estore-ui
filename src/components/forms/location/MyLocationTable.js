import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Modal, Pagination } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import TableHeader from "../../common/table/TableHeader";
import TableBody from "../../common/table/TableBody";
import { deleteAddiv3 } from "../../../functions/estore";

const { confirm } = Modal;

const MyLocationTable = ({ myValues, setMyValues, keyword }) => {
  const { country, addiv3s, itemsCount, pageSize, currentPage, sortkey, sort } = myValues;

  const { user } = useSelector((state) => ({ ...state }));

  const deleteSingle = (addiv3) => {
    confirm({
      title: "Are you sure you want to delete " + addiv3.name + "?",
      icon: <ExclamationCircleOutlined />,
      content:
        "Deleting " + addiv3.name + " will also delete all its configuration.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        deleteAddiv3(country.countryCode, addiv3._id, user.token).then(() => {
          setMyValues({
            ...myValues,
            addiv3s: addiv3s.filter((add) => add._id !== addiv3._id),
          });
        });
      },
      onCancel() { },
    });
  };

  const columns = [
    {
      key: "addiv3",
      path: "addiv3",
      label: country && country.adDivName3 ? country.adDivName3 : "Name",
      content: (addiv3) => addiv3.name,
    },
    {
      key: "minorder",
      label: "Minimum",
      content: (addiv3) => country && country.currency + " " + parseFloat(addiv3.minorder).toFixed(2),
    },
    {
      key: "maxorder",
      label: "Maximum",
      content: (addiv3) =>
        country &&
        country.currency + " " + parseFloat(addiv3.maxorder).toFixed(2),
    },
    {
      key: "delfee",
      label: "Delivery",
      content: (addiv3) =>
        addiv3.delfeetype === "%"
          ? parseFloat(addiv3.delfee).toFixed(2) + " " + addiv3.delfeetype
          : addiv3.delfeetype + " " + parseFloat(addiv3.delfee).toFixed(2),
    },
    {
      key: "discount",
      label: "Discount",
      content: (addiv3) =>
        addiv3.discounttype === "%"
          ? parseFloat(addiv3.discount).toFixed(2) + " " + addiv3.discounttype
          : addiv3.discounttype + " " + parseFloat(addiv3.discount).toFixed(2),
    },
    {
      key: "servefee",
      label: "Service Fee",
      content: (addiv3) =>
        addiv3.servefeetype === "%"
          ? parseFloat(addiv3.servefee).toFixed(2) + " " + addiv3.servefeetype
          : addiv3.servefeetype + " " + parseFloat(addiv3.servefee).toFixed(2),
    },
    {
      key: "referral",
      label: "Referral",
      content: (addiv3) =>
        addiv3.referraltype === "%"
          ? parseFloat(addiv3.referral).toFixed(2) + " " + addiv3.referraltype
          : addiv3.referraltype + " " + parseFloat(addiv3.referral).toFixed(2),
    },
    {
      key: "deltime",
      label: "Del. Time",
      content: (addiv3) => addiv3.deltime + " " + addiv3.deltimetype,
    },
    {
      key: "action",
      label: "",
      content: (addiv3) => {
        return (
          <>
            <Link
              to={`/admin/location/${addiv3._id}/${country.countryCode}/${country.currency}`}
            >
              <EditOutlined className="text-secondary mr-2" />
            </Link>
            <DeleteOutlined
              className="text-danger"
              onClick={() => deleteSingle(addiv3)}
            />
          </>
        )
      },
    },
  ];

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

  return (
    <>
      <table className="table">
        <TableHeader columns={columns} onSort={handleSort} sort={sort} />
        <TableBody
          columns={columns}
          data={
            addiv3s
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
    </>
  );
};

export default MyLocationTable;
