import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserNav from "../../components/nav/UserNav";
import { getWishlist, removeWishlist } from "../../functions/user";
import { LoadingOutlined } from "@ant-design/icons";
import AdminProductCard from "../../components/cards/AdminProductCard";

const Wishlist = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadWishlist();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadWishlist = () => {
    if (!user.wishlist) {
      setLoading(true);
      getWishlist(user.token).then((res) => {
        dispatch({
          type: "USER_WISHLIST",
          payload: { ...user, wishlist: res.data.wishlist },
        });
        setLoading(false);
      });
    }
  };

  const handleRemove = (productId) => {
    removeWishlist(productId, user.token).then((res) => {
      const newWishlist =
        user.wishlist &&
        user.wishlist.filter((product) => product._id !== productId);

      dispatch({
        type: "USER_WISHLIST",
        payload: { ...user, wishlist: newWishlist },
      });
    });
  };

  return (
    <div className="container">
      <div className="row pb-5">
        <div className="col-m-2">
          <UserNav />
        </div>
        <div className="col">
          <h4 style={{ margin: "20px 0" }}>
            {loading ? <LoadingOutlined /> : "Wishlist"}
          </h4>
          <div className="row">
            {user.wishlist &&
              user.wishlist.map((product) => (
                <div
                  key={product._id}
                  className="col-m-2"
                  style={{ margin: "0 10px 10px 0" }}
                >
                  <AdminProductCard
                    product={product}
                    handleRemove={handleRemove}
                    canEdit={false}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
