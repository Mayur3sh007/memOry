"use client";
import React, { useState, useEffect } from 'react';
import { addDoc, collection, doc, getDocs, query, where, writeBatch } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useUser } from '@/providers/UserContext';
import { useNotes } from '@/providers/NotesContext';
import { toast } from 'react-toastify';
import { Button } from './ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';

type Note = {
  userID: string;
  Title: string;
  Content: string;
  ImageURL: string | null;
  CreatedAt: string;
  scheduleTime: string;
  completedAt: string | null;
  status: 'pending' | 'passed' | 'completed';
};

type Notes = {
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

const Calendar: React.FC = () => {
  const [currentWeek, setCurrentWeek] = useState<Date[]>([]);
  const [notes, setNotes] = useState<Notes[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { uid } = useUser();
  const { notes: notesContext, isPinChanged } = useNotes();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteScheduleTime, setNewNoteScheduleTime] = useState('');


  const mapStatusToType = (status: string): 'pending' | 'passed' | 'completed' => {
    if (status === 'pending' || status === 'passed' || status === 'completed') {
      return status;
    }
    throw new Error(`Invalid status: ${status}`);
  };

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
      })) as Notes[];

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

      await batch.commit();

      setNotes(fetchedNotes);
    } catch (error) {
      console.error('Error fetching Notes: ', error);
    }
  };

  useEffect(() => {
    fetchNotes();
    console.log("Calendar Notes");
  }, [uid, notesContext]);


  {/* Days and Date Heading  */ }
  useEffect(() => {
    const today = new Date();
    const week = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(today);
      day.setDate(today.getDate() + i);
      week.push(day);
    }
    setCurrentWeek(week);
  }, []);

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const handleDaySelect = (day: Date) => {
    setSelectedDate(day);
  };

  {/* Adding new note */ }
  const handleAddNoteClick = (day: Date, hour: number) => {
    const scheduleTime = new Date(day);
    scheduleTime.setHours(hour, 0, 0, 0);
    setNewNoteScheduleTime(scheduleTime.toISOString());
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setNewNoteTitle('');
    setNewNoteContent('');
    setNewNoteScheduleTime('');
  };

  const handleAddNote = async () => {
    try {
      if (!uid) {
        console.error('User is not logged in');
        return;
      }

      const newNote: Note = {
        userID: uid,
        Title: newNoteTitle,
        Content: newNoteContent,
        ImageURL: null,
        CreatedAt: new Date().toISOString(),
        scheduleTime: newNoteScheduleTime,
        completedAt: null,
        status: 'pending',
      };

      const noteRef = collection(db, 'Notes');
      await addDoc(noteRef, newNote);

      toast.success('Note added successfully');
      handleCloseDialog();
      fetchNotes(); // Refresh the notes list
    } catch (error) {
      console.error('Error adding note:', error);
      toast.error('Error adding note');
    }
  };


  return (
    <div className="calendar bg-neutral-900 text-white p-4 ml-16 max-md:ml-0">
      {/* Header */}
      <div className="header mb-4">
        <h2 className="text-xl font-bold text-center">
          {selectedDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
        </h2>
      </div>

      {/* Grid */}
      <div className="calendar-grid">
        <div className="grid grid-cols-8 gap-1">
          {/* Time column header */}
          <div className="text-center p-2">Time</div>

          {/* Day headers */}
          {currentWeek.map((day, index) => (
            <div
              key={index}
              className={`text-center p-2 cursor-pointer ${day.toDateString() === selectedDate.toDateString() ? 'bg-blue-500' : 'bg-neutral-800'}`}
              onClick={() => handleDaySelect(day)}
            >
              <div className="text-sm">{day.toLocaleDateString('default', { weekday: 'short' })}</div>
              <div className="font-bold">{day.getDate()}</div>
            </div>
          ))}

          {/* Hours and day cells */}
          {hours.map((hour) => (
            <React.Fragment key={hour}>
              {/* Time column */}
              <div className="text-right pr-2 py-2 text-sm">{`${hour}:00`}</div>

              {/* Day cells */}
              {currentWeek.map((day, dayIndex) => (
                <div
                  key={`${hour}-${dayIndex}`}
                  className={`bg-neutral-800 hover:bg-neutral-700 p-2 ${day.toDateString() === selectedDate.toDateString() ? 'border border-blue-500' : ''}`}
                  onClick={() => handleAddNoteClick(day, hour)}
                >
                  {notes.filter(note => {
                    const scheduleDate = new Date(note.scheduleTime);
                    return scheduleDate.toDateString() === day.toDateString() &&
                      scheduleDate.getHours() === hour;
                  }).map(note => (
                    <div key={note.id} className="bg-yellow-500 text-black text-xs p-1 m-1 rounded">{note.Title}</div>
                  ))}
                  <Button
                    variant={"outline"}
                    size={"sm"}
                    className="mt-1"
                    onClick={(e: any) => {
                      e.stopPropagation();
                      handleAddNoteClick(day, hour);
                    }}
                  >
                    +
                  </Button>
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Dialog for adding a new note */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="animate-fadeIn p-6 shadow-lg rounded-lg bg-blend-hue-dark bg-blue-950 w-full">
          <DialogHeader className="flex justify-between items-center mb-4">
            <DialogTitle className="text-2xl font-bold text-white">Add New Note</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4 w-full">
            <div className="grid grid-cols-4 items-center gap-4 w-full">
              <Label htmlFor="name" className="text-right text-white">
                Title
              </Label>
              <Input
                id="name"
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
                className="col-span-3 text-black w-full"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right text-white">
                Content
              </Label>
              <Input
                id="username"
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                className="col-span-3 text-black w-full"
              />
            </div>
            <button className="btn btn-primary w-full mt-4" onClick={handleAddNote}>
              Add
            </button>
          </div>
        </DialogContent>
      </Dialog>


    </div>
  );
};

export default Calendar;