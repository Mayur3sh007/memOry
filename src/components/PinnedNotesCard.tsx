import React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import {PinOffIcon } from 'lucide-react';


type Note = {
  id: string;
  Title: string;
  Content: string;
  ImageURL: string | null;
  CreatedAt: string;
};

type NotesCardProps = {
  notes: Note[];
  withImage: boolean;
  unpinNote: (id: string) => void;
  isPinned: (id: string) => boolean;
};

const PinnedNotesCard: React.FC<NotesCardProps> = ({ notes, withImage,unpinNote, isPinned }) => {  

  return (
    <>
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {notes.length > 0 ? (
          notes.map(note => (
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
                subheader={new Date(note.CreatedAt).toLocaleDateString()}
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

                {isPinned(note.id) ? (
                  <IconButton aria-label="unpin" onClick={() => unpinNote(note.id)}>
                    <PinOffIcon className='text-yellow-400 dark:text-gray-100' />
                  </IconButton>
                ) : (
                  null
                )}
              </CardActions>
            </Card>
          ))
        ) : (
          null
        )}
      </div>
    </>
  );
};

export default PinnedNotesCard;