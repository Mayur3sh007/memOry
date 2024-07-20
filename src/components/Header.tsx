import React from 'react';
import Sidebar from './Sidebar';
import { ModeToggle } from './theme-switch';
import AccountInfo from './AccountInfo';

const Header = () => {

    return (
        <div className='flex fixed min-w-full items-center h-[50px] space-x-4 bg-transparent backdrop-filter backdrop-blur-lg border-b border-gray-800 dark:border-gray-400 px-2 py-1 z-10'>
            {/* Sidebar on the far left */}
            <div className=' ml-4 mt-1 hidden max-md:flex md:flex'>
                <Sidebar />
            </div>


            {/* Content on the far right */}
            <div className='flex flex-grow justify-between items-center mr-2 dark:text-yellow-400 hover:text-yellow-400'>
                <div className='lg:-ml-8'>
                    <ModeToggle />
                </div>
                {/* Website Name */}
                <div className='flex items-center justify-center space-x-2 mr-10 text-2xl font-bold text-yellow-400 dark:yellow-300 lg:ml-8'>
                    <a href="/">MEMO-ry</a>
                </div>
                <AccountInfo />
            </div>
        </div>
    );
};

export default Header;
