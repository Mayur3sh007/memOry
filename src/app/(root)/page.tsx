"use client";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { ThemeProvider } from "next-themes";
import AddNotes from "@/components/AddNotes";
import NewNotes from "@/components/NewNotes";
import { UserProvider, useUser } from "@/providers/UserContext";
import { NotesProvider, useNotes } from "@/providers/NotesContext";

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
  const { notes } = useNotes();
  const { loading } = useUser();

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex w-screen min-h-screen">
      <Header />
      <Sidebar />
      <div className="flex flex-col w-full h-full mt-10 space-y-10 space-x-4">
        <AddNotes />
        <div className="flex flex-wrap justify-center gap-4 mt-4 space-x-6">
          {notes.map((note, index) => (
            <NewNotes key={index} title={note.title} image={note.image} content={note.content} />
          ))}
        </div>
      </div>
    </div>
  );
}
