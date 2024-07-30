"use client";
import React from 'react'
import Header from "@/components/Header";
import { ThemeProvider } from "next-themes";
import { UserProvider } from "@/providers/UserContext";
import { NotesProvider } from "@/providers/NotesContext";
import MainSideBar from "@/components/MainSideBar";

const layout = ({ children }: any) => {
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

          <div className="hidden lg:flex z-1000 left-0 top-0">
            <MainSideBar />
          </div>
          <main className="flex-grow overflow-x-hidden">
            {children}
          </main>
        </ThemeProvider>
      </NotesProvider>
    </UserProvider>
  )
}

export default layout