import React from 'react';

type NoteItemProps = {
    title: string;
    content: string;
    imageUrl?: string | null;
};

const NoteItem: React.FC<NoteItemProps> = ({ title, content, imageUrl }) => {
    return (
        <div className="mx-auto mt-5 p-6 rounded-lg shadow-lg relative bg-yellow-500 w-96 h-auto">
            <button className="absolute top-1 right-1 text-gray-900" onClick={() => console.log('Pin note')}>
                📌
            </button>
            <h3 className="w-full bg-gray-100 mt-2 p-2 rounded resize-none focus:outline-none text-black">
                {title}
            </h3>
            <p className="w-full bg-gray-100 mt-2 p-2 rounded resize-none focus:outline-none text-black">
                {content}
            </p>
            {imageUrl && <img src={imageUrl} alt={title} className="w-full mt-2 rounded-lg" />}
        </div>
    );
};

export default NoteItem;
