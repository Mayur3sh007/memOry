"use client"
import React, { useEffect, useState } from 'react';
import { Home, Plus } from 'lucide-react';
import { db } from '@/config/firebase';
import { getDocs, collection } from 'firebase/firestore';
import { useUser } from '@/providers/UserContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from './ui/button';
import Link from 'next/link';

interface Channel {
  id: string;
  admin: string;
  name: string;
  channelIcon: string;
  members: string[];
  tasks: string[];
  createdAt: string;
}

const ChannelsSidebar: React.FC = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const { email, uid } = useUser();

  useEffect(() => {
    fetchUserChannels();
  }, [uid, email]);

  const fetchUserChannels = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Channels"));
      const channelsList: Channel[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        channelsList.push({
          id: doc.id,
          admin: data.admin,
          name: data.name,
          channelIcon: data.channelIcon,
          members: data.members,
          tasks: data.tasks,
          createdAt: data.createdAt
        });
      });

      const userChannels = channelsList.filter(channel => channel.members.includes(email) || channel.admin === email);
      setChannels(userChannels);
      console.log(userChannels);
    } catch (error) {
      console.error('Error fetching channels:', error);
    }
  }

  return (
    <div className="fixed right-0 top-0 h-screen w-[72px] bg-gray-900 text-white flex flex-col items-center py-4 mt-3 space-y-4 
    max-md:top-10 max-md:w-[42px]">
      <Link href='/my-gym/channel' className="w-12 h-12 bg-discord-blurple rounded-full flex items-center justify-center mb-4 max-md:w-8 max-md:h-8">
        <Button variant="ghost" size="icon" className="text-white">
          <Home className="h-6 w-6" />
        </Button>
      </Link>

      {channels.map((channel) => (
        <Link key={channel.id} href={`/my-gym/channel/${channel.id}`} className="w-12 h-12 bg-discord-blurple rounded-full flex items-center justify-center mb-4 max-md:w-8 max-md:h-8">
          <Button
            variant="ghost"
            size="icon"
            className="p-0"
          >
            <Avatar>
              <AvatarImage src={channel.channelIcon} alt={channel.name} />
              <AvatarFallback>{channel.name?.charAt(0)}</AvatarFallback>
            </Avatar>
          </Button>
        </Link>
      ))}

      {/* Separator */}
      <div className="w-8 h-0.5 bg-gray-700 my-2"></div>

      {/* Add icon */}
      <Link href='/my-gym/create-channel' className="w-12 h-12 bg-discord-blurple rounded-full flex items-center justify-center mb-4 max-md:w-8 max-md:h-8">
        <Button variant="ghost" size="icon" className="text-white">
          <Plus className="h-6 w-6" />
        </Button>
      </Link>
    </div>
  );
};

export default ChannelsSidebar;