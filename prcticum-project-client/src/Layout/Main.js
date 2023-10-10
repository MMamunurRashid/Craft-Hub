import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Shared/Sidebar/Sidebar'

const Main = () => {
    return (
        <div className='flex'>
            <Sidebar/>
            <Outlet></Outlet>
         
        </div>
    );
};

export default Main;