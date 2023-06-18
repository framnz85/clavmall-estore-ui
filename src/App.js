import React, { useEffect, lazy, Suspense } from "react";
import { Switch, Route } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { LoadingOutlined } from "@ant-design/icons";

import { getEstoreInfo, getEstoreChanges } from "./functions/estore";
import { currentUser } from "./functions/auth";

import "react-toastify/dist/ReactToastify.css";
import "bootstrap-material-design/dist/css/bootstrap-material-design.min.css";

import Header from "./components/nav/Header";
import TabBottom from "./components/nav/TabBottom";
import ChatComponent from "./chat/ChatComponent";

const Home = lazy(() => import("./pages/Home"));
const Product = lazy(() => import("./pages/product/Product"));
const Shop = lazy(() => import("./pages/shop/Shop"));
const Cart = lazy(() => import("./pages/checkout/Cart"));
const Checkout = lazy(() => import("./pages/checkout/Checkout"));
const Payment = lazy(() => import("./pages/checkout/Payment"));

const OrderHistory = lazy(() => import("./pages/user/OrderHistory"));
const OrderUserDetails = lazy(() => import("./pages/user/OrderUserDetails"));
const Account = lazy(() => import("./pages/user/Account"));
const Wishlist = lazy(() => import("./pages/user/Wishlist"));
const Referral = lazy(() => import("./pages/user/Referral"));

const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const Guide1 = lazy(() => import("./pages/guide/Guide1"));
const Guide2 = lazy(() => import("./pages/guide/Guide2"));
const Guide3 = lazy(() => import("./pages/guide/Guide3"));
const Guide4 = lazy(() => import("./pages/guide/Guide4"));
const Guide5 = lazy(() => import("./pages/guide/Guide5"));
const Guide6 = lazy(() => import("./pages/guide/Guide6"));
const Guide7 = lazy(() => import("./pages/guide/Guide7"));
const Guide8 = lazy(() => import("./pages/guide/Guide8"));
const Guide10 = lazy(() => import("./pages/guide/Guide10"));
const Guide11 = lazy(() => import("./pages/guide/Guide11"));

const UserRoute = lazy(() => import("./components/routes/UserRoute"));
const AdminRoute = lazy(() => import("./components/routes/AdminRoute"));
const AddressRoute = lazy(() => import("./components/routes/AddressRoute"));

const Dashboard = lazy(() => import("./pages/admin/dashboard/Dashboard"));
const OrderDetails = lazy(() => import("./pages/admin/dashboard/OrderDetails"));
const AddToCartDetails = lazy(() =>
  import("./pages/admin/dashboard/AddToCartDetails")
);
const CategoryCreate = lazy(() =>
  import("./pages/admin/category/CategoryCreate")
);
const CategoryUpdate = lazy(() =>
  import("./pages/admin/category/CategoryUpdate")
);
const SubcatCreate = lazy(() => import("./pages/admin/subcat/SubcatCreate"));
const SubcatUpdate = lazy(() => import("./pages/admin/subcat/SubcatUpdate"));
const ParentCreate = lazy(() => import("./pages/admin/parent/ParentCreate"));
const ParentUpdate = lazy(() => import("./pages/admin/parent/ParentUpdate"));
const ProductCreate = lazy(() => import("./pages/admin/product/ProductCreate"));
const ProductUpdate = lazy(() => import("./pages/admin/product/ProductUpdate"));
const AllProducts = lazy(() => import("./pages/admin/product/AllProducts"));
const LocationCreate = lazy(() =>
  import("./pages/admin/location/LocationCreate")
);
const LocationUpdate = lazy(() =>
  import("./pages/admin/location/LocationUpdate")
);
const PaymentCreate = lazy(() => import("./pages/admin/payment/PaymentCreate"));
const PaymentUpdate = lazy(() => import("./pages/admin/payment/PaymentUpdate"));
const CreateCouponPage = lazy(() =>
  import("./pages/admin/coupon/CreateCoupon")
);
const ManageUser = lazy(() => import("./pages/admin/users/ManageUser"));
const ManageHome = lazy(() => import("./pages/admin/carousel/ManageHome"));
const SubscriptionPage = lazy(() =>
  import("./pages/admin/subscription/SubscriptionPage")
);
const AffiliateDash = lazy(() =>
  import("./pages/admin/affiliate/AffiliateDash")
);

const App = () => {
  let dispatch = useDispatch();
  const queryParams = new URLSearchParams(window.location.search);

  let { user: userExist } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadEstoreInfo();
    getReferenceId();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getReferenceId = () => {
    const refid = queryParams.get("refid");
    if (refid && refid.length > 0) {
      localStorage.setItem("refid", refid);
    }
  };

  const loadEstoreInfo = () => {
    if (typeof window !== undefined) {
      if (!localStorage.getItem("estore")) {
        getEstoreInfo(process.env.REACT_APP_ESTORE_ID).then((estore) => {
          dispatch({
            type: "ESTORE_INFO_I",
            payload: estore.data[0],
          });
          localStorage.setItem("categoryChange", estore.data[0].categoryChange);
          localStorage.setItem("parentChange", estore.data[0].parentChange);
          localStorage.setItem("subcatChange", estore.data[0].subcatChange);
          localStorage.setItem("productChange", estore.data[0].productChange);
          localStorage.setItem("locationChange", estore.data[0].locationChange);
          localStorage.setItem("estoreChange", estore.data[0].estoreChange);

          document.title = estore.data[0].name;
        });
      } else {
        getEstoreChanges(process.env.REACT_APP_ESTORE_ID).then((estore) => {
          dispatch({
            type: "ESTORE_INFO_I",
            payload: estore.data[0],
          });
          const categoryChange = localStorage.getItem("categoryChange");
          const parentChange = localStorage.getItem("parentChange");
          const subcatChange = localStorage.getItem("subcatChange");
          const productChange = localStorage.getItem("productChange");
          const locationChange = localStorage.getItem("locationChange");
          const estoreChange = localStorage.getItem("estoreChange");
          if (Number(categoryChange) !== estore.data[0].categoryChange) {
            dispatch({
              type: "CATEGORY_LIST_II",
              payload: [],
            });
            localStorage.setItem(
              "categoryChange",
              estore.data[0].categoryChange
            );
          }
          if (Number(parentChange) !== estore.data[0].parentChange) {
            dispatch({
              type: "PARENT_LIST_I",
              payload: [],
            });
            localStorage.setItem("parentChange", estore.data[0].parentChange);
          }
          if (Number(subcatChange) !== estore.data[0].subcatChange) {
            dispatch({
              type: "SUBCAT_LIST_I",
              payload: [],
            });
            localStorage.setItem("subcatChange", estore.data[0].subcatChange);
          }
          if (Number(productChange) !== estore.data[0].productChange) {
            dispatch({
              type: "PRODUCT_LIST_I",
              payload: [],
            });
            localStorage.setItem("productChange", estore.data[0].productChange);
          }
          if (Number(locationChange) !== estore.data[0].locationChange) {
            dispatch({
              type: "LOCATION_LIST_I",
              payload: [],
            });
            localStorage.setItem(
              "locationChange",
              estore.data[0].locationChange
            );
          }
          if (Number(estoreChange) !== estore.data[0].estoreChange) {
            dispatch({
              type: "ESTORE_INFO_I",
              payload: {},
            });
            localStorage.setItem("estoreChange", estore.data[0].estoreChange);
            loadEstoreInfo();
          }
        });

        document.title = JSON.parse(localStorage.getItem("estore")).name;
      }
    }
  };

  const handleCurrentUser = (token) => {
    currentUser(token)
      .then((res) => {
        if (res.data.err) {
          toast.error(res.data.err);
        } else {
          dispatch({
            type: "LOGGED_IN_USER_I",
            payload: {
              _id: res.data._id,
              refid: res.data.refid,
              name: res.data.name,
              phone: res.data.phone,
              email: res.data.email,
              emailConfirm: res.data.emailConfirm,
              role: res.data.role,
              address: res.data.address,
              homeAddress: res.data.homeAddress,
              token,
              wishlist: res.data.wishlist,
              addInstruct: res.data.addInstruct,
            },
          });
          dispatch({
            type: "ESTORE_INFO_I",
            payload: {
              userAddress: userExist.address
                ? { ...userExist.address, details: res.data.address.details }
                : res.data.address,
            },
          });
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  useEffect(() => {
    if (typeof window !== undefined) {
      if (localStorage.getItem("userToken")) {
        const idTokenResult = localStorage.getItem("userToken");
        handleCurrentUser(idTokenResult);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <div id="non-printable" style={{ height: 56 }}>
        <Header />
      </div>
      <Suspense
        fallback={
          <div className="col text-center p-5">
            __ Preparing the ST
            <LoadingOutlined />
            RE. Kindly wait... __
          </div>
        }
      >
        <ToastContainer />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/product/:slug" component={Product} />
          <Route exact path="/category/:slug" component={Shop} />
          <Route exact path="/subcats/:slug" component={Shop} />
          <Route exact path="/parent/:slug" component={Shop} />
          <Route exact path="/shop" component={Shop} />
          <Route exact path="/cart" component={Cart} />

          <AddressRoute exact path="/checkout" component={Checkout} />
          <AddressRoute exact path="/payment" component={Payment} />

          <UserRoute exact path="/user/orders" component={OrderHistory} />
          <UserRoute
            exact
            path="/user/order/:orderid"
            component={OrderUserDetails}
          />
          <UserRoute exact path="/user/account" component={Account} />
          <UserRoute exact path="/user/wishlist" component={Wishlist} />
          <UserRoute exact path="/user/referral" component={Referral} />

          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/forgot/password" component={ForgotPassword} />
          <Route exact path="/admin/guide1" component={Guide1} />
          <Route exact path="/admin/guide2" component={Guide2} />
          <Route exact path="/admin/guide3" component={Guide3} />
          <Route exact path="/admin/guide4" component={Guide4} />
          <Route exact path="/admin/guide5" component={Guide5} />
          <Route exact path="/admin/guide6" component={Guide6} />
          <Route exact path="/admin/guide7" component={Guide7} />
          <Route exact path="/admin/guide8" component={Guide8} />
          <Route exact path="/admin/guide10" component={Guide10} />
          <Route exact path="/admin/guide11" component={Guide11} />

          <AdminRoute exact path="/admin/dashboard" component={Dashboard} />
          <AdminRoute
            exact
            path="/admin/order/:orderid"
            component={OrderDetails}
          />
          <AdminRoute
            exact
            path="/admin/cart/:cartid"
            component={AddToCartDetails}
          />
          <AdminRoute exact path="/admin/category" component={CategoryCreate} />
          <AdminRoute
            exact
            path="/admin/category/:slug"
            component={CategoryUpdate}
          />
          <AdminRoute exact path="/admin/subcat" component={SubcatCreate} />
          <AdminRoute
            exact
            path="/admin/subcat/:parSlug/:slug"
            component={SubcatUpdate}
          />
          <AdminRoute exact path="/admin/parent" component={ParentCreate} />
          <AdminRoute
            exact
            path="/admin/parent/:parSlug/:slug"
            component={ParentUpdate}
          />
          <AdminRoute exact path="/admin/product" component={ProductCreate} />
          <AdminRoute
            exact
            path="/admin/product/:slug"
            component={ProductUpdate}
          />
          <AdminRoute exact path="/admin/products" component={AllProducts} />
          <AdminRoute exact path="/admin/location" component={LocationCreate} />
          <AdminRoute
            exact
            path="/admin/location/:addiv3/:coucode/:currency"
            component={LocationUpdate}
          />
          <AdminRoute exact path="/admin/payment" component={PaymentCreate} />
          <AdminRoute
            exact
            path="/admin/payment/:payid"
            component={PaymentUpdate}
          />
          <AdminRoute exact path="/admin/coupon" component={CreateCouponPage} />
          <AdminRoute exact path="/admin/manageuser" component={ManageUser} />
          <AdminRoute exact path="/admin/managehome" component={ManageHome} />
          <AdminRoute
            exact
            path="/admin/subscription"
            component={SubscriptionPage}
          />
          <AdminRoute exact path="/admin/affiliate" component={AffiliateDash} />
        </Switch>
      </Suspense>
      <TabBottom />
      <ChatComponent />
    </>
  );
};

export default App;
