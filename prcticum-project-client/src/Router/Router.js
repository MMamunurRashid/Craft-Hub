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
import AllBuyer from "../Pages/Dashboard/Admin/AllBuyer/AllBuyer";
import AllSeller from "../Pages/Dashboard/Admin/AllSeller/AllSeller";
import AllAdmin from "../Pages/Dashboard/Admin/AllAdmin/AllAdmin";
import ReportedProduct from "../Pages/Dashboard/Admin/ReportedProduct/ReportedProduct";






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
        element: <AllBuyer/>
      },
      {
        path: '/dashboard/all-seller',
        element: <AllSeller/>
      },
      {
        path: '/dashboard/all-admin',
        element: <AllAdmin/>
      },
      {
        path: '/dashboard/reported-product',
        element: <ReportedProduct/>
      },
    
    
    ],
  },
  {
    path: "*",
    element: <NotFound></NotFound>,
  },
 
]);
export default router;