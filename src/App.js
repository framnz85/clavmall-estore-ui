import React, { useEffect, useState, lazy, Suspense } from "react";
import { Switch, Route } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { LoadingOutlined } from "@ant-design/icons";

import { getEstoreInfo } from "./functions/estore";
import { auth } from "./pages/firebase";
import { currentUser } from "./functions/auth";

import "react-toastify/dist/ReactToastify.css";
import "bootstrap-material-design/dist/css/bootstrap-material-design.min.css";

// import Home from "./pages/Home";
// import Product from "./pages/Product";
// import CategoryHome from "./pages/category/CategoryHome";
// import SubcatHome from "./pages/subcat/SubcatHome";
// import ParentHome from "./pages/parent/ParentHome";
// import Shop from "./pages/Shop";
// import Cart from "./pages/Cart";
// import Checkout from "./pages/Checkout";
// import Payment from "./pages/Payment";

// import History from "./pages/user/History";
// import UserOrder from "./pages/user/UserOrder";
// import Password from "./pages/user/Password";
// import Wishlist from "./pages/user/Wishlist";

// import Login from "./pages/auth/Login";
// import Register from "./pages/auth/Register";
// import RegisterComplete from "./pages/auth/RegisterComplete";
// import ForgotPassword from "./pages/auth/ForgotPassword";

// import Header from "./components/nav/Header";
// import UserRoute from "./components/routes/UserRoute";
// import AdminRoute from "./components/routes/AdminRoute";
// import SideDrawer from "./components/drawer/SideDrawer";

// import Dashboard from "./pages/admin/dashboard/Dashboard";
// import AdminOrder from "./pages/admin/dashboard/AdminOrder";
// import CategoryCreate from "./pages/admin/category/CategoryCreate";
// import CategoryUpdate from "./pages/admin/category/CategoryUpdate";
// import SubcatCreate from "./pages/admin/subcat/SubcatCreate";
// import SubcatUpdate from "./pages/admin/subcat/SubcatUpdate";
// import ParentCreate from "./pages/admin/parent/ParentCreate";
// import ParentUpdate from "./pages/admin/parent/ParentUpdate";
// import ProductCreate from "./pages/admin/product/ProductCreate";
// import ProductUpdate from "./pages/admin/product/ProductUpdate";
// import AllProducts from "./pages/admin/product/AllProducts";
// import LocationCreate from "./pages/admin/location/LocationCreate";
// import LocationUpdate from "./pages/admin/location/LocationUpdate";
// import PaymentOption from "./pages/admin/payment/PaymentOption";
// import CreateCouponPage from "./pages/admin/coupon/CreateCoupon";
// import ManageHome from "./pages/admin/carousel/ManageHome";

const Home = lazy(() => import("./pages/Home"));
const Product = lazy(() => import("./pages/Product"));
const CategoryHome = lazy(() => import("./pages/category/CategoryHome"));
const SubcatHome = lazy(() => import("./pages/subcat/SubcatHome"));
const ParentHome = lazy(() => import("./pages/parent/ParentHome"));
const Shop = lazy(() => import("./pages/Shop"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Payment = lazy(() => import("./pages/Payment"));

const History = lazy(() => import("./pages/user/History"));
const UserOrder = lazy(() => import("./pages/user/UserOrder"));
const Password = lazy(() => import("./pages/user/Password"));
const Wishlist = lazy(() => import("./pages/user/Wishlist"));

const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const RegisterComplete = lazy(() => import("./pages/auth/RegisterComplete"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));

const Header = lazy(() => import("./components/nav/Header"));
const UserRoute = lazy(() => import("./components/routes/UserRoute"));
const AdminRoute = lazy(() => import("./components/routes/AdminRoute"));
const SideDrawer = lazy(() => import("./components/drawer/SideDrawer"));

const Dashboard = lazy(() => import("./pages/admin/dashboard/Dashboard"));
const AdminOrder = lazy(() => import("./pages/admin/dashboard/AdminOrder"));
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
const PaymentOption = lazy(() => import("./pages/admin/payment/PaymentOption"));
const CreateCouponPage = lazy(() =>
  import("./pages/admin/coupon/CreateCoupon")
);
const ManageHome = lazy(() => import("./pages/admin/carousel/ManageHome"));

const App = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== undefined) {
      if (!localStorage.getItem("estore")) {
        setLoading(true);
        getEstoreInfo(process.env.REACT_APP_ESTORE_ID).then((estore) => {
          dispatch({
            type: "ESTORE_INFO",
            payload: {
              ...estore.data[0],
            },
          });
          localStorage.setItem("estore", JSON.stringify(estore.data[0]));
          setLoading(false);
        });
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const usubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();

        currentUser(idTokenResult.token)
          .then((res) => {
            dispatch({
              type: "LOGGED_IN_USER",
              payload: {
                _id: res.data._id,
                name: res.data.name,
                email: res.data.email,
                role: res.data.role,
                address: res.data.address,
                token: idTokenResult.token,
                wishlist: res.data.wishlist,
              },
            });
          })
          .catch((error) => {
            toast.error(error.message);
          });
      }
    });

    return () => usubscribe();
  });

  return (
    <Suspense
      fallback={
        <div className="col text-center p-5">
          __ Preparing the ST
          <LoadingOutlined />
          RE. Kindly wait... __
        </div>
      }
    >
      <Header />
      <SideDrawer />
      <ToastContainer />
      <Switch>
        <Route
          exact
          path="/"
          render={(props) => <Home {...props} loading={loading} />}
        />
        <Route exact path="/product/:slug" component={Product} />
        <Route exact path="/category/:slug" component={CategoryHome} />
        <Route exact path="/subcats/:slug" component={SubcatHome} />
        <Route exact path="/parent/:slug" component={ParentHome} />
        <Route exact path="/shop" component={Shop} />
        <Route exact path="/cart" component={Cart} />

        <UserRoute exact path="/checkout" component={Checkout} />
        <UserRoute exact path="/payment" component={Payment} />

        <UserRoute exact path="/user/history" component={History} />
        <UserRoute exact path="/user/order/:orderid" component={UserOrder} />
        <UserRoute exact path="/user/password" component={Password} />
        <UserRoute exact path="/user/wishlist" component={Wishlist} />

        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/register/complete" component={RegisterComplete} />
        <Route exact path="/forgot/password" component={ForgotPassword} />

        <AdminRoute exact path="/admin/dashboard" component={Dashboard} />
        <AdminRoute exact path="/admin/order/:orderid" component={AdminOrder} />
        <AdminRoute exact path="/admin/category" component={CategoryCreate} />
        <AdminRoute
          exact
          path="/admin/category/:slug"
          component={CategoryUpdate}
        />
        <AdminRoute exact path="/admin/subcat" component={SubcatCreate} />
        <AdminRoute exact path="/admin/subcat/:slug" component={SubcatUpdate} />
        <AdminRoute exact path="/admin/parent" component={ParentCreate} />
        <AdminRoute exact path="/admin/parent/:slug" component={ParentUpdate} />
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
        <AdminRoute exact path="/admin/payment" component={PaymentOption} />
        <AdminRoute exact path="/admin/coupon" component={CreateCouponPage} />
        <AdminRoute exact path="/admin/managehome" component={ManageHome} />
      </Switch>
    </Suspense>
  );
};

export default App;
