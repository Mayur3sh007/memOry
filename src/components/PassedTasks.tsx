"use client";
import React, { useEffect, useState } from 'react';
import { useUser } from '@/providers/UserContext';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import NotesCard from './NotesCard';
import { useNotes } from '@/providers/NotesContext';

type Note = {
  id: string; // This is the note's ID
  userID: string; // This is the user's ID
  Title: string;
  Content: string;
  ImageURL: string | null;
  CreatedAt: string;
  scheduleTime: string;
  completedAt: string | null;
  status: 'pending' | 'passed' | 'completed';
};

const PassedTasks: React.FC = () => {
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
      setNotes(fetchedNotes as Note[]);
    } catch (error) {
      console.error('Error fetching Notes: ', error);
    }
  };

  useEffect(() => {
    fetchNotes();
    console.log("PassedTasks");
  }, [uid, notes]);

  const deleteNote = async (id: string) => {
    try {
      const noteRef = doc(db, 'Notes', id);
      await deleteDoc(noteRef);
      fetchNotes();
    } catch (error) {
      console.error('Error deleting note: ', error);
    }
  };

  // Filtering Completed Tasks
  const completedNotes = Notes.filter(note => note.status === 'passed');
  const NoteswithImage = completedNotes.filter(note => note.ImageURL) as Note[];
  const NoteswithoutImage = completedNotes.filter(note => !note.ImageURL) as Note[];


  return (
    <>
      {completedNotes.length > 0 && (
        <>
          <h1 className="text-center text-2xl font-bold mt-16">Passed Tasks</h1>
          <NotesCard 
            notes={NoteswithoutImage} 
            withImage={false}
            deleteNote={deleteNote}
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
            deleteNote={deleteNote}
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

export default PassedTasks;
