import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Shared/Navbar/Navbar';
import Footer from '../Shared/Footer/Footer';

const Main = () => {
    return (
        <div className=''>
            <Navbar/>
            <div className='pt-28'>
            <Outlet></Outlet>
            </div>
            <Footer/>
         
        </div>
    );
};

export default Main;