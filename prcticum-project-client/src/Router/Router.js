import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import Login from "../Pages/LoginAndRegister/Login/Login";
import Register from "../Pages/LoginAndRegister/Register/Register";





const router = createBrowserRouter([
  {
    path: "/",
    element: <Main/>,
    children: [
      
     
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