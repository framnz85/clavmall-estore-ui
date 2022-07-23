import React, { useEffect, lazy, Suspense } from "react";
import { Switch, Route } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { LoadingOutlined } from "@ant-design/icons";

import { getEstoreInfo, getEstoreChanges } from "./functions/estore";
import { auth } from "./functions/firebase";
import { currentUser } from "./functions/auth";

import "react-toastify/dist/ReactToastify.css";
import "bootstrap-material-design/dist/css/bootstrap-material-design.min.css";

import Header from "./components/nav/Header";
import TabBottom from "./components/nav/TabBottom";

const Home = lazy(() => import("./pages/Home"));
const Product = lazy(() => import("./pages/product/Product"));
const CategoryHome = lazy(() => import("./pages/category/CategoryHome"));
const SubcatHome = lazy(() => import("./pages/subcat/SubcatHome"));
const ParentHome = lazy(() => import("./pages/parent/ParentHome"));
const Shop = lazy(() => import("./pages/shop/Shop"));
const Cart = lazy(() => import("./pages/checkout/Cart"));
const Checkout = lazy(() => import("./pages/checkout/Checkout"));
const Payment = lazy(() => import("./pages/checkout/Payment"));

const OrderHistory = lazy(() => import("./pages/user/OrderHistory"));
const OrderUserDetails = lazy(() => import("./pages/user/OrderUserDetails"));
const Account = lazy(() => import("./pages/user/Account"));
const Wishlist = lazy(() => import("./pages/user/Wishlist"));

const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const RegisterComplete = lazy(() => import("./pages/auth/RegisterComplete"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));

const UserRoute = lazy(() => import("./components/routes/UserRoute"));
const AdminRoute = lazy(() => import("./components/routes/AdminRoute"));

const Dashboard = lazy(() => import("./pages/admin/dashboard/Dashboard"));
const OrderDetails = lazy(() => import("./pages/admin/dashboard/OrderDetails"));
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

const App = () => {
  let dispatch = useDispatch();

  let { user: userExist } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadEstoreInfo();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

          document.title = estore.data[0].name
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
            localStorage.setItem("locationChange", estore.data[0].locationChange);
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

        document.title = JSON.parse(localStorage.getItem("estore")).name
      }
    }
  };

  useEffect(() => {
    const usubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        currentUser(idTokenResult.token)
          .then((res) => {
            dispatch({
              type: "LOGGED_IN_USER_I",
              payload: {
                _id: res.data._id,
                name: res.data.name,
                email: res.data.email,
                role: res.data.role,
                address: userExist.address
                  ? {
                    ...userExist.address,
                    details: res.data.address.details
                  }
                  : res.data.address,
                homeAddress: res.data.homeAddress,
                token: idTokenResult.token,
                wishlist: res.data.wishlist,
              },
            });
            dispatch({
              type: "ESTORE_INFO_I",
              payload: {
                userAddress: userExist.address
                  ? { ...userExist.address, details: res.data.address.details }
                  : res.data.address
              },
            });
          })
          .catch((error) => {
            toast.error(error.message);
          });
      }
    });

    return () => usubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Header />
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
          <Route exact path="/category/:slug" component={CategoryHome} />
          <Route exact path="/subcats/:slug" component={SubcatHome} />
          <Route exact path="/parent/:slug" component={ParentHome} />
          <Route exact path="/shop" component={Shop} />
          <Route exact path="/cart" component={Cart} />

          <UserRoute exact path="/checkout" component={Checkout} />
          <UserRoute exact path="/payment" component={Payment} />

          <UserRoute exact path="/user/orders" component={OrderHistory} />
          <UserRoute exact path="/user/order/:orderid" component={OrderUserDetails} />
          <UserRoute exact path="/user/account" component={Account} />
          <UserRoute exact path="/user/wishlist" component={Wishlist} />

          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/register/complete" component={RegisterComplete} />
          <Route exact path="/forgot/password" component={ForgotPassword} />

          <AdminRoute exact path="/admin/dashboard" component={Dashboard} />
          <AdminRoute
            exact
            path="/admin/order/:orderid"
            component={OrderDetails}
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
            path="/admin/subcat/:slug"
            component={SubcatUpdate}
          />
          <AdminRoute exact path="/admin/parent" component={ParentCreate} />
          <AdminRoute
            exact
            path="/admin/parent/:slug"
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
        </Switch>
      </Suspense>
      <TabBottom />
    </>
  );
};

export default App;
