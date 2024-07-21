"use client";
import React, { useEffect, useState } from 'react';
import { useUser } from '@/providers/UserContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';
import NotesCard from './NotesCard';
import { useNotes } from '@/providers/NotesContext';

type Note = {
  id: string;
  Title: string;
  Content: string;
  ImageURL: string | null;
  CreatedAt: string;
  scheduleTime: string;
  completed: boolean;
};

const CompletedTasks: React.FC = () => {
  const { uid } = useUser();
  const { notes } = useNotes();
  const [Notes, setNotes] = useState<Note[]>([]);

  const fetchNotes = async () => {
    if (!uid) {
      console.error('User is not logged in');
      return;
    }

    try {
      const notesCollection = collection(db, 'Notes');
      const q = query(notesCollection, where('userID', '==', uid));
      const querySnapshot = await getDocs(q);
      const fetchedNotes = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Note[];
      setNotes(fetchedNotes);
    } catch (error) {
      console.error('Error fetching Notes: ', error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [uid, notes]);

  // Filtering Completed Tasks
  const completedNotes = Notes.filter(note => note.completed === true);
  const NoteswithImage = completedNotes.filter(note => note.ImageURL);
  const NoteswithoutImage = completedNotes.filter(note => !note.ImageURL);

  return (
    <>
      {completedNotes.length > 0 && (
        <>
          <h1 className="text-center text-2xl font-bold mt-4">Completed Tasks</h1>
          <NotesCard 
            notes={NoteswithoutImage} 
            withImage={false}
            deleteNote={async () => {}} 
            editNote={async () => {}} 
            pinNote={async () => {}} 
            unpinNote={async () => {}} 
            isPinned={() => false} 
            setReminder={async () => {}} 
            handleCompleteTask={async () => {}} 
          />
          <NotesCard 
            notes={NoteswithImage}
            withImage={true}
            deleteNote={async () => {}} 
            editNote={async () => {}} 
            pinNote={async () => {}} 
            unpinNote={async () => {}} 
            isPinned={() => false} 
            setReminder={async () => {}} 
            handleCompleteTask={async () => {}} 
          />
        </>
      )}
    </>
  );
};

export default CompletedTasks;
