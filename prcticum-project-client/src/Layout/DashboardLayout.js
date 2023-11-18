import React from 'react';
import Navbar from '../Shared/Navbar/Navbar';
import Footer from '../Shared/Footer/Footer';
import Sidebar from '../Shared/Sidebar/Sidebar'
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
    return (
        <div>
            <Navbar/>
            <div className='flex'>
                <div className='w-1/6 bg-slate-300'>
                <Sidebar/>
                </div>
                <div className='w-5/6 mt-20'>
                <Outlet/>
                </div>
            </div>
            <Footer/>

        </div>
    );
};

export default DashboardLayout;