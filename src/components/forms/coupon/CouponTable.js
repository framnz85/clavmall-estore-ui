import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Pagination, Switch  } from "antd";
import { toast } from "react-toastify";
import {
    DeleteOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";
import TableHeader from "../../common/table/TableHeader";
import TableBody from "../../common/table/TableBody";
import InputSearch from "../../common/form/InputSearch";
import { getCoupon, removeCoupon, updateCoupon } from "../../../functions/coupon";

const { confirm } = Modal;

const CouponTable = ({ values, setValues, setLoading }) => {
    let dispatch = useDispatch();
    const { coupons, itemsCount, pageSize, currentPage, sortkey, sort } =
        values;

    const { user, admin } = useSelector((state) => ({ ...state }));

    const [keyword, setKeyword] = useState("");

    const columns = [
        {
            key: "number",
            label: "#",
            index: true,
        },
        {
            key: "name",
            path: "name",
            label: "Name",
            content: (coupon) => coupon.name,
        },
        {
            key: "code",
            path: "code",
            label: "Code",
            content: (coupon) => coupon.code,
        },
        {
            key: "expiry",
            path: "expiry",
            label: "Expiry",
            content: (coupon) => new Date(coupon.expiry).toLocaleString(),
        },
        {
            key: "discount",
            path: "discount",
            label: "Discount",
            content: (coupon) => coupon.discount + "%",
        },
        {
            key: "disabled",
            label: "Activate",
            content: (coupon) => <Switch checked={coupon.activate} onChange={(e) => handleActive(e, coupon._id)} />,
        },
        {
            key: "action",
            content: (coupon) => {
                return (
                    <span
                        onClick={() => handleRemove(coupon._id, coupon.name)}
                        className="btn btn-sm float-right"
                    >
                        <DeleteOutlined className="text-danger" />
                    </span>
                );
            },
        },
    ];

    useEffect(() => {
        loadCoupons();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const loadCoupons = () => {
        if (admin.coupons) {
            setValues({
                ...values,
                coupons: admin.coupons,
            })
        } else {
            setLoading(true);
            getCoupon().then((coupon) => {
                setValues({
                    ...values,
                    coupons: coupon.data,
                })
                dispatch({
                    type: "ADMIN_OBJECT_I",
                    payload: { coupons: coupon.data },
                });
                setLoading(false);
            });
        }
    };

    const handleActive = (value, couponId) => {
        updateCoupon(couponId, value, user.token).then(() => {
            const newCoupons = coupons.map((coupon) =>
                coupon._id === couponId
                    ? { ...coupon, activate: value }
                    : coupon
            );
            setValues({
                ...values,
                coupons: newCoupons,
            });
            dispatch({
              type: "ADMIN_OBJECT_I",
              payload: { coupons: newCoupons },
            });
        })
    }

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
                        const result = admin.coupons.filter(
                            (coupon) => coupon._id !== couponId
                        );
                        setValues({
                            ...values,
                            coupons: result,
                        })
                        dispatch({
                            type: "ADMIN_OBJECT_I",
                            payload: { coupons: [...result] },
                        });
                        setLoading(false);
                        toast.error(`"${res.data.name}" deleted.`);
                    })
                    .catch((error) => {
                        if (error.response.status === 400) toast.error(error.response.data);
                        else toast.error(error.message);
                        setLoading(false);
                    });
            },
            onCancel() { },
        });
    };

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

    const searched = (keyword) => (coupon) =>
        coupon.name.toLowerCase().includes(keyword);

    return (
        <div>
            <InputSearch
                keyword={keyword}
                setKeyword={setKeyword}
                placeholder="Search payment"
                data={values}
                setData={setValues}
            />
            <table className="table">
                <TableHeader columns={columns} onSort={handleSort} sort={sort} />
                <TableBody
                    columns={columns}
                    data={
                        coupons && coupons
                            .filter(searched(keyword))
                            .sort((a, b) =>
                                a[sortkey] > b[sortkey]
                                    ? sort
                                    : b[sortkey] > a[sortkey]
                                        ? -sort
                                        : 0
                            )
                            .slice(currentPage * pageSize - pageSize, currentPage * pageSize)
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

export default CouponTable;
