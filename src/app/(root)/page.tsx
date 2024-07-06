"use client";
import { useEffect, useState } from "react";
import { auth } from "@/config/firebase";
import { setPersistence, browserLocalPersistence } from "firebase/auth";
import { onAuthStateChanged, signOut, User as FirebaseUser } from "firebase/auth";
import { useRouter } from "next/navigation";
import { cn } from "@/utils/cn";

export default function Home() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const router = useRouter();


  useEffect(() => {
    const setAuthPersistence = async () => {
      try {
        await setPersistence(auth, browserLocalPersistence);
      } catch (error : any) {
        console.error("Setting persistence error:", error.message);
      }
    };
  
    setAuthPersistence();
  
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        router.push("/sign-up");
      }
    });
  
    return () => unsubscribe();
  }, [router]);
  

  const logout = async () => {
    try {
      await signOut(auth);
      router.push("/sign-up");
    } catch (error : any) {
      console.error("Logout Error:", error.message);
    }
  };

  return (
    <div className="flex flex-col items-end justify-center h-[50px] w-screen mr-auto">
        <>
          {/* Display user information */}
          
          <button onClick={logout}>Logout</button>
        </>
    </div>
  );
}
