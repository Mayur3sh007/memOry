import React from 'react'
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from '@/providers/UserContext';
import { signOut } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { useRouter } from 'next/navigation';


const AccountInfo = () => {
    const { username, avatarURL, email } = useUser();
    const router = useRouter();
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
        <Sheet>
            {/* AvatarPic Trigger */}
            <SheetTrigger asChild className='cursor-pointer mr-3'>
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
    )
}

export default AccountInfo