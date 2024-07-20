import React from 'react';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import 
{ 
  Menu as MenuIcon,
  Assignment as AssignmentIcon,
  FitnessCenter as FitnessCenterIcon,
  CheckCircle as CheckCircleIcon 
} from '@mui/icons-material';

const Sidebar = () => {
  return (
    <div className='md:hidden lg:hidden'>
      <Sheet>
        <SheetTrigger asChild className='cursor-pointer'>
          <button>
            <MenuIcon />
          </button>
        </SheetTrigger>

        <SheetContent className='flex flex-col h-full w-[240px]' side={'left'} >
          {/* Sidebar Content */}
          <div className="space-y-6 mt-5 text-xl w-full">
            <div className="flex-1 w-full space-y-6">
              <ul className="pt-2 pb-4 space-y-1 text-sm w-full">
                <li className="rounded-sm w-full">
                  <a
                    href="#"
                    className="flex items-center p-2 space-x-3 rounded-md hover:bg-gray-200 dark:hover:bg-yellow-600 w-full"
                  >
                    <AssignmentIcon className="w-6 h-6 text-yellow-400" />
                    <span className="text-black dark:text-white">My Tasks</span>
                  </a>
                </li>
                <li className="rounded-sm w-full">
                  <a
                    href="#"
                    className="flex items-center p-2 space-x-3 rounded-md hover:bg-gray-200 dark:hover:bg-yellow-600 w-full"
                  >
                    <FitnessCenterIcon className="w-6 h-6 text-yellow-400" />
                    <span className="text-black dark:text-white">Set Workout</span>
                  </a>
                </li>
                <li className="rounded-sm w-full">
                  <a
                    href="#"
                    className="flex items-center p-2 space-x-3 rounded-md hover:bg-gray-200 dark:hover:bg-yellow-600 w-full"
                  >
                    <CheckCircleIcon className="w-6 h-6 text-yellow-400" />
                    <span className="text-black dark:text-white">Completed Tasks</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className='flex-grow'></div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Sidebar;
