"use client";
import Header from "@/components/Header";
import { ThemeProvider } from "next-themes";
import AddNotes from "@/components/AddNotes";
import { UserProvider, useUser } from "@/providers/UserContext";
import { NotesProvider, useNotes } from "@/providers/NotesContext";
import AllNotes from "@/components/AllNotes";
import PinnedNotes from "@/components/PinnedNotes";
import MainSideBar from "@/components/MainSideBar";

export default function Home() {
  return (
    <UserProvider>
      <NotesProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppContent />
        </ThemeProvider>
      </NotesProvider>
    </UserProvider>
  );
}

const AppContent = () => {
  const { loading } = useUser();

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex w-screen min-h-screen">
      <Header />

      <div className="hidden lg:flex">
        <MainSideBar />
      </div>
      <div className="flex flex-grow flex-col w-full h-full mt-16 px-4 space-y-10 overflow-y-auto justify-center items-center">
        <div className="w-full max-w-4xl">
          <AddNotes />
        </div>
        <div className="flex flex-col justify-center gap-4 w-full max-w-4xl mt-4">
          <PinnedNotes />
          <AllNotes />
        </div>
      </div>
    </div>
  );
};
