"use client";
import React, { useState, ChangeEvent } from 'react';
import { useNotes } from '@/providers/NotesContext';
import { useUser } from '@/providers/UserContext';
import { addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/config/firebase';
import { IconPhoto } from '@tabler/icons-react';
import 'react-datepicker/dist/react-datepicker.css';
import SimpleDateTimePicker from './SimpleDateTimePicker';
import { toast } from 'react-toastify';

const AddNotes = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [img, setImg] = useState<File | null>(null);
    const [imageURL, setImageURL] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [scheduleTime, setScheduleTime] = useState<Date | null>(null);
    const { uid } = useUser();
    const { addNote } = useNotes();

    const handleDateTimeChange = (dateTime: Date) => {

        if(dateTime < new Date()) {
            toast.error("Please select a date in the future",{
                position: "top-center",
            });
            return;
        }

        setScheduleTime(dateTime);
        // console.log(scheduleTime);
    };

    const handleSave = async () => {
        if (!uid) {
            console.error("User is not logged in");
            return;
        }
        
        if(!title) {
            toast.error("Title is not set"),{
                position: "top-center",
            };
            return;
        }
        if (!scheduleTime) {
            toast.error("Reminder time is not set"),{
                position: "top-center",
            };
            return;
        }


        let uploadedImageURL = null;
        if (img) {
            const imageRef = ref(storage, `notes/${uid}/${Date.now()}_${img.name}`);
            await uploadBytes(imageRef, img);
            uploadedImageURL = await getDownloadURL(imageRef);
        }

        const noteData = {
            userID: uid,
            Title: title,
            Content: content,
            ImageURL: uploadedImageURL,
            CreatedAt: new Date().toISOString(),
            scheduleTime: scheduleTime.toISOString(),
            reminderTime: null,
            completedAt: null,
            status:'pending',
        };

        const noteRef = collection(db, "Notes");
        await addDoc(noteRef, noteData);

        addNote(title, uploadedImageURL, content);

        // Reset form fields
        setTitle('');
        setContent('');
        setImg(null);
        setImageURL(null);
        setScheduleTime(null);
        setIsOpen(false);
    };

    const handleCancel = () => {
        setTitle('');
        setContent('');
        setImg(null);
        setImageURL(null);
        setScheduleTime(null);
        setIsOpen(false);
    };

    const addImage = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            setImg(file);
            setImageURL(URL.createObjectURL(file));
        }
    };

    return (
        <div className={`mx-auto mt-5 p-6 rounded-lg shadow-lg relative bg-yellow-500 ${isOpen ? 'w-96' : 'w-80'} ${isOpen ? 'h-auto' : 'h-auto'}`}>
            <input
                className="w-full bg-white dark:bg-gray-100 p-3 rounded resize-none focus:outline-none text-black"
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onClick={() => setIsOpen(true)}
            />

            {isOpen && (
                <>
                    <textarea
                        className="w-full bg-white dark:bg-gray-100 mt-2 p-2 rounded resize-none focus:outline-none text-black"
                        rows={isOpen ? 4 : 1}
                        placeholder="Add Description..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    {imageURL && (
                        <div className="mt-2">
                            <img src={imageURL} alt="Preview" className="w-full rounded" />
                        </div>
                    )}

                    {/* Photos & DateTime */}
                    <div className="flex items-center mt-3 flex-col space-x-4">
                        <div className="flex space-x-4 items-center">
                            <label className="cursor-pointer">
                                <input type="file" accept="image/*" onChange={addImage} className="hidden" />
                                <IconPhoto className="black dark:text-white" />
                            </label>
                            <SimpleDateTimePicker onDateTimeChange={handleDateTimeChange} />
                        </div>

                        <div className="flex-grow"></div> {/* This div pushes the buttons to the bottom */}

                        <div className="flex justify-end w-full mt-4 pr-4"> {/* w-full ensures the buttons are aligned right */}
                            <button onClick={handleSave} className="text-black dark:text-white bg-transparent border-none">
                                Add
                            </button>
                            <button onClick={handleCancel} className="text-black dark:text-white bg-transparent border-none ml-2">
                                Cancel
                            </button>
                        </div>
                    </div>

                </>
            )}
        </div>
    );
};

export default AddNotes;
