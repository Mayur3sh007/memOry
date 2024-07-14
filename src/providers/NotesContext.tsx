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
  isPinChanged: () => boolean;
};

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider = ({ children }: { children: React.ReactNode }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isPinStatusChanged, setIsPinStatusChanged] = useState(false);

  const addNote = (title: string, image: string | null, content: string) => {
    // setNotes([...notes, { title, image, content,reminder:false,pinned:false }]); //appending the new note to the array
    //New notes on top
    setNotes([{ title, image, content,reminder:false,pinned:false },...notes]); //Prepending the new note to the array
  };

  // Dummy function to rerender notes
  const isPinChanged = () => {
    setIsPinStatusChanged(!isPinStatusChanged);
    return isPinStatusChanged;
  };

  return (
    <NotesContext.Provider value={{ notes, addNote, isPinChanged }}>
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