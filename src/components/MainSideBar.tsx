import React, { useState } from 'react';
import {
  Assignment as AssignmentIcon,
  FitnessCenter as FitnessCenterIcon,
  CheckCircle as CheckCircleIcon,
  ExitToApp as ExitToAppIcon,
  DateRange,
  Today,
  Weekend,
  InsertInvitation,
  DoneAll,
  CalendarViewWeek,
  CalendarViewDay
} from '@mui/icons-material';
import { useUser } from '@/providers/UserContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { ModeToggle } from './theme-switch';
import { useTheme } from 'next-themes';
import { CalendarDays, CalendarIcon, HistoryIcon } from 'lucide-react';

const MainSideBar = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAvatarClicked, setIsAvatarClicked] = useState(false);
  const { username, avatarURL } = useUser();
  const { theme, setTheme } = useTheme();

  const handleAvatarClick = () => {
    setIsAvatarClicked(!isAvatarClicked);
  };

  const router = useRouter();
  const logout = async () => {
    try {
      await signOut(auth);
      router.push("/sign-up");
    } catch (error: any) {
      console.error("Logout Error:", error.message);
    }
  };

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-white dark:bg-background border-r-2 border-gray-200 dark:border-gray-800
      shadow-lg transition-width duration-300 ${isHovered ? 'w-[240px]' : 'w-[60px]'} overflow-hidden`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ul className="space-y-6 px-2 mt-6 flex flex-col items-center">
        {/* All Tasks */}
        <li className="rounded-sm w-full">
          <a href="/" className="flex items-center p-2 space-x-3 rounded-md hover:bg-gray-200 dark:hover:bg-yellow-600 w-full">
            <AssignmentIcon className="w-6 h-6 text-yellow-400" />
            {isHovered && <span className="ml-2 text-black dark:text-white">All Tasks</span>}
          </a>
        </li>
        
        {/* My Day */}
        <li className="rounded-sm w-full">
          <a href="/my-day" className="flex items-center p-2 space-x-3 rounded-md hover:bg-gray-200 dark:hover:bg-yellow-600 w-full">
            <Today className="w-6 h-6 text-yellow-400" />
            {isHovered && <span className="ml-2 text-black dark:text-white">My Day</span>}
          </a>
        </li>

        {/* My Week */}
        <li className="rounded-sm w-full">
          <a href="/my-week" className="flex items-center p-2 space-x-3 rounded-md hover:bg-gray-200 dark:hover:bg-yellow-600 w-full">
            <InsertInvitation className="w-6 h-6 text-yellow-400" />
            {isHovered && <span className="ml-2 text-black dark:text-white">My Week</span>}
          </a>
        </li>


        {/* My Calender */}
        <li className="rounded-sm w-full">
          <a href="/my-calender" className="flex items-center p-2 space-x-3 rounded-md hover:bg-gray-200 dark:hover:bg-yellow-600 w-full">
            <CalendarIcon className="w-6 h-6 text-yellow-400" />
            {isHovered && <span className="ml-2 text-black dark:text-white">My Calender</span>}
          </a>
        </li>

        {/* Set Workout */}
        <li className="rounded-sm w-full">
          <a href="/my-gym" className="flex items-center p-2 space-x-3 rounded-md hover:bg-gray-200 dark:hover:bg-yellow-600 w-full">
            <FitnessCenterIcon className="w-6 h-6 text-yellow-400" />
            {isHovered && <span className="ml-2 text-black dark:text-white">My Gym</span>}
          </a>
        </li>
        
        {/* Completed Tasks */}
        <li className="rounded-sm w-full">
          <a href="/completed-tasks" className="flex items-center p-2 space-x-3 rounded-md hover:bg-gray-200 dark:hover:bg-yellow-600 w-full">
            <DoneAll className="w-6 h-6 text-yellow-400" />
            {isHovered && <span className="ml-2 text-black dark:text-white">Completed Tasks</span>}
          </a>
        </li>

        {/* Passed Tasks */}
        <li className="rounded-sm w-full">
          <a
            href="/passed-tasks"
            className="flex items-center p-2 space-x-3 rounded-md hover:bg-gray-200 dark:hover:bg-yellow-600 w-full"
          >
            <HistoryIcon className="w-6 h-6 text-yellow-400" />
            {isHovered && <span className="ml-2 text-black dark:text-white">Passed Tasks</span>}
          </a>
        </li>

      </ul>


      <div className={`fixed bottom-14 left-2 flex flex-row items-center 
        ${isHovered ? 'w-[220px]' : 'w-[60px]'} overflow-hidden
         p-2 space-x-3 rounded-md hover:bg-gray-200 dark:hover:bg-yellow-600`
        }
      >
        <ModeToggle />
        {isHovered && (
          <span className="ml-2 text-black dark:text-white">
            {theme.charAt(0).toUpperCase() + theme.slice(1)} Mode
          </span>
        )}
      </div>

      <div className={`fixed bottom-0 left-1 ${isHovered ? 'w-[220px]' : 'w-[60px]'} `}>
        <div className="relative w-full">
          <button
            onClick={handleAvatarClick}
            className="flex items-center p-2 space-x-3 rounded-md hover:bg-gray-200 dark:hover:bg-yellow-600 w-full"
          >
            <Avatar>
              <AvatarImage src={avatarURL ? avatarURL : ''} alt={username ? username : ''} />
              <AvatarFallback>{username?.charAt(0)}</AvatarFallback>
            </Avatar>
            {isHovered && (
              <span className="ml-2 text-black dark:text-white truncate">
                {username}
              </span>
            )}
          </button>
          {isAvatarClicked && isHovered && (
            <div className="absolute left-0 bottom-full mb-2 bg-white dark:bg-background shadow-lg rounded-md p-2 w-full">
              <button className="flex items-center w-full p-2 text-left text-black dark:text-white hover:bg-gray-200
               dark:hover:bg-yellow-600 rounded-md"
                onClick={logout}
              >
                <ExitToAppIcon className="w-5 h-5 mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainSideBar;
