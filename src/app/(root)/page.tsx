"use client";
import { useEffect, useState } from "react";
import { auth } from "@/config/firebase";
import { setPersistence, browserLocalPersistence } from "firebase/auth";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { ThemeProvider } from "next-themes";
import AddNote from "@/components/AddNotes";

export default function Home() {
  const [user, setUser] = useState<FirebaseUser | null>(null);

  console.log(auth.currentUser?.uid);

  const router = useRouter();
  useEffect(() => {
    const setAuthPersistence = async () => {
      try {
        await setPersistence(auth, browserLocalPersistence);
      } catch (error: any) {
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




  return (
    <div className="flex w-screen min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <Sidebar />
          <div className="flex w-full h-full mt-10">
            <AddNote />
          </div>
        </ThemeProvider>
    </div>
  );
}
