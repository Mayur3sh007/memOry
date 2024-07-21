"use client";
import React from 'react'
import Header from "@/components/Header";
import { ThemeProvider } from "next-themes";
import AddNotes from "@/components/AddNotes";
import { UserProvider, useUser } from "@/providers/UserContext";
import { NotesProvider, useNotes } from "@/providers/NotesContext";
import AllNotes from "@/components/AllNotes";
import PinnedNotes from "@/components/PinnedNotes";
import MainSideBar from "@/components/MainSideBar";

const layout = ({children} : any) => {
  return (
    <UserProvider>
      <NotesProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
      
          enableSystem
          disableTransitionOnChange
        >
          <div className="hidden max-md:flex w-[50px]">
        <Header />
      </div>

      <div className="hidden lg:flex">
        <MainSideBar />
      </div>

          {children}
        </ThemeProvider>
      </NotesProvider>
    </UserProvider>
  )
}

export default layout