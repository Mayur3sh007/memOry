"use client";
import React, { useEffect, useState } from 'react';
import { useUser } from '@/providers/UserContext';
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc, writeBatch } from 'firebase/firestore';
import { db } from '@/config/firebase';
import NotesCard from './NotesCard';
import { useNotes } from '@/providers/NotesContext';

type Note = {
  id: string;
  userID: string;
  Title: string;
  Content: string;
  ImageURL: string | null;
  CreatedAt: string;
  scheduleTime: string;
  completedAt: string | null;
  status: 'pending' | 'passed' | 'completed';
};

const mapStatusToType = (status: string): 'pending' | 'passed' | 'completed' => {
  if (status === 'pending' || status === 'passed' || status === 'completed') {
    return status;
  }
  throw new Error(`Invalid status: ${status}`);
};

const AllNotes: React.FC = () => {
  const { uid } = useUser();
  const { notes, isPinChanged } = useNotes();
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
        status: mapStatusToType(doc.data().status),
      })) as Note[];
  
      const currentDate = new Date();
      const batch = writeBatch(db);
  
      fetchedNotes.forEach(note => {
        if (note.status === 'pending' && note.scheduleTime) {
          const scheduleDate = new Date(note.scheduleTime);
          if (scheduleDate < currentDate) {
            const noteRef = doc(db, 'Notes', note.id);
            batch.update(noteRef, { status: 'passed' });
            note.status = 'passed';
          }
        }
      });
  
      await batch.commit(); // Commit the batch of updates to the database  
  
      setNotes(fetchedNotes);
    } catch (error) {
      console.error('Error fetching Notes: ', error);
    }
  };

  useEffect(() => {
    fetchNotes();
    console.log("AllNotes");
  }, [uid, notes]);

  const editNote = async (id: string, title: string, content: string, image: string | null) => {
    try {
      const noteRef = doc(db, 'Notes', id);
      await updateDoc(noteRef, {
        Title: title,
        Content: content,
        ImageURL: image,
      });
      fetchNotes();
    } catch (error) {
      console.error('Error editing note: ', error);
    }
  };

  const deleteNote = async (id: string) => {
    try {
      const noteRef = doc(db, 'Notes', id);
      await deleteDoc(noteRef);
      fetchNotes();
    } catch (error) {
      console.error('Error deleting note: ', error);
    }
  };

  const pinNote = async (id: string) => {
    try {
      const pinnedNotes = JSON.parse(localStorage.getItem('PinnedNotesId') || '[]');
      pinnedNotes.push(id);
      localStorage.setItem('PinnedNotesId', JSON.stringify(pinnedNotes));
      fetchNotes();
      isPinChanged();
    } catch (error) {
      console.error('Error pinning note: ', error);
    }
  };

  const unpinNote = async (id: string) => {
    try {
      const pinnedNotes = JSON.parse(localStorage.getItem('PinnedNotesId') || '[]');
      pinnedNotes.splice(pinnedNotes.indexOf(id), 1);
      localStorage.setItem('PinnedNotesId', JSON.stringify(pinnedNotes));
      fetchNotes();
    } catch (error) {
      console.error('Error unpinning note: ', error);
    }
  };

  const isPinned = (id: string) => {
    const pinnedNotes = JSON.parse(localStorage.getItem('PinnedNotesId') || '[]');
    return pinnedNotes.includes(id);
  };

  const setReminder = async (id: string, time: string) => {
    try {
      const noteRef = doc(db, 'Notes', id);
      await updateDoc(noteRef, {
        reminderTime: time,
      });
      fetchNotes();
      scheduleNotification(id, time);
    } catch (error) {
      console.error('Error setting reminder: ', error);
    }
  };

  const scheduleNotification = (id: string, time: string) => {
    const now = new Date().getTime();
    const reminderTime = new Date(time).getTime();
    const timeUntilReminder = reminderTime - now;

    if (timeUntilReminder > 0) {
      setTimeout(() => {
        showNotification(id);
      }, timeUntilReminder);
    }
  };

  const showNotification = (id: string) => {
    const note = Notes.find(note => note.id === id);
    if (note && Notification.permission === "granted") {
      new Notification(note.Title, { body: note.Content });
    }
  };

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  const handleCompleteTask = async (id: string) => {
    try {
      const noteRef = doc(db, 'Notes', id);
      await updateDoc(noteRef, {
        status: 'completed',
        scheduleTime: null,
        completedAt: new Date().toISOString(),
      });
      fetchNotes();
    } catch (error) {
      console.error('Error completing task: ', error);
    }
  };


  // Filtering Data
  const pendingNotes = Notes.filter(note => note.status === 'pending');
  const notesWithScheduleTimeTodayWithImages = pendingNotes.filter(note => (note.ImageURL !== null && (new Date(note.scheduleTime).getDate() === new Date().getDate())));
  const notesWithScheduleTimeTodayWithoutImages = pendingNotes.filter(note => (note.ImageURL === null && (new Date(note.scheduleTime).getDate() === new Date().getDate())));
  const notesWithImages = pendingNotes.filter(note => (note.ImageURL !== null && !(notesWithScheduleTimeTodayWithImages.includes(note))));
  const notesWithOutImages = pendingNotes.filter(note => (note.ImageURL === null && !(notesWithScheduleTimeTodayWithoutImages.includes(note))));
  const sortedUpcomingNotesWithImages = notesWithImages.sort((a, b) => new Date(a.scheduleTime).getTime() - new Date(b.scheduleTime).getTime());
  const sortedUpcomingNotesWithOutImages = notesWithOutImages.sort((a, b) => new Date(a.scheduleTime).getTime() - new Date(b.scheduleTime).getTime());
  

  return (
    <>
      {(notesWithScheduleTimeTodayWithImages.length > 0 || notesWithScheduleTimeTodayWithoutImages.length > 0) && (
        <>
          <h1 className="text-center text-2xl font-bold mt-4">Today's Tasks</h1>
          <NotesCard
            notes={notesWithScheduleTimeTodayWithImages}
            withImage={true}
            deleteNote={deleteNote}
            editNote={editNote}
            pinNote={pinNote}
            unpinNote={unpinNote}
            isPinned={isPinned}
            setReminder={setReminder}
            handleCompleteTask={handleCompleteTask}
          />
          <NotesCard 
            notes={notesWithScheduleTimeTodayWithoutImages}
            withImage={false}
            deleteNote={deleteNote}
            editNote={editNote}
            pinNote={pinNote}
            unpinNote={unpinNote}
            isPinned={isPinned}
            setReminder={setReminder}
            handleCompleteTask={handleCompleteTask}
          />
        </>
      )}
      {(sortedUpcomingNotesWithImages.length > 0 || sortedUpcomingNotesWithOutImages.length > 0) && (
        <>
          <h1 className="text-center text-2xl font-bold mt-4">Upcoming Tasks</h1>
          <NotesCard 
            notes={sortedUpcomingNotesWithImages} 
            withImage={true}
            deleteNote={deleteNote}
            editNote={editNote}
            pinNote={pinNote}
            unpinNote={unpinNote}
            isPinned={isPinned}
            setReminder={setReminder}
            handleCompleteTask={handleCompleteTask}
          />
          <NotesCard 
            notes={sortedUpcomingNotesWithOutImages} 
            withImage={false}
            deleteNote={deleteNote}
            editNote={editNote}
            pinNote={pinNote}
            unpinNote={unpinNote}
            isPinned={isPinned}
            setReminder={setReminder}
            handleCompleteTask={handleCompleteTask}
          />
        </>
      )}
    </>
  );
};

export default AllNotes;
