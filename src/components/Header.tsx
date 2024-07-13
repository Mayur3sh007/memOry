import React from 'react';
import Sidebar from './Sidebar';
import { ModeToggle } from './theme-switch';
import AccountInfo from './AccountInfo';

const Header = () => {

    return (
        <div className='flex fixed min-w-full items-center h-[50px] space-x-4 bg-transparent backdrop-filter backdrop-blur-lg'>
            {/* Sidebar on the far left */}
            <div className=' ml-4 mt-1'>
                <Sidebar />
            </div>
            {/* Content on the far right */}
            <div className='flex-grow flex justify-between items-center mr-2 dark:text-yellow-400 hover:text-yellow-400'>
                <ModeToggle />
                <AccountInfo />
            </div>
        </div>
    );
};

export default Header;
