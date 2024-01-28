import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import Login from "../Pages/LoginAndRegister/Login/Login";
import Register from "../Pages/LoginAndRegister/Register/Register";
import Home from "../Pages/Home/Home/Home";
import Products from "../Pages/Products/Products/Products";
import NotFound from "../Pages/NotFound/NotFound";
import Profile from "../Pages/Dashboard/Profile/Profile";
import DashboardLayout from "../Layout/DashboardLayout";
import PrivateRouter from "./PrivateRouter";
import AdminRouter from "./AdminRouter";
import AllBuyer from "../Pages/Dashboard/Admin/AllBuyer/AllBuyer";
import AllSeller from "../Pages/Dashboard/Admin/AllSeller/AllSeller";
import AllAdmin from "../Pages/Dashboard/Admin/AllAdmin/AllAdmin";
import ReportedProduct from "../Pages/Dashboard/Admin/SalesReport/SalesReport";
import MyOrder from "../Pages/Dashboard/Buyer/MyOrder/MyOrder";
import MyCart from "../Pages/Dashboard/Buyer/MyCart/MyCart";
import OrderHistory from "../Pages/Dashboard/Buyer/OrderHistory/OrderHistory";
import MyReview from "../Pages/Dashboard/Buyer/MyReview/MyReview";
import SellerRouter from "./SellerRouter";
import MyProduct from "../Pages/Dashboard/Seller/MyProduct/MyProduct";
import OrderedProduct from "../Pages/Dashboard/Seller/OrderedProduct/OrderedProduct";
import AddProduct from "../Pages/Dashboard/Seller/AddProduct/AddProduct";
import SellReport from "../Pages/Dashboard/Seller/SellReport/SellReport";
import ShopByCategory from "../Pages/ShopByCategory/ShopByCategory";
import SalesReport from "../Pages/Dashboard/Admin/SalesReport/SalesReport";
import ProductDetails from "../Pages/Products/ProductDetailsPage/ProductDetails";
import Order from "../Pages/Dashboard/DeliveryMan/Order/Order";
import DeliveryManRouter from "./DeliveryManRouter";
import History from "../Pages/Dashboard/DeliveryMan/History/History";






const router = createBrowserRouter([
  {
    path: "/",
    element: <Main/>,
    children: [
      
     
      {
        path: '/',
        element: <Home/>
      },
      {
        path: '/login',
        element: <Login/>
      },
      {
        path: '/register',
        element: <Register/>
      },
      {
        path: '/products',
        element: <Products/>
      },
      {
        path: "/category/:id",
        element: <ShopByCategory/>,
        loader: ({ params }) =>
          fetch(
            `https://craft-hub-mamun.vercel.app/category/${params.id}`
          ),
      },
      {
        path: "/product-details/:id",
        element: <ProductDetails/>,
        loader: ({ params }) =>
          fetch(
            `https://craft-hub-mamun.vercel.app/product/${params.id}`
          ),
      },

    ],
  }, {
    path: "/dashboard",
    element: (
        <PrivateRouter>
          <DashboardLayout></DashboardLayout>
        </PrivateRouter>
    ),

    children: [
      {
        path: "/dashboard/profile",
        element: (
            <Profile></Profile>
        ),
      },
      {
        path: '/dashboard/all-buyer',
        element: <AdminRouter>
          <AllBuyer/>
        </AdminRouter>
      },
      {
        path: '/dashboard/all-seller',
        element: <AdminRouter><AllSeller/></AdminRouter>
      },
      {
        path: '/dashboard/all-admin',
        element: <AdminRouter><AllAdmin/></AdminRouter>
      },
      {
        path: '/dashboard/sales-report',
        element: <AdminRouter><SalesReport/></AdminRouter>
      },
      {
        path: '/dashboard/my-product',
        element: <SellerRouter><MyProduct/></SellerRouter>
      },
      {
        path: '/dashboard/ordered-product',
        element: <SellerRouter><OrderedProduct/></SellerRouter>
      },
      {
        path: '/dashboard/add-product',
        element: <SellerRouter><AddProduct/></SellerRouter>
      },
      {
        path: '/dashboard/sell-report',
        element: <SellerRouter><SellReport/></SellerRouter>
      },
      {
        path: '/dashboard/delivery-order',
        element: <DeliveryManRouter><Order/></DeliveryManRouter> 
      },
      {
        path: '/dashboard/delivery-history',
        element: <DeliveryManRouter><History/></DeliveryManRouter> 
      },
      {
        path: '/dashboard/my-order',
        element: <MyOrder/>
      },
      {
        path: '/dashboard/my-cart',
        element: <MyCart/>
      },
      {
        path: '/dashboard/order-history',
        element: <OrderHistory/>
      },
      {
        path: '/dashboard/my-review',
        element: <MyReview/>
      },
    
    
    ],
  },
  {
    path: "*",
    element: <NotFound></NotFound>,
  },
 
]);
export default router;