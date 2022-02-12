import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Button, Select, Divider, Input, Radio } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import AdminNav from "../../../components/nav/AdminNav";
import { getAddiv3, updateMyAddiv3 } from "./../../../functions/addiv3";

const { Option } = Select;

const initialState = {
  name: "",
  minorder: "",
  maxorder: "",
  delfee: "",
  delfeetype: "",
  discount: "",
  discounttype: "",
  servefee: "",
  servefeetype: "",
  deltime: "",
  deltimetype: "",
};

const LocationUpdate = ({ history, match }) => {
  const { addiv3, coucode, currency } = match.params;

  const [values, setValues] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadAddiv3();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadAddiv3 = () => {
    setLoading(true);
    getAddiv3(coucode, addiv3).then((res) => {
      const addiv3 = res.data;
      if (addiv3) {
        delete addiv3.couid;
        delete addiv3.adDivId1;
        delete addiv3.adDivId2;
        setValues({ ...initialState, ...addiv3 });
        setLoading(false);
      } else {
        history.push("/admin/location");
      }
    });
  };

  const [day, setDay] = useState("");
  const [dayArray, setDayArray] = useState(
    Array.from({ length: 30 }, (_, i) => i + 1)
  );

  const addItem = () => {
    if (parseInt(day) > 0) setDayArray([...dayArray, day]);
  };

  const plainOptions = ["%", currency];
  const timeOptions = ["days", "hours"];

  const updateSubmit = () => {
    setLoading(true);
    updateMyAddiv3(coucode, addiv3, values, user.token).then(() => {
      history.push("/admin/location");
    });
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-m-2">
          <AdminNav />
        </div>

        <div className="col-md-10 bg-white mt-3 mb-5 pb-5">
          <h4 style={{ margin: "20px 0" }}>Location Update</h4>
          <hr />

          <div className="form-group">
            <label>
              <b>Name</b>
            </label>
            <input
              type="text"
              name="addiv3"
              className="form-control"
              value={values.name}
              onChange={(e) =>
                setValues({
                  ...values,
                  name: e.target.value,
                })
              }
              placeholder={`Type a name here`}
              disabled={loading}
              autoFocus
            />
          </div>
          <div className="form-group">
            <label>
              <b>Minimum Order Amount</b>
            </label>
            <input
              type="text"
              value={values.minorder}
              className="form-control"
              disabled={loading}
              onChange={(e) =>
                setValues({ ...values, minorder: e.target.value })
              }
              placeholder={`Enter "0" if no minimum amount`}
              required
            />
          </div>
          <div className="form-group">
            <label>
              <b>Maximum Order Amount (No Delivery Fee above this amount)</b>
            </label>
            <input
              type="text"
              value={values.maxorder}
              className="form-control"
              disabled={loading}
              onChange={(e) =>
                setValues({ ...values, maxorder: e.target.value })
              }
              placeholder={`Enter "0" if no Delivery Fee, "9999999" if with Delivery Fee whatever the amount`}
              required
            />
          </div>
          <div className="form-group">
            <label>
              <b>Delivery Fee</b>
            </label>
            <input
              type="text"
              value={values.delfee}
              className="form-control"
              disabled={
                loading ||
                parseFloat(values.maxorder) === 0 ||
                values.maxorder.length === 0
              }
              onChange={(e) => setValues({ ...values, delfee: e.target.value })}
              required
            />
            In:{" "}
            <Radio.Group
              options={plainOptions}
              onChange={(e) =>
                setValues({ ...values, delfeetype: e.target.value })
              }
              value={values.delfeetype}
            />
          </div>
          <div className="form-group">
            <label>
              <b>Discount</b>
            </label>
            <input
              type="text"
              value={values.discount}
              className="form-control"
              disabled={loading}
              onChange={(e) =>
                setValues({ ...values, discount: e.target.value })
              }
              placeholder={`Enter "0" if no Discount`}
              required
            />
            In:{" "}
            <Radio.Group
              options={plainOptions}
              onChange={(e) =>
                setValues({ ...values, discounttype: e.target.value })
              }
              value={values.discounttype}
            />
          </div>
          <div className="form-group">
            <label>
              <b>Service Fee</b>
            </label>
            <input
              type="text"
              value={values.servefee}
              className="form-control"
              disabled={loading}
              onChange={(e) =>
                setValues({ ...values, servefee: e.target.value })
              }
              placeholder={`Enter "0" if no Service Fee`}
              required
            />
            In:{" "}
            <Radio.Group
              options={plainOptions}
              onChange={(e) =>
                setValues({ ...values, servefeetype: e.target.value })
              }
              value={values.servefeetype}
            />
          </div>
          <div className="form-group">
            <label>
              <b>Delivery Time</b>
            </label>
            <Select
              style={{ width: "100%" }}
              value={values.deltime}
              onChange={(value) => setValues({ ...values, deltime: value })}
              disabled={loading}
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
              value={values.deltimetype}
            />
          </div>

          {loading && (
            <h4 style={{ margin: "20px 0" }}>
              <LoadingOutlined />
            </h4>
          )}

          <Button
            onClick={updateSubmit}
            type="primary"
            className="mb-3"
            block
            shape="round"
            size="large"
            disabled={
              values.minorder.length === 0 ||
              values.maxorder.length === 0 ||
              values.discount.length === 0 ||
              values.servefee.length === 0 ||
              values.deltime.length === 0 ||
              loading
            }
            style={{ marginTop: "30px", width: "150px" }}
          >
            Update
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LocationUpdate;
