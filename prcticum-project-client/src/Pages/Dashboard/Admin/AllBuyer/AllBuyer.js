import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { TbListDetails } from "react-icons/tb";
import {  RiMailAddLine } from "react-icons/ri";
import { Link } from 'react-router-dom';
import { BounceLoader } from "react-spinners";

const AllBuyer = () => {
    const {
        data: buyers = [],
        refetch,
        isLoading,
      } = useQuery({
        queryKey: ["buyer"],
        queryFn: async () => {
          const res = await fetch("https://craft-hub-mamun.vercel.app/buyer", {
            headers: {
              authorization: `bearer ${localStorage.getItem("accessToken")}`,
            },
          });
          const data = await res.json();
          console.log(data);
          return data;
        },
      });
           // if loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
          <BounceLoader
            color="#d63636"
            cssOverride={{}}
            loading
            size={150}
            speedMultiplier={1}
          />
        </div>
    );
  }
    return (
        <div>
           <table className="table px-2 py-1 text-[16px] table-pin-rows table-pin-cols ">
          <thead>
            <tr>
              <th></th>
              <th>Photo</th>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile Number</th>
              <th>Give a Mail</th>
              <th>Buyer Details</th>
            </tr>
          </thead>
          <tbody >
            {buyers?.map((buyer, idx) => (
              <tr key={buyer.id}>
                <th>{idx + 1}</th>
                <td>
                  <div className="avatar">
                    <div className="rounded w-24 h-24">
                      <img src={buyer.userPhoto} alt="" />
                    </div>
                  </div>
                </td>
                <td>{buyer.name}</td>
                <td>{buyer.email}</td>
                <td>{buyer.mobileNumber}</td>
                <td>
                  <Link className='tooltip' data-tip="Give a Mail" to={`mailto:${buyer.email}`} >
                    <RiMailAddLine className="w-7 h-7 text-yellow-500"/>
                  </Link>
                </td>

                <td>
                  <button className='tooltip' data-tip="Buyer Details" >
                    <TbListDetails
                      className="w-7 h-7 text-red-600"
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
    );
};

export default AllBuyer;