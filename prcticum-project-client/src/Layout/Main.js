import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Shared/Navbar/Navbar';

const Main = () => {
    return (
        <div className=''>
            <Navbar/>
            <div className='pt-20'>
            <Outlet></Outlet>
            </div>
         
        </div>
    );
};

export default Main;