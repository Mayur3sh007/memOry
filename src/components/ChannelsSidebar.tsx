"use client"
import React from 'react';
import { AssignmentInd, FitnessCenter, CalendarMonth, History, Home } from '@mui/icons-material';

const ChannelsSidebar: React.FC = () => {
  
  const creatChannel = async() =>{
      console.log("create channel")
  }

  return (
    <div className="fixed right-0 top-0 h-screen w-[72px] bg-gray-900 text-white flex flex-col items-center py-4 mt-3 space-y-4">
      {/* Server icon */}
      <div className="w-12 h-12 bg-discord-blurple rounded-full flex items-center justify-center mb-4">
        <IconButton icon={<Home />} href="/" />
      </div>

      {/* Navigation icons */}
      <IconButton icon={<AssignmentInd />} href="/" />
      <IconButton icon={<CalendarMonth />} href="/my-day" />
      <IconButton icon={<FitnessCenter />} href="/my-gym" />
      <IconButton icon={<History />} href="/passed-tasks" />

      {/* Separator */}
      <div className="w-8 h-0.5 bg-gray-700 my-2"></div>

      {/* Add server button */}
      <IconButton icon="+"  href='/my-gym/create-channel'/>

    </div>
  );
};

const IconButton: React.FC<{ icon: React.ReactNode; href?: string }> = ({ icon, href }) => (
  <a
    href={href}
    className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors"
  >
    {typeof icon === 'string' ? icon : React.cloneElement(icon as React.ReactElement, { className: 'w-6 h-6' })}
  </a>
);

export default ChannelsSidebar;
