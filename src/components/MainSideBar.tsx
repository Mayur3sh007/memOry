import React, { useState } from 'react';
import {
  Assignment as AssignmentIcon,
  FitnessCenter as FitnessCenterIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

const MainSideBar = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`fixed left-0 top-12 h-full bg-white dark:bg-background border-r-2 border-gray-200 dark:border-gray-800
      shadow-lg transition-width duration-300 ${isHovered ? 'w-[240px]' : 'w-[60px]'} overflow-hidden`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ul className="space-y-6 px-2 mt-6 flex flex-col items-center">
        <li className="rounded-sm w-full">
          <a href="#" className="flex items-center p-2 space-x-3 rounded-md hover:bg-gray-200 dark:hover:bg-yellow-600 w-full">
            <AssignmentIcon className="w-6 h-6 text-yellow-400" />
            {isHovered && <span className="ml-2 text-black dark:text-white">My Tasks</span>}
          </a>
        </li>
        <li className="rounded-sm w-full">
          <a href="#" className="flex items-center p-2 space-x-3 rounded-md hover:bg-gray-200 dark:hover:bg-yellow-600 w-full">
            <FitnessCenterIcon className="w-6 h-6 text-yellow-400" />
            {isHovered && <span className="ml-2 text-black dark:text-white">Set Workout</span>}
          </a>
        </li>
        <li className="rounded-sm w-full">
          <a href="#" className="flex items-center p-2 space-x-3 rounded-md hover:bg-gray-200 dark:hover:bg-yellow-600 w-full">
            <CheckCircleIcon className="w-6 h-6 text-yellow-400" />
            {isHovered && <span className="ml-2 text-black dark:text-white">Completed Tasks</span>}
          </a>
        </li>
      </ul>
    </div>
  );
};

export default MainSideBar;
