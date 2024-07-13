import React, { useState, ChangeEvent } from 'react';
import { useNotes } from '@/providers/NotesContext';
import { useUser } from '@/providers/UserContext';
import { addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/config/firebase';
import { IconAlarm, IconPalette, IconPhoto, IconUsers } from '@tabler/icons-react';

const AddNotes = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [img, setImg] = useState<File | null>(null);
    const [imageURL, setImageURL] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const { uid } = useUser();
    const { addNote } = useNotes();

    const handleSave = async () => {
        if (!uid) {
            console.error("User is not logged in");
            return;
        }

        let uploadedImageURL = null;
        if (img) {
            const imageRef = ref(storage, `notes/${uid}/${Date.now()}_${img.name}`);
            await uploadBytes(imageRef, img);
            uploadedImageURL = await getDownloadURL(imageRef);
        }

        const noteData = {
            Title: title,
            Content: content,
            ImageURL: uploadedImageURL,
            userID: uid,
            CreatedAt: new Date().toISOString(),
            reminder: false,
            pinned: false,
        };
        
        const noteRef = collection(db, "Notes");
        await addDoc(noteRef, noteData);

        addNote(title, uploadedImageURL, content);
        
        // Reset form fields
        setTitle('');
        setContent('');
        setImg(null);
        setImageURL(null);
        setIsOpen(false);
    };

    const addImage = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            setImg(file);
            setImageURL(URL.createObjectURL(file));
        }
    };

    const handleCancel = () => {
        setTitle('');
        setContent('');
        setImg(null);
        setImageURL(null);
        setIsOpen(false);
    }

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
                        placeholder="Take a note..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    {imageURL && (
                        <div className="mt-2">
                            <img src={imageURL} alt="Preview" className="w-full rounded" />
                        </div>
                    )}
                    <div className="flex justify-between mt-3">
                        <div className="flex space-x-2 text-black dark:text-white">
                            <button onClick={() => console.log('Set reminder')}>
                                <IconAlarm />
                            </button>
                            <button onClick={() => console.log('Add collaborator')}>
                                <IconUsers />
                            </button>
                            <button onClick={() => console.log('Change color')}>
                                <IconPalette />
                            </button>
                            <label className="cursor-pointer">
                                <input type="file" accept="image/*" hidden onChange={addImage} />
                                <IconPhoto />
                            </label>
                        </div>
                        <div>
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
