import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../Contexts/AuthProvider";
import { BounceLoader } from "react-spinners";
import useDeliveryMan from "../hooks/useDeliveryMan";

const DeliveryManRouter = ({ children }) => {
  const { user, loading, logOut } = useContext(AuthContext);
  const [isDeliveryMan, isDeliveryManLoading] = useDeliveryMan(user.email);

  const location = useLocation();

  if (loading || isDeliveryManLoading) {
    return (
      <div>
        <div className="flex justify-center items-center w-full h-screen">
          <BounceLoader
            color="#d63636"
            cssOverride={{}}
            loading
            size={150}
            speedMultiplier={1}
          />
        </div>
      </div>
    );
  }

  if (user && isDeliveryMan) {
    return children;
  }
  logOut();
  return <Navigate to="/login" state={{ from: location }} replace></Navigate>;
};

export default DeliveryManRouter;