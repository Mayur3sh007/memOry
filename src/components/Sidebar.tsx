import React from 'react';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from '@/components/ui/sheet'; // Adjust the import according to your project's structure
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from '@/providers/UserContext';
import { Button } from './ui/button';
import { MenuIcon } from 'lucide-react';

const Sidebar = () => {
  const { username, avatarURL, email } = useUser();

  return (
    <Sheet>
      {/* AvatarPic Trigger */}
      <SheetTrigger asChild className='cursor-pointer'>
        <button>
          <MenuIcon />
        </button>
      </SheetTrigger>

      <SheetContent className='flex flex-col h-full w-[240px]' side={'left'}>
        {/* Sidebar Content */}
        <div className="space-y-6 mt-5 text-xl w-full">

          <div className="flex-1 w-full space-y-6">
            <ul className="pt-2 pb-4 space-y-1 text-sm w-full">
              <li className="rounded-sm w-full">
                <a
                  href="#"
                  className="flex items-center p-2 space-x-3 rounded-md hover:bg-gray-200 dark:hover:bg-yellow-600 w-full"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 text-yellow-400"
                  >
                    <path d="M19 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 14H7v-2h5v2zm0-4H7V8h5v4zm6 4h-4v-2h4v2zm0-4h-4V8h4v4z"/>
                  </svg>
                  <span className="text-black dark:text-white">My tasks</span>
                </a>
              </li>
              <li className="rounded-sm w-full">
                <a
                  href="#"
                  className="flex items-center p-2 space-x-3 rounded-md hover:bg-gray-200 dark:hover:bg-yellow-600 w-full"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 text-yellow-400"
                  >
                    <path d="M12 22a10 10 0 110-20 10 10 0 010 20zm1-17h-2v7h5v-2h-3V5zm-1 12.3a1.3 1.3 0 100 2.6 1.3 1.3 0 000-2.6z"/>
                  </svg>
                  <span className="text-black dark:text-white">Reminder</span>
                </a>
              </li>
              <li className="rounded-sm w-full">
                <a
                  href="#"
                  className="flex items-center p-2 space-x-3 rounded-md hover:bg-gray-200 dark:hover:bg-yellow-600 w-full"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 text-yellow-400"
                  >
                    <path d="M20.285 2.709a1 1 0 00-1.415 0l-9.285 9.285-4.285-4.285a1 1 0 00-1.415 1.415l5 5a1 1 0 001.415 0l10-10a1 1 0 000-1.415z"/>
                  </svg>
                  <span className="text-black dark:text-white">Completed tasks</span>
                </a>
              </li>
              <li className="rounded-sm w-full">
                <a
                  href="#"
                  className="flex items-center p-2 space-x-3 rounded-md hover:bg-gray-200 dark:hover:bg-yellow-600 w-full"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 text-yellow-400"
                  >
                    <path d="M12 2a10 10 0 110 20 10 10 0 010-20zm1 10h4.3l-1.3-1.3a1 1 0 011.415-1.415l3 3a1 1 0 01.21.329.997.997 0 01-.21 1.087l-3 3a1 1 0 01-1.415-1.415L17.3 13H13v-1z"/>
                  </svg>
                  <span className="text-black dark:text-white">Remaining tasks</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className='flex-grow'></div>
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;
