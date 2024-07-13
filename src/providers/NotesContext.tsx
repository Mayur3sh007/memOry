import React, { createContext, useContext, useState } from 'react';

type Note = {
  title: string;
  image: string | null;
  content: string;
  reminder: boolean;
  pinned: boolean;
};

type NotesContextType = {
  notes: Note[];
  addNote: (title: string, image: string | null, content: string) => void;
};

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider = ({ children }: { children: React.ReactNode }) => {
  const [notes, setNotes] = useState<Note[]>([]);

  const addNote = (title: string, image: string | null, content: string) => {
    // setNotes([...notes, { title, image, content,reminder:false,pinned:false }]); //appending the new note to the array
    //New notes on top
    setNotes([{ title, image, content,reminder:false,pinned:false },...notes]); //Prepending the new note to the array
  };

  const reloadNotes = async () => {
    
  }

  return (
    <NotesContext.Provider value={{ notes, addNote }}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};