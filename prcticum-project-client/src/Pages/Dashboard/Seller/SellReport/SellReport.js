import React, { useContext } from 'react';
import { AuthContext } from '../../../../Contexts/AuthProvider';
import { useQuery } from '@tanstack/react-query';

const SellReport = () => {

    const { user } = useContext(AuthContext);
    const {
      data: sales = [],
      refetch,
      isLoading,
    } = useQuery({
      queryKey: ["sales"],
      queryFn: async () => {
        const res = await fetch(
          `http://localhost:5000/sales-report?email=${user?.email}&option=Today`,
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
            Sell report
        </div>
    );
};

export default SellReport;