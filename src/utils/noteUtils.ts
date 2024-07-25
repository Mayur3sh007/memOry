// utils/noteUtils.ts

import { doc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { db } from '@/config/firebase';

export const editNote = async (id: string, title: string, content: string, image: string | null) => {
  try {
    const noteRef = doc(db, 'Notes', id);
    await updateDoc(noteRef, {
      Title: title,
      Content: content,
      ImageURL: image,
    });
  } catch (error) {
    console.error('Error editing note: ', error);
    throw error;
  }
};

export const deleteNote = async (id: string) => {
  try {
    const noteRef = doc(db, 'Notes', id);
    await deleteDoc(noteRef);
  } catch (error) {
    console.error('Error deleting note: ', error);
    throw error;
  }
};

export const pinNote = async (id: string) => {
  try {
    const pinnedNotes = JSON.parse(localStorage.getItem('PinnedNotesId') || '[]');
    pinnedNotes.push(id);
    localStorage.setItem('PinnedNotesId', JSON.stringify(pinnedNotes));
  } catch (error) {
    console.error('Error pinning note: ', error);
    throw error;
  }
};

export const unpinNote = async (id: string) => {
  try {
    const pinnedNotes = JSON.parse(localStorage.getItem('PinnedNotesId') || '[]');
    pinnedNotes.splice(pinnedNotes.indexOf(id), 1);
    localStorage.setItem('PinnedNotesId', JSON.stringify(pinnedNotes));
  } catch (error) {
    console.error('Error unpinning note: ', error);
    throw error;
  }
};

export const isPinned = (id: string) => {
  const pinnedNotes = JSON.parse(localStorage.getItem('PinnedNotesId') || '[]');
  return pinnedNotes.includes(id);
};


export const handleCompleteTask = async (id: string) => {
  try {
    const noteRef = doc(db, 'Notes', id);
    await updateDoc(noteRef, {
      status: 'completed',
      scheduleTime: null,
      completedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error completing task: ', error);
    throw error;
  }
};

// Add other utility functions as needed