import { RouterProvider } from "react-router-dom";


import { Toaster } from "react-hot-toast";
import router from "./Router/Router";


function App() {

  return (
    <div className=" max-w-[1440px] mx-auto bg-slate-100 ">
 
        <RouterProvider router={router}></RouterProvider>
        <Toaster />
    </div>
  );
}

export default App;
