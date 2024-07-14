import React, { useEffect, useState } from 'react';
import { useUser } from '@/providers/UserContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import NotesCard from './NotesCard';
import PinnedNotesCard from './PinnedNotesCard';
import { useNotes } from '@/providers/NotesContext';

type Note = {
    id: string;
    Title: string;
    Content: string;
    ImageURL: string | null;
    CreatedAt: string;
};

const PinnedNotes: React.FC = () => {
    const { uid } = useUser();
    const { isPinChanged } = useNotes();
    const [pinnedNotes, setPinnedNotes] = useState<Note[]>([]);

    const fetchPinnedNotes = async () => {
        if (!uid) {
            console.error('User is not logged in');
            return;
        }

        try {
            // Retrieve the current array of pinned note IDs from local storage
            const pinnedNotesIds = JSON.parse(localStorage.getItem('PinnedNotesId') || '[]');
            const fetchedPinnedNotes: Note[] = [];

            for (const id of pinnedNotesIds) {
                const noteRef = doc(db, 'Notes', id);
                const noteSnap = await getDoc(noteRef);

                if (noteSnap.exists()) {
                    fetchedPinnedNotes.push({
                        id: noteSnap.id,
                        ...noteSnap.data(),
                    } as Note);
                }
            }

            setPinnedNotes(fetchedPinnedNotes);
        } catch (error) {
            console.error('Error fetching pinned notes: ', error);
        }
    };

    useEffect(() => {
        fetchPinnedNotes();
        console.log("PinnedNotes")
    }, [uid,isPinChanged]);

    const unpinNote = async (id: string) => {
        try {
            const pinnedNotes = JSON.parse(localStorage.getItem('PinnedNotesId') || '[]');

            // Remove the ID from the array
            pinnedNotes.splice(pinnedNotes.indexOf(id), 1);

            // Save the updated array back to local storage
            localStorage.setItem('PinnedNotesId', JSON.stringify(pinnedNotes));
            // Fetch notes if necessary
            fetchPinnedNotes();
            isPinChanged(); // Trigger rerender
        } catch (error) {
            console.error('Error unpinning note: ', error);
        }
    };

    const isPinned = (id: string) => {
        const pinnedNotesIds = JSON.parse(localStorage.getItem('PinnedNotesId') || '[]');
        return pinnedNotesIds.includes(id);
    };

    const notesWithImages = pinnedNotes.filter(note => note.ImageURL !== null);
    const notesWithoutImages = pinnedNotes.filter(note => note.ImageURL === null);

    return (
        <>
            {pinnedNotes.length > 0 ? (
                <>
                    <h1 className="text-center text-2xl font-bold">Pinned Notes</h1>
                    <PinnedNotesCard notes={notesWithoutImages} withImage={false} unpinNote={unpinNote} isPinned={isPinned} />
                    <PinnedNotesCard notes={notesWithImages} withImage={true} unpinNote={unpinNote} isPinned={isPinned} />
                </>
            ) : (
                null
            )}
        </>
    );
};

export default PinnedNotes;
