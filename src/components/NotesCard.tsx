import React, { ChangeEvent, useState } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { CheckIcon, PinIcon, PinOffIcon } from 'lucide-react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { IconPhoto } from '@tabler/icons-react';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '@/config/firebase';
import ReminderDialog from './ReminderDailouge';
import { useUser } from '@/providers/UserContext';
import { NotificationAdd } from '@mui/icons-material';

type Note = {
  id: string;
  Title: string;
  Content: string;
  ImageURL: string | null;
  CreatedAt: string;
  reminderTime?: string;
  scheduleTime: string;
  status: 'pending' | 'passed' | 'completed';
};

type NotesCardProps = {
  notes: Note[];
  withImage: boolean;
  deleteNote: (id: string) => void;
  editNote: (id: string, title: string, content: string, image: string | null) => void;
  pinNote: (id: string) => void;
  unpinNote: (id: string) => void;
  isPinned: (id: string) => boolean;
  setReminder: (id: string, time: string) => void;
  handleCompleteTask: (id: string) => void; // Add this line
};


const NotesCard: React.FC<NotesCardProps> = ({ notes, withImage, deleteNote, editNote, pinNote, unpinNote, isPinned, setReminder, handleCompleteTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [img, setImg] = useState<File | null>(null);
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [isReminderDialogOpen, setIsReminderDialogOpen] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const { uid } = useUser();

  const handleEditClick = (note: Note) => {
    setEditingNote(note);
    setEditTitle(note.Title);
    setEditContent(note.Content);
    setIsEditing(true);
  };

  const handleCloseEdit = () => {
    setIsEditing(false);
    setEditingNote(null);
    setImg(null);
    setImageURL(null);
  };

  const handleSaveEdit = async () => {
    let uploadedImageURL = null;

    //Do all this only if user has selected a new image
    if (editingNote) {
      if (img) {
        if (img) {
          const imageRef = ref(storage, `notes/${uid}/${Date.now()}_${img.name}`);
          await uploadBytes(imageRef, img);
          uploadedImageURL = await getDownloadURL(imageRef);
        }
      }
      //if user has not selected a new image, use the old one from the note Pookie
      editNote(editingNote.id, editTitle, editContent, uploadedImageURL ? uploadedImageURL : editingNote.ImageURL);
      handleCloseEdit();
    }
  };

  const addImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setImg(file);
      setImageURL(URL.createObjectURL(file));
    }
  };

  const handleDeleteNote = async (id: string) => {
    deleteNote(id);
  };

  const handleReminderClick = (noteId: string) => {
    setSelectedNoteId(noteId);
    setIsReminderDialogOpen(true);
  };

  const handleSetReminder = (time: string) => {
    if (selectedNoteId) {
      setReminder(selectedNoteId, time);
    }
    setIsReminderDialogOpen(false);
  };

  return (
    <>
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {notes.length > 0 ? (
          notes.map(note =>
            !isPinned(note.id) ? (
              <Card
                key={note.id}
                sx={{
                  width: '300px',
                  height: withImage ? 'auto' : '300px',
                  display: 'flex',
                  flexDirection: 'column',
                  marginBottom: '16px'
                }}
                className='bg-gray-500 dark:bg-yellow-400'
              >
                <CardHeader
                  className='font-bold text-xl text-yellow-400 dark:text-white'
                  title={note.Title}
                  subheader={`Scheduled for ${new Date(note.scheduleTime).toLocaleDateString()}`}

                />
                {note.ImageURL && (
                  <CardMedia
                    component="div"
                    sx={{
                      height: 0,
                      paddingTop: '100.25%',
                      backgroundRepeat: 'no-repeat',
                      paddingInline: '1px',
                      backgroundImage: `url(${note.ImageURL})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                )}

                <CardContent sx={{ flexGrow: 1, overflowY: 'auto' }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    className='text-justify overflow-y-auto break-words whitespace-normal'
                    sx={{
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                      hyphens: 'auto',
                      maxHeight: '150px'
                    }}
                  >
                    {note.Content}
                  </Typography>
                </CardContent>

                <CardActions disableSpacing className='flex justify-end'>
                  {note.status === 'pending' && (
                    <>
                      <IconButton aria-label="complete" onClick={() => handleCompleteTask(note.id)}>
                        <CheckIcon className='text-yellow-400 dark:text-gray-100' />
                      </IconButton>

                      <IconButton aria-label="edit" onClick={() => handleEditClick(note)}>
                        <EditIcon className='text-yellow-400 dark:text-gray-100' />
                      </IconButton>
                      <IconButton aria-label="reminder" onClick={() => handleReminderClick(note.id)}>
                        <NotificationAdd className='text-yellow-400 dark:text-gray-100' />
                      </IconButton>
                    </>

                  )}
                      <IconButton aria-label="delete" onClick={() => handleDeleteNote(note.id)}>
                        <DeleteIcon className='text-yellow-400 dark:text-gray-100' />
                      </IconButton>

                  {note.status === 'pending' && (
                    isPinned(note.id) ? (
                      <IconButton aria-label="unpin" onClick={() => unpinNote(note.id)}>
                        <PinOffIcon className='text-yellow-400 dark:text-gray-100' />
                      </IconButton>
                    ) : (
                      <IconButton aria-label="pin" onClick={() => pinNote(note.id)}>
                        <PinIcon className='text-yellow-400 dark:text-gray-100' />
                      </IconButton>
                    )
                  )}



                </CardActions>
              </Card>
            ) : null
          )
        ) : null}
      </div>


      {/* Edit Note Dialog */}
      <Dialog open={isEditing} onClose={handleCloseEdit}>
        <DialogTitle>Edit Note</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            type="text"
            fullWidth
            variant="standard"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Content"
            type="text"
            fullWidth
            variant="standard"
            multiline
            rows={4}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />


          <label className="cursor-pointer">
            <input type="file" accept="image/*" hidden onChange={addImage} />
            <IconPhoto />
          </label>
          {imageURL && (
            <div className="mt-2">
              <img src={imageURL} alt="Preview" className="w-full rounded" />
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Cancel</Button>
          <Button onClick={handleSaveEdit}>Save</Button>
        </DialogActions>
      </Dialog>

      <ReminderDialog
        open={isReminderDialogOpen}
        onClose={() => setIsReminderDialogOpen(false)}
        onSetReminder={handleSetReminder}
      />
    </>
  );
};

export default NotesCard;