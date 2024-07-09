"use client";
import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth, db } from '@/config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ModeToggle } from './theme-switch';
import { toast } from 'react-toastify';

const Header = () => {
    const router = useRouter();
    const [avatarURL, setAvatarURL] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");

    useEffect(() => {
        const getUserData = async (uid: string) => {
            try {
                const userRef = doc(db, "Users", uid);
                const userSnapshot = await getDoc(userRef);

                if (userSnapshot.exists()) {
                    const userData = userSnapshot.data();
                    setAvatarURL(userData.avatarURL || "");
                    setUsername(userData.username);
                    setEmail(userData.email);
                }
            } catch (error: any) {
                toast.error(error.message);
                console.error("Error:", error.message);
            }
        };

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                getUserData(user.uid);
            } else {
                setAvatarURL("");
                setUsername("");
                setEmail("");
            }
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        try {
            await signOut(auth);
            router.push("/sign-up");
        } catch (error: any) {
            console.error("Logout Error:", error.message);
        }
    };

    const addAccount = () => {
        // Implement the logic for adding an account here.
        // For now, we'll just log a message.
        console.log("Add Account button clicked");
    };

    const getAvatarFallback = () => {
        if (username) {
            return username.charAt(0).toUpperCase();
        }
        return "U";
    };

    return (
        <div className='flex fixed min-w-full justify-end items-center h-[50px] space-x-4 right-4'>
            <ModeToggle />
            <Sheet>
                {/* AvatarPic Trigger */}
                <SheetTrigger asChild className='cursor-pointer'>
                    <Avatar>
                        {avatarURL ? (
                            <AvatarImage src={avatarURL} />
                        ) : (
                            <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
                        )}
                    </Avatar>
                </SheetTrigger>

                <SheetContent className='flex flex-col h-full'>
                    {/* User Info */}
                    <SheetHeader className='flex flex-col items-center flex-shrink-0'>
                        <Avatar className='w-24 h-24 mb-4'>
                            {avatarURL ? (
                                <AvatarImage src={avatarURL} />
                            ) : (
                                <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
                            )}
                        </Avatar>
                        <SheetTitle>{username}</SheetTitle>
                        <p>Logged in as {email}</p>
                    </SheetHeader>

                    {/* Add Account Button */}
                    
                    <Button onClick={addAccount} variant="secondary">Add Account</Button>

                    <div className='flex-grow'></div>
                    {/* Add Account and Logout Buttons */}
                    <SheetFooter className='flex justify-between items-end mt-4'>
                        <SheetClose asChild>
                            <Button onClick={logout}>Logout</Button>
                        </SheetClose>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default Header;
