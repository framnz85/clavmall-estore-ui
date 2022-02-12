import React from "react";
import { useSelector } from "react-redux";
import { Select, Button, Modal } from "antd";
import { LoadingOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { deleteAddiv2, deleteAddiv1 } from "../../functions/estore";

const { Option } = Select;
const { confirm } = Modal;

const MyLocationForm = ({
  myValues,
  handleMyCountryChange,
  handleMyAddiv1Change,
  handleMyAddiv2Change,
  loading,
}) => {
  const { country, countries, addiv1, addiv1s, addiv2, addiv2s } = myValues;

  const { user } = useSelector((state) => ({ ...state }));

  const deleteMultiple = () => {
    if (addiv2._id) {
      confirm({
        title: "Are you sure you want to delete " + addiv2.name + "?",
        icon: <ExclamationCircleOutlined />,
        content:
          "Deleting " +
          addiv2.name +
          " will also delete all the location under it.",
        okText: "Yes",
        okType: "danger",
        cancelText: "No",
        onOk() {
          deleteAddiv2(country.countryCode, addiv2._id, user.token).then(() => {
            window.location.reload();
          });
        },
        onCancel() {},
      });
    } else if (addiv1._id) {
      confirm({
        title: "Are you sure you want to delete " + addiv1.name + "?",
        icon: <ExclamationCircleOutlined />,
        content:
          "Deleting " +
          addiv1.name +
          " will also delete all the location under it.",
        okText: "Yes",
        okType: "danger",
        cancelText: "No",
        onOk() {
          deleteAddiv1(country.countryCode, addiv1._id, user.token).then(() => {
            window.location.reload();
          });
        },
        onCancel() {},
      });
    }
  };

  return (
    <>
      <Select
        style={{ width: "240px" }}
        onChange={handleMyCountryChange}
        defaultValue="Select Country"
      >
        {countries.length > 0 &&
          countries.map((country) => (
            <Option key={country._id} value={country._id}>
              {country.name}
            </Option>
          ))}
      </Select>
      {country && country.adDivName1 && (
        <Select
          style={{ width: "240px" }}
          onChange={handleMyAddiv1Change}
          defaultValue={`Select ${country.adDivName1}`}
        >
          {addiv1s.length > 0 &&
            addiv1s.map((addiv1) => (
              <Option key={addiv1._id} value={addiv1._id}>
                {addiv1.name}
              </Option>
            ))}
        </Select>
      )}
      {country && country.adDivName2 && (
        <Select
          style={{ width: "240px" }}
          onChange={handleMyAddiv2Change}
          defaultValue={`Select ${country.adDivName2}`}
        >
          {addiv2s.length > 0 &&
            addiv2s.map((addiv2) => (
              <Option key={addiv2._id} value={addiv2._id}>
                {addiv2.name}
              </Option>
            ))}
        </Select>
      )}
      <Button
        type="primary"
        onClick={deleteMultiple}
        danger
        disabled={!addiv1 || !addiv1._id}
      >
        Delete {addiv2._id ? addiv2.name : addiv1._id ? addiv1.name : ""}
      </Button>{" "}
      {loading === 3 && (
        <span>
          <LoadingOutlined />
        </span>
      )}
    </>
  );
};

export default MyLocationForm;
