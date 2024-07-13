"use client";
import Header from "@/components/Header";
import { ThemeProvider } from "next-themes";
import AddNotes from "@/components/AddNotes";
import { UserProvider, useUser } from "@/providers/UserContext";
import { NotesProvider, useNotes } from "@/providers/NotesContext";
import AllNotes from "@/components/AllNotes";

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
      <div className="flex flex-col w-full h-full mt-10 space-y-10 px-4">
        <div>
          <AddNotes />
        </div>
        <div className="flex flex-col justify-center gap-4 mt-4">
          <AllNotes />
        </div>
      </div>
    </div>
  );
};
