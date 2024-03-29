import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { MdDeleteForever  } from "react-icons/md";
import {  RiMailAddLine } from "react-icons/ri";
import { Link } from 'react-router-dom';
import { BounceLoader } from "react-spinners";

const AllAdmin = () => {
    const {
        data: admin = [],
        refetch,
        isLoading,
      } = useQuery({
        queryKey: ["admin"],
        queryFn: async () => {
          const res = await fetch("https://craft-hub-mamun.vercel.app/admin", {
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
              <th>Delete Admin</th>
            </tr>
          </thead>
          <tbody >
            {admin?.map((ad, idx) => (
              <tr key={ad.id}>
                <th>{idx + 1}</th>
                <td>
                  <div className="avatar">
                    <div className="rounded w-24 h-24">
                      <img src={ad.userPhoto} alt="" />
                    </div>
                  </div>
                </td>
                <td>{ad.name}</td>
                <td>{ad.email}</td>
                <td>{ad.mobileNumber}</td>
                <td>
                  <Link className='tooltip' data-tip="Give a Mail" >
                    <RiMailAddLine className="w-7 h-7 text-yellow-500"/>
                  </Link>
                </td>

                <td>
                  <button className='tooltip' data-tip="Delete Admin" >
                    <MdDeleteForever 
                      className="w-9 h-9 text-red-600"
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

export default AllAdmin;