import React, { useEffect, useState } from 'react';
import { useUser } from '@/providers/UserContext';
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import NotesCard from './NotesCard';
import { useNotes } from '@/providers/NotesContext';

type Note = {
  id: string;
  Title: string;
  Content: string;
  ImageURL: string | null;
  CreatedAt: string;
};

const AllNotes: React.FC = () => {
  const { uid} = useUser();
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
  }, [uid,notes]);  //refresh notes when uid changes i.e user refreshes page && whenever theres somekinda changes in notes

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


  const notesWithImages = Notes.filter(note => note.ImageURL !== null);
  const notesWithOutImages = Notes.filter(note => note.ImageURL === null);

  if (Notes.length > 0) {
    return (
      <>
        <h1 className="text-center text-2xl font-bold">All Notes</h1>
        <NotesCard notes={notesWithOutImages}  withImage={false} deleteNote={deleteNote} editNote={editNote} />
        <NotesCard notes={notesWithImages}  withImage={true} deleteNote={deleteNote} editNote={editNote} />
      </>
    )
  }
  
};

export default AllNotes;
