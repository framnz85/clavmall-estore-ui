import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Modal } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { deleteAddiv3 } from "../../functions/estore";

const { confirm } = Modal;

const MyLocationCard = ({ myValues, setMyValues }) => {
  const { country, addiv3s } = myValues;

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
      onCancel() {},
    });
  };

  return (
    <table className="table table-bordered">
      <thead className="thead-light">
        <tr align="center">
          <th scope="col">
            {country && country.adDivName3 ? country.adDivName3 : "Name"}
          </th>
          <th scope="col">Minimum Order</th>
          <th scope="col">Maximum Order</th>
          <th scope="col">Delivery Fee</th>
          <th scope="col">Discount</th>
          <th scope="col">Service Fee</th>
          <th scope="col">Delivery Time</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody>
        {addiv3s &&
          addiv3s.map((addiv3) => {
            const {
              _id,
              name,
              minorder,
              maxorder,
              delfee,
              delfeetype,
              discount,
              discounttype,
              servefee,
              servefeetype,
              deltime,
              deltimetype,
            } = addiv3;
            return (
              <tr key={_id}>
                <td>{name}</td>
                <td>
                  {country &&
                    country.currency + " " + parseFloat(minorder).toFixed(2)}
                </td>
                <td>
                  {country &&
                    country.currency + " " + parseFloat(maxorder).toFixed(2)}
                </td>
                <td>
                  {delfeetype === "%"
                    ? parseFloat(delfee).toFixed(2) + " " + delfeetype
                    : delfeetype + " " + parseFloat(delfee).toFixed(2)}
                </td>
                <td>
                  {discounttype === "%"
                    ? parseFloat(discount).toFixed(2) + " " + discounttype
                    : discounttype + " " + parseFloat(discount).toFixed(2)}
                </td>
                <td>
                  {servefeetype === "%"
                    ? parseFloat(servefee).toFixed(2) + " " + servefeetype
                    : servefeetype + " " + parseFloat(servefee).toFixed(2)}
                </td>
                <td>{deltime + " " + deltimetype}</td>
                <td>
                  <Link
                    to={`/admin/location/${addiv3._id}/${country.countryCode}/${country.currency}`}
                  >
                    <EditOutlined className="text-secondary mr-2" />
                  </Link>
                  <DeleteOutlined
                    className="text-danger"
                    onClick={() => deleteSingle(addiv3)}
                  />
                </td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
};

export default MyLocationCard;
