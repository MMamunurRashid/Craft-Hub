import { useQuery } from '@tanstack/react-query';
import React, { useContext } from 'react';
import { AuthContext } from '../../../../Contexts/AuthProvider';

const OrderedProduct = () => {
    const { user } = useContext(AuthContext);
    const {
        data: products = [],
        refetch,
        isLoading,
      } = useQuery({
        queryKey: ["products"],
        queryFn: async () => {
          const res = await fetch(
            `http://localhost:5000/product-order?email=${user?.email}`,
            {
              headers: {
                authorization: `bearer ${localStorage.getItem("accessToken")}`,
              },
            }
          );
          const data = await res.json();
          console.log(data);
          return data;
        },
      });
    return (
        <div>
            OrderedProduct
        </div>
    );
};

export default OrderedProduct;