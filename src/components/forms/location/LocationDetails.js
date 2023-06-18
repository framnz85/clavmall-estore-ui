import React, { useState } from "react";
import { Select, Divider, Input, Radio } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ShowingForms from "../../common/ShowingForms";

const { Option } = Select;

const LocationDetails = ({ values, setValues, loading, edit }) => {
  const {
    name,
    country,
    addiv1,
    addiv2,
    addiv3,
    minorder,
    maxorder,
    delfee,
    delfeetype,
    discount,
    discounttype,
    servefee,
    servefeetype,
    referral,
    referraltype,
    deltime,
    deltimetype,
  } = values;

  const [day, setDay] = useState("");
  const [dayArray, setDayArray] = useState(
    Array.from({ length: 30 }, (_, i) => i + 1)
  );

  const addItem = () => {
    if (parseInt(day) > 0) setDayArray([...dayArray, day]);
  };

  const plainOptions = ["%", country && country.currency];
  const timeOptions = ["days", "hours"];

  const formProperty = [
    {
      type: "text",
      name: "name",
      label: "Location Name",
      onChange: () => "",
      value: name,
      disabled: false,
      show: name ? true : false,
      edit,
      required: true,
    },
    {
      type: "number",
      name: "minorder",
      label: "Minimum Order Amount",
      onChange: (e) => setValues({ ...values, minorder: e.target.value }),
      value: minorder,
      disabled: loading === 1,
      placeholder: `Enter "0" if no minimum amount`,
      show: true,
      edit,
      required: true,
    },
    {
      type: "number",
      name: "maxorder",
      label: "Maximum Order Amount (No Delivery Fee above this amount)",
      onChange: (e) => setValues({ ...values, maxorder: e.target.value }),
      value: maxorder,
      disabled: loading === 1,
      placeholder: `Enter "0" if no Delivery Fee, "9999999" if with Delivery Fee whatever the amount`,
      show: true,
      edit,
      required: true,
    },
    {
      type: "number",
      name: "delfee",
      label: "Delivery Fee",
      onChange: (e) => setValues({ ...values, delfee: e.target.value }),
      value: delfee,
      radio: {
        label: "In: ",
        options: plainOptions,
        onChange: (e) => setValues({ ...values, delfeetype: e.target.value }),
        value: delfeetype
      },
      disabled: loading === 1 || parseFloat(maxorder) === 0 || maxorder.length === 0,
      show: true,
      edit,
      required: true,
    },
    {
      type: "number",
      name: "discount",
      label: "Discount",
      onChange: (e) => setValues({ ...values, discount: e.target.value }),
      value: discount,
      radio: {
        label: "In: ",
        options: plainOptions,
        onChange: (e) => setValues({ ...values, discounttype: e.target.value }),
        value: discounttype
      },
      disabled: loading === 1,
      placeholder: `Enter "0" if no Discount`,
      show: true,
      edit,
      required: true,
    },
    {
      type: "number",
      name: "servefee",
      label: "Service Fee",
      onChange: (e) => setValues({ ...values, servefee: e.target.value }),
      value: servefee,
      radio: {
        label: "In: ",
        options: plainOptions,
        onChange: (e) => setValues({ ...values, servefeetype: e.target.value }),
        value: servefeetype
      },
      disabled: loading === 1,
      placeholder: `Enter "0" if no Service Fee`,
      show: true,
      edit,
      required: true,
    },
    {
      type: "number",
      name: "referral",
      label: "Referral",
      onChange: (e) => setValues({ ...values, referral: e.target.value }),
      value: referral,
      radio: {
        label: "In: ",
        options: plainOptions,
        onChange: (e) => setValues({ ...values, referraltype: e.target.value }),
        value: referraltype
      },
      disabled: loading === 1,
      placeholder: `Must be less than Service Fee. Enter "0" if no Referral`,
      show: true,
      edit,
      required: true,
    },
  ]

  return (
    <>
      {(edit || JSON.stringify(country) !== "{}") &&
        (edit || JSON.stringify(addiv1) !== "{}") &&
        (edit || addiv1.name.length > 1) &&
        (edit || JSON.stringify(addiv2) !== "{}") &&
        (edit || addiv2.name.length > 1) &&
        (edit || JSON.stringify(addiv3) !== "{}") &&
        (edit || addiv3.name.length > 1) && (
          <>
            <h4 style={{ margin: "40px 0 20px 0" }}>Important Details</h4>
            <hr />

            <ShowingForms formProperty={formProperty} />

            <div className="form-group">
              <label>
                <b>Delivery Time</b>
              </label>
              <Select
                style={{ width: "100%" }}
                value={deltime}
                onChange={(value) => setValues({ ...values, deltime: value })}
                disabled={loading === 1}
                dropdownRender={(menu) => (
                  <div>
                    {menu}
                    <Divider style={{ margin: "4px 0" }} />
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "nowrap",
                        padding: 8,
                      }}
                    >
                      <Input
                        style={{ flex: "auto" }}
                        value={day}
                        onChange={(e) => setDay(e.target.value)}
                      />
                      <span
                        style={{
                          flex: "none",
                          padding: "8px",
                          display: "block",
                          cursor: "pointer",
                        }}
                        onClick={addItem}
                      >
                        <PlusOutlined /> Add item
                      </span>
                    </div>
                  </div>
                )}
              >
                {dayArray.map((day) => (
                  <Option key={day}>{day}</Option>
                ))}
              </Select>
              In:{" "}
              <Radio.Group
                options={timeOptions}
                onChange={(e) =>
                  setValues({ ...values, deltimetype: e.target.value })
                }
                value={deltimetype}
              />
            </div>
          </>
        )}
    </>
  );
};

export default LocationDetails;
