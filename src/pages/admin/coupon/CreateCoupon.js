import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Modal } from "antd";
import {
  LoadingOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import {
  getCoupon,
  removeCoupon,
  createCoupon,
} from "../../../functions/coupon";
import "react-datepicker/dist/react-datepicker.css";
import AdminNav from "../../../components/nav/AdminNav";
import LocalSearch from "../../../components/forms/LocalSearch";

const { confirm } = Modal;

const CreateCoupon = () => {
  let dispatch = useDispatch();

  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [discount, setDiscount] = useState("");
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");

  const { user, coupon } = useSelector((state) => ({
    ...state,
  }));

  useEffect(() => {
    loadCoupons();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadCoupons = () => {
    if (typeof window !== undefined) {
      if (!localStorage.getItem("coupon")) {
        setLoading(true);
        getCoupon().then((coupon) => {
          dispatch({
            type: "COUPON_LIST",
            payload: { coupons: coupon.data },
          });
          localStorage.setItem(
            "coupon",
            JSON.stringify({ coupons: coupon.data })
          );
          setLoading(false);
        });
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    createCoupon({ name, expiry, discount }, user.token)
      .then((res) => {
        setLoading(false);
        setName("");
        setExpiry("");
        setDiscount("");
        toast.success(`"${res.data.name}" is created`);
        coupon.coupons.push(res.data);
        dispatch({
          type: "COUPON_LIST",
          payload: { coupons: [...coupon.coupons] },
        });
        localStorage.setItem("coupon", JSON.stringify(coupon));
      })
      .catch((error) => {
        if (error.response.status === 400) toast.error(error.response.data);
        else toast.error(error.message);
        setLoading(false);
      });
  };

  const handleRemove = async (couponId, name) => {
    confirm({
      title: "Are you sure you want to delete " + name + "?",
      icon: <ExclamationCircleOutlined />,
      content: "Make sure no one uses this coupon before deleting.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        setLoading(true);
        removeCoupon(couponId, user.token)
          .then((res) => {
            setLoading(false);
            toast.error(`"${res.data.name}" deleted.`);
            const result = coupon.coupons.filter(
              (coupon) => coupon._id !== couponId
            );
            dispatch({
              type: "COUPON_LIST",
              payload: { coupons: [...result] },
            });
            localStorage.setItem(
              "coupon",
              JSON.stringify({ coupons: [...result] })
            );
          })
          .catch((error) => {
            if (error.response.status === 400) toast.error(error.response.data);
            else toast.error(error.message);
            setLoading(false);
          });
      },
      onCancel() {},
    });
  };

  const searched = (keyword) => (coupon) =>
    coupon.name.toLowerCase().includes(keyword);

  return (
    <div className="container">
      <div className="row">
        <div className="col-m-2">
          <AdminNav />
        </div>

        <div className="col-md-10 bg-white mt-3 mb-5">
          <h4 style={{ margin: "20px 0" }}>Create Coupon</h4>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>
                <b>Name</b>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-control"
                autoFocus
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>
                <b>Discount %</b>
              </label>
              <input
                type="text"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="form-control"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>
                <b>Expiry</b>
              </label>
              <DatePicker
                className="form-control"
                selected={new Date()}
                value={expiry && expiry.toLocaleDateString()}
                onChange={(date) => setExpiry(date)}
                required
              />
            </div>

            <Button
              onClick={handleSubmit}
              type="primary"
              className="mb-3"
              block
              shape="round"
              size="large"
              disabled={
                name.length < 2 || discount === "" || expiry === "" || loading
              }
              style={{ marginTop: "30px", width: "150px" }}
            >
              Save
            </Button>
          </form>

          <hr />
          <h4 style={{ margin: "20px 0" }}>Existing Coupons</h4>
          <LocalSearch
            keyword={keyword}
            setKeyword={setKeyword}
            placeholder="Search coupon"
          />

          {loading && (
            <h4 style={{ margin: "20px 0" }}>
              <LoadingOutlined />
            </h4>
          )}

          <table className="table table-bordered">
            <thead className="thead-light">
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Expiry</th>
                <th scope="col">Discount</th>
                <th scope="col">Action</th>
              </tr>

              {coupon.coupons &&
                coupon.coupons.filter(searched(keyword)).map((coupon) => (
                  <tr key={coupon._id}>
                    <td>{coupon.name}</td>
                    <td>{new Date(coupon.expiry).toLocaleDateString()}</td>
                    <td>{coupon.discount}%</td>
                    <td>
                      <span
                        onClick={() => handleRemove(coupon._id, coupon.name)}
                        className="btn btn-sm float-right"
                      >
                        <DeleteOutlined className="text-danger" />
                      </span>
                    </td>
                  </tr>
                ))}
            </thead>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CreateCoupon;
