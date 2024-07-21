import React, { useState } from 'react';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { useUser } from '@/providers/UserContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ModeToggle } from './theme-switch';
import { useTheme } from 'next-themes';
import {
  Menu as MenuIcon,
  Assignment as AssignmentIcon,
  FitnessCenter as FitnessCenterIcon,
  CheckCircle as CheckCircleIcon,
  ExitToApp as ExitToAppIcon,
} from '@mui/icons-material';

const Sidebar = () => {
  const [isAvatarClicked, setIsAvatarClicked] = useState(false);
  const { username, avatarURL } = useUser();
  const { theme } = useTheme();
  const router = useRouter();

  const handleAvatarClick = () => {
    setIsAvatarClicked(!isAvatarClicked);
  };

  const logout = async () => {
    try {
      await signOut(auth);
      router.push("/sign-up");
    } catch (error : any) {
      console.error("Logout Error:", error.message);
    }
  };

  return (
    <div className='ml-4 mt-1 hidden max-md:flex z-100 cursor-pointer'>
      <Sheet>

        <SheetTrigger asChild className='cursor-pointer q'>
            <MenuIcon />
        </SheetTrigger>

        <SheetContent className='flex flex-col h-full w-[40%]' side='left'>
          {/* Sidebar Content */}
          <div className="mt-5 text-xl w-full">
            <div className="flex-1 w-full space-y-6">
              <ul className="pt-2 pb-4 space-y-6 text-sm w-full">
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

          {/* Theme Toggle Switch */}
          <div className="fixed bottom-20 flex flex-row items-center mt-4">
            <ModeToggle />
            <span className="ml-2 text-black dark:text-white">
              {theme.charAt(0).toUpperCase() + theme.slice(1)} Mode
            </span>
          </div>

          {/* Account Button */}
          <div className="mt-auto">
            <div className="relative w-full">
              <button
                onClick={handleAvatarClick}
                className="flex items-center p-2 space-x-3 rounded-md hover:bg-gray-200 dark:hover:bg-yellow-600 w-full"
              >
                <Avatar>
                  <AvatarImage src={avatarURL ? avatarURL : ''} alt={username ? username : ''} />
                  <AvatarFallback>{username?.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="ml-2 text-black dark:text-white truncate">
                  {username}
                </span>
              </button>
              {isAvatarClicked && (
                <div className="absolute left-0 bottom-full mb-2 bg-white dark:bg-background shadow-lg rounded-md p-2 w-full">
                  <button
                    className="flex items-center w-full p-2 text-left text-black dark:text-white hover:bg-gray-200 dark:hover:bg-yellow-600 rounded-md"
                    onClick={logout}
                  >
                    <ExitToAppIcon className="w-5 h-5 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Sidebar;
