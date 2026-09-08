import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import Layout from "../pages/Layout";
import Signup from "../pages/Signup";
import Otp from "../pages/Otp";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import UserProfile from "../pages/Profile";
import Cart from "../components/Cart";
import SellerSignUp from "./../seller-pages/Seller.Signup";
import SellerLogin from "./../seller-pages/Seller.Login";
import Sellerbody from "../seller-pages/Seller.Body";
import SellerDashboard from "../seller-pages/SellerDashboard";
import ProductAddPage from "../seller-pages/Seller.add-product";
import SellerProducts from "../seller-pages/SellerProducts";
import ProductPage from "../pages/ProductPage";
import AddressPage from "../pages/AddressPage";
import Payment from "../pages/Payment";
import OrderHistory from "../pages/OrderHistory";
import OrderDetail from "../pages/OrderDetail";
import SellerOrders from "../seller-pages/New-order";

export const Routers = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/sign-up",
        element: <Signup />,
      },
      {
        path: "/otp",
        element: <Otp />,
      },
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/profile",
        element: <UserProfile />,
      },
      {
        path: "/productpage/:id",
        element: <ProductPage />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/order-history",
        element: <OrderHistory />,
      },
      {
        path: "/address/:id",
        element: <AddressPage />,
      },
      {
        path: "/payment/:id",
        element: <Payment />,
      },
      {
        path: "/order-detail/:id",
        element: <OrderDetail />,
      },
      {
        path: "/seller-signup",
        element: <SellerSignUp />,
      },
      {
        path: "/seller-login",
        element: <SellerLogin />,
      },
      {
        path: "/seller",
        element: <Sellerbody />,
      },
      {
        path: "/seller/orders/:id",
        element: <SellerOrders />,
      },
      {
        path: "/seller-dashboard/:id",
        element: <SellerDashboard />,
      },
      {
        path: "/add-product/:id",
        element: <ProductAddPage />,
      },
      {
        path: "/my-products/:id",
        element: <SellerProducts />,
      },
    ],
  },
]);
