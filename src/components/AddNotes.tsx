import React, { useState, ChangeEvent } from 'react';
import { useNotes } from '@/providers/NotesContext';

const AddNotes = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [img, setImg] = useState<File | null>(null); // State to hold the selected image file

    const [isOpen, setIsOpen] = useState(false);
    const { addNote } = useNotes();

    const handleSave = () => {
        addNote(title, img, content);

        // Reset form fields
        setTitle('');
        setContent('');
        setImg(null);
        setIsOpen(false);
    };

    const addImage = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            setImg(file);
        }
    };

    const handleCancel = () => {
        setTitle('');
        setContent('');
        setImg(null);
        setIsOpen(false);
    };

    return (
        <div className={`mx-auto mt-5 p-6 rounded-lg shadow-lg relative bg-yellow-500 ${isOpen ? 'w-96' : 'w-80'} ${isOpen ? 'h-auto' : 'h-24'}`}>
            <button className="absolute top-1 right-1 text-gray-900" onClick={() => console.log('Pin note')}>
                📌
            </button>

            {isOpen && (
                <input
                    className="w-full bg-gray-100 mt-2 p-2 rounded resize-none focus:outline-none text-black"
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            )}
            <textarea
                className="w-full bg-gray-100 mt-2 p-2 rounded resize-none focus:outline-none text-black"
                rows={isOpen ? 4 : 1}
                placeholder="Take a note..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onClick={() => setIsOpen(true)}
            />
            {isOpen && (
                <div className="flex justify-between mt-3">
                    <div className="flex space-x-2 text-gray-900">
                        <button onClick={() => console.log('Set reminder')}>⏰</button>
                        <button onClick={() => console.log('Add collaborator')}>👥</button>
                        <button onClick={() => console.log('Change color')}>🎨</button>
                        {/* Clickable image icon */}
                        <label className="cursor-pointer">
                            <input type="file" accept="image/*" hidden onChange={addImage} />
                            📷
                        </label>
                        <button onClick={() => console.log('Archive note')}>🗄️</button>
                        <button onClick={() => console.log('More options')}>⋮</button>
                        <button onClick={() => console.log('Delete note')}>🗑️</button>
                    </div>
                    <div>
                        <button onClick={handleSave} className="text-gray-900 bg-transparent border-none">
                            Add
                        </button>
                        <button onClick={handleCancel} className="text-gray-900 bg-transparent border-none ml-2">
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddNotes;
