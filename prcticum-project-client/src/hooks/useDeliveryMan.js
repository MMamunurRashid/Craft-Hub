import { useEffect, useState } from "react";

const useDeliveryMan = (email) => {
  const [isDeliveryMan, setIsDeliveryMan] = useState(false);
  const [isDeliveryManLoading, setIsDeliveryManLoading] = useState(true);
  useEffect(() => {
    if (email) {
      fetch(`https://craft-hub-mamun.vercel.app/users/delivery-man/${email}`)
        .then((res) => res.json())
        .then((data) => {
          //console.log(data);
          setIsDeliveryMan(data.isDeliveryMan);
          setIsDeliveryManLoading(false);
        });
    }
  }, [email]);
  return [isDeliveryMan, isDeliveryManLoading];
};

export default useDeliveryMan;