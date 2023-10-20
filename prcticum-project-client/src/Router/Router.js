import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import Login from "../Pages/LoginAndRegister/Login/Login";
import Register from "../Pages/LoginAndRegister/Register/Register";
import Home from "../Pages/Home/Home/Home";





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
      
      
    ],
  },
 
]);
export default router;