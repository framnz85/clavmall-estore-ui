import React, { useState } from "react";
import { Modal, Pagination } from "antd";
import { DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import TableHeader from "./table/TableHeader";
import TableBody from "./table/TableBody";
import InputSearch from "./form/InputSearch";

const { confirm } = Modal;

const NotAvailableCard = ({ values, setValues }) => {
  const { noAvail, itemsCount, pageSize, currentPage, sortkey, sort } = values;

  const [keyword, setKeyword] = useState("");

  const handlePageChange = async (page) => {
    setValues({
      ...values,
      currentPage: page,
    });
  };

  const handleSort = (sortName) => {
    setValues({
      ...values,
      currentPage: 1,
      sortkey: sortName,
      sort: -sort,
    });
  };

  const searched = (keyword) => (noAvail) => {
    return (
      (noAvail.country && noAvail.country.toLowerCase().includes(keyword)) ||
      (noAvail.addiv1Name &&
        noAvail.addiv1Name.toLowerCase().includes(keyword)) ||
      (noAvail.addiv2Name &&
        noAvail.addiv2Name.toLowerCase().includes(keyword)) ||
      (noAvail.addiv3Name && noAvail.addiv3Name.toLowerCase().includes(keyword))
    );
  };

  const deleteSingle = (address) => {
    const {
      country,
      addiv1,
      addiv1Name,
      addiv2,
      addiv2Name,
      addiv3,
      addiv3Name,
    } = address;
    confirm({
      title: `Are you sure you want to delete ${country}, ${addiv1Name}${
        addiv2 ? ", " + addiv2Name : ""
      }${addiv3 ? ", " + addiv3Name : ""}?`,
      icon: <ExclamationCircleOutlined />,
      content:
        "Deleting this will also delete all the area under this location.",
      okText: "Yes",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        let newNoAvail;

        if (addiv3) {
          newNoAvail = noAvail.filter((address) => address.addiv3 !== addiv3);
        } else if (addiv2) {
          newNoAvail = noAvail.filter((address) => address.addiv2 !== addiv2);
        } else {
          newNoAvail = noAvail.filter((address) => address.addiv1 !== addiv1);
        }

        setValues({
          ...values,
          noAvail: newNoAvail,
        });
        toast.success("Location saved!");
        toast.warning(
          "Make sure to hit the Update button below before you proceed"
        );
      },
      onCancel() {},
    });
  };

  const columns = [
    {
      key: "country",
      path: "country",
      label: "Country",
      content: (address) => address.country,
    },
    {
      key: "addiv1",
      path: "addiv1Name",
      label: "Admin Divission 1",
      content: (address) => address.addiv1Name,
    },
    {
      key: "addiv2",
      path: "addiv2Name",
      label: "Admin Divission 2",
      content: (address) => address.addiv2Name,
    },
    {
      key: "addiv3",
      path: "addiv3Name",
      label: "Admin Divission 3",
      content: (address) => address.addiv3Name,
    },
    {
      key: "action",
      content: (address) => {
        return (
          <>
            <DeleteOutlined
              className="text-danger"
              onClick={() => deleteSingle(address)}
            />
          </>
        );
      },
    },
  ];

  return (
    <>
      <InputSearch
        keyword={keyword}
        setKeyword={setKeyword}
        placeholder="Search location"
        data={values}
        setData={setValues}
      />

      <table className="table">
        <TableHeader columns={columns} onSort={handleSort} sort={sort} />
        <TableBody
          columns={columns}
          data={noAvail
            .filter(searched(keyword))
            .sort((a, b) =>
              a[sortkey] > b[sortkey]
                ? sort
                : b[sortkey] > a[sortkey]
                ? -sort
                : 0
            )
            .slice(currentPage * pageSize - pageSize, currentPage * pageSize)
            .map((address, index) => {
              return { ...address, _id: index };
            })}
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
    </>
  );
};

export default NotAvailableCard;
