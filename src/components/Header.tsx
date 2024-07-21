import React from 'react';
import Sidebar from './Sidebar';

const Header = () => {

    return (
        <div className='flex space-x-2 fixed w-full justify-between items-center h-[50px] bg-transparent backdrop-filter backdrop-blur-lg border-b border-gray-800 dark:border-gray-400 px-2 py-1 z-10'>
            {/* Sidebar on the far left */}
            <Sidebar />

            {/* Centered Name */}
            <div className='flex items-center justify-center flex-grow text-2xl font-bold
             text-yellow-400 dark:text-yellow-300 -ml-8'>
                MEMO-ry
            </div>
        </div>
    );
};

export default Header;
