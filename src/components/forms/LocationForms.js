import React, { useState } from "react";
import { Button, Select, Divider, Input, Radio } from "antd";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";

const { Option } = Select;

const LocationForm = ({
  values,
  setValues,
  handleCountryChange,
  handleAddiv1Change,
  handleAddiv2Change,
  handleAddiv3Change,
  handleSubmit,
  loading,
}) => {
  const {
    country,
    countries,
    addiv1,
    addiv1s,
    addiv2,
    addiv2s,
    addiv3,
    addiv3s,
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

  return (
    <form>
      <div className="form-group">
        <label>
          <b>Country</b>
        </label>
        <select
          name="country"
          className="form-control"
          onChange={handleCountryChange}
          value={country && country._id ? country._id : ""}
          disabled={loading === 1}
        >
          <option value="" disabled hidden>
            - choose -
          </option>
          {countries.length > 0 &&
            countries.map((country) => (
              <option key={country._id} value={country._id}>
                {country.name}
              </option>
            ))}
        </select>
      </div>
      {country && country.adDivName1 && (
        <div className="form-group">
          <label>
            <b>{country.adDivName1}</b>
          </label>
          <select
            name="country"
            className="form-control"
            onChange={handleAddiv1Change}
            value={addiv1 && addiv1._id}
            disabled={loading === 1}
          >
            <option value="" disabled hidden>
              - choose -
            </option>
            <optgroup label="Add All">
              <option key="1" value="1">
                Add all {country.adDivName1}
              </option>
            </optgroup>
            <optgroup label="Create New">
              <option key="2" value="2">
                + Create
              </option>
            </optgroup>
            <optgroup label="Created"></optgroup>
            <optgroup label="Suggested">
              {addiv1s.length > 0 &&
                addiv1s.map((addiv1) => (
                  <option key={addiv1._id} value={addiv1._id}>
                    {addiv1.name}
                  </option>
                ))}
            </optgroup>
          </select>
          {addiv1 && addiv1._id === "2" && (
            <input
              type="text"
              name="addiv1"
              className="form-control"
              value={addiv1.name}
              onChange={(e) =>
                setValues({
                  ...values,
                  addiv1: { ...addiv1, name: e.target.value },
                })
              }
              placeholder={`Type a ${country.adDivName1} here`}
              disabled={loading === 1}
              autoFocus
            />
          )}
        </div>
      )}
      {country && country.adDivName2 && (
        <div className="form-group">
          <label>
            <b>{country.adDivName2}</b>
          </label>
          <select
            name="country"
            className="form-control"
            onChange={handleAddiv2Change}
            value={addiv2 && addiv2._id}
            disabled={loading === 1}
          >
            <option value="" disabled hidden>
              - choose -
            </option>
            <optgroup label="Add All">
              {(addiv1._id === "1" || addiv1._id === "2") &&
              addiv2._id === "2" ? (
                ""
              ) : (
                <option key="1" value="1">
                  Add all {country.adDivName2}
                </option>
              )}
            </optgroup>
            <optgroup label="Create New">
              {(addiv1._id === "1" || addiv1._id === "2") &&
              addiv2._id === "1" ? (
                ""
              ) : (
                <option key="2" value="2">
                  + Create
                </option>
              )}
            </optgroup>
            <optgroup label="Created"></optgroup>
            <optgroup label="Suggested">
              {addiv2s.length > 0 &&
                addiv2s.map((addiv2) => (
                  <option key={addiv2._id} value={addiv2._id}>
                    {addiv2.name}
                  </option>
                ))}
            </optgroup>
          </select>
          {addiv2 && addiv2._id === "2" && (
            <input
              type="text"
              name="addiv2"
              className="form-control"
              value={addiv2.name}
              onChange={(e) =>
                setValues({
                  ...values,
                  addiv2: { ...addiv2, name: e.target.value },
                })
              }
              placeholder={`Type a ${country.adDivName2} here`}
              disabled={loading === 1}
              autoFocus
            />
          )}
        </div>
      )}
      {country && country.adDivName3 && (
        <div className="form-group">
          <label>
            <b>{country.adDivName3}</b>
          </label>
          <select
            name="country"
            className="form-control"
            onChange={handleAddiv3Change}
            value={addiv3 && addiv3._id}
            disabled={loading === 1}
          >
            <option value="" disabled hidden>
              - choose -
            </option>
            <optgroup label="Add All">
              {(addiv2._id === "1" || addiv2._id === "2") &&
              addiv3._id === "2" ? (
                ""
              ) : (
                <option key="1" value="1">
                  Add all {country.adDivName3}
                </option>
              )}
            </optgroup>
            <optgroup label="Create New">
              {(addiv2._id === "1" || addiv2._id === "2") &&
              addiv3._id === "1" ? (
                ""
              ) : (
                <option key="2" value="2">
                  + Create
                </option>
              )}
            </optgroup>
            <optgroup label="Created"></optgroup>
            <optgroup label="Suggested">
              {addiv3s.length > 0 &&
                addiv3s.map((addiv3) => (
                  <option key={addiv3._id} value={addiv3._id}>
                    {addiv3.name}
                  </option>
                ))}
            </optgroup>
          </select>
          {addiv3 && addiv3._id === "2" && (
            <input
              type="text"
              name="addiv3"
              className="form-control"
              value={addiv3.name}
              onChange={(e) =>
                setValues({
                  ...values,
                  addiv3: { ...addiv3, name: e.target.value },
                })
              }
              placeholder={`Type a ${country.adDivName3} here`}
              disabled={loading === 1}
              autoFocus
            />
          )}
        </div>
      )}
      {JSON.stringify(country) !== "{}" &&
        JSON.stringify(addiv1) !== "{}" &&
        addiv1.name.length > 1 &&
        JSON.stringify(addiv2) !== "{}" &&
        addiv2.name.length > 1 &&
        JSON.stringify(addiv3) !== "{}" &&
        addiv3.name.length > 1 && (
          <>
            <h4 style={{ margin: "40px 0 20px 0" }}>Important Details</h4>
            <hr />
            <div className="form-group">
              <label>
                <b>Minimum Order Amount</b>
              </label>
              <input
                type="text"
                value={minorder}
                className="form-control"
                disabled={loading === 1}
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
                value={maxorder}
                className="form-control"
                disabled={loading === 1}
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
                value={delfee}
                className="form-control"
                disabled={
                  loading === 1 ||
                  parseFloat(maxorder) === 0 ||
                  maxorder.length === 0
                }
                onChange={(e) =>
                  setValues({ ...values, delfee: e.target.value })
                }
                required
              />
              In:{" "}
              <Radio.Group
                options={plainOptions}
                onChange={(e) =>
                  setValues({ ...values, delfeetype: e.target.value })
                }
                value={delfeetype}
              />
            </div>
            <div className="form-group">
              <label>
                <b>Discount</b>
              </label>
              <input
                type="text"
                value={discount}
                className="form-control"
                disabled={loading === 1}
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
                value={discounttype}
              />
            </div>
            <div className="form-group">
              <label>
                <b>Service Fee</b>
              </label>
              <input
                type="text"
                value={servefee}
                className="form-control"
                disabled={loading === 1}
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
                value={servefeetype}
              />
            </div>
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

      {loading === 1 && (
        <h4 style={{ margin: "20px 0" }}>
          <LoadingOutlined />
        </h4>
      )}
      {loading === 2 && (
        <h6 style={{ margin: "20px 0" }}>
          <LoadingOutlined />
        </h6>
      )}

      <Button
        onClick={handleSubmit}
        type="primary"
        className="mb-3"
        block
        shape="round"
        size="large"
        disabled={
          minorder.length === 0 ||
          maxorder.length === 0 ||
          discount.length === 0 ||
          servefee.length === 0 ||
          deltime.length === 0 ||
          loading === 1
        }
        style={{ marginTop: "30px", width: "150px" }}
      >
        Submit
      </Button>
    </form>
  );
};

export default LocationForm;
