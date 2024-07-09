import React, { useState } from 'react';
import { Card, CardContent, CardActions, TextField, Button, IconButton } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PaletteIcon from '@mui/icons-material/Palette';
import ArchiveIcon from '@mui/icons-material/Archive';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import PushPinIcon from '@mui/icons-material/PushPin';

const AddNote = () => {
    const [note, setNote] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const handleChange = (e : any) => {
        setNote(e.target.value);
    };

    const handleSave = () => {
        // Add your save logic here
        console.log('Note saved:', note);
        setNote('');
        setIsOpen(false);
    };

    const handleCancel = () => {
        setNote('');
        setIsOpen(false);
    };

    return (
        <Card className="bg-yellow-500 shadow-lg" sx={{ maxWidth: 600, margin: '20px auto', padding: '10px', position: 'relative' }}>
            <CardContent>
                <IconButton
                    className="text-gray-900 dark:text-gray-100 "
                    sx={{ position: 'absolute', top: 0, right: 0 }}
                    onClick={() => console.log('Pin note')}
                >
                    <PushPinIcon />
                </IconButton>
                <TextField
                    fullWidth
                    multiline
                    rows={isOpen ? 4 : 1}
                    placeholder="Take a note..."
                    variant="outlined"
                    value={note}
                    onChange={handleChange}
                    onClick={() => setIsOpen(true)}
                    className="bg-gray-100 mt-3"
                />
            </CardContent>
            {isOpen && (
                <CardActions className="flex justify-between">
                    <div>
                        <IconButton color="primary" onClick={() => console.log('Set reminder')} className="text-gray-900 dark:text-gray-100  ">
                            <AccessTimeIcon />
                        </IconButton>
                        <IconButton color="primary" onClick={() => console.log('Add collaborator')} className="text-gray-900 dark:text-gray-100  ">
                            <PersonAddIcon />
                        </IconButton>
                        <IconButton color="primary" onClick={() => console.log('Change color')} className="text-gray-900 dark:text-gray-100  ">
                            <PaletteIcon />
                        </IconButton>
                        <IconButton color="primary" component="label" className="text-gray-900 dark:text-gray-100  ">
                            <AddPhotoAlternateIcon />
                            <input hidden accept="image/*" type="file" />
                        </IconButton>
                        <IconButton color="primary" onClick={() => console.log('Archive note')} className="text-gray-900 dark:text-gray-100  ">
                            <ArchiveIcon />
                        </IconButton>
                        <IconButton color="primary" onClick={() => console.log('More options')} className="text-gray-900 dark:text-gray-100  ">
                            <MoreVertIcon />
                        </IconButton>
                        <IconButton color="secondary" onClick={() => console.log('Delete note')} className="text-gray-900 dark:text-gray-100  ">
                            <DeleteIcon />
                        </IconButton>
                    </div>
                    <div>
                        <Button
                            startIcon={<SaveIcon />}
                            onClick={handleSave}
                            className="text-gray-900 dark:text-gray-100 border-none bg-transparent"
                        >
                            Save
                        </Button>
                        <Button
                            startIcon={<CloseIcon />}
                            onClick={handleCancel}
                            className="text-gray-900 dark:text-gray-100 border-none bg-transparent"
                        >
                            Cancel
                        </Button>
                    </div>
                </CardActions>
            )}
        </Card>
    );
};

export default AddNote;
