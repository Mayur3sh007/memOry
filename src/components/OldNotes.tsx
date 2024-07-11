import React, { useEffect, useState } from 'react';
import { useUser } from '@/providers/UserContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Avatar from '@mui/material/Avatar';

type Note = {
  id: string;
  Title: string;
  Content: string;
  ImageURL: string | null;
  CreatedAt: string;
};

const OldNotes: React.FC = () => {
  const { uid, username, avatarURL } = useUser();
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
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
        console.error('Error fetching notes: ', error);
      }
    };

    fetchNotes();
  }, [uid]);

  return (
    <div>
      {notes.length > 0 ? (
        notes.map(note => (
          <Card key={note.id} sx={{ maxWidth: 345, marginBottom: 2 }}>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: red[500] }} aria-label="user">
                  {avatarURL ? (
                    <img src={avatarURL} alt="Avatar" />
                  ) : (
                    username?.charAt(0).toUpperCase()
                  )}
                </Avatar>
              }
              action={
                <IconButton aria-label="settings">
                  <MoreVertIcon />
                </IconButton>
              }
              title={note.Title}
              subheader={new Date(note.CreatedAt).toLocaleDateString()}
            />
            {note.ImageURL && (
              <CardMedia
                component="img"
                height="194"
                image={note.ImageURL}
                alt={note.Title}
              />
            )}
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {note.Content}
              </Typography>
            </CardContent>
            <CardActions disableSpacing>
              <IconButton aria-label="add to favorites">
                <FavoriteIcon />
              </IconButton>
              <IconButton aria-label="share">
                <ShareIcon />
              </IconButton>
            </CardActions>
          </Card>
        ))
      ) : (
        <Typography variant="body1">No notes found</Typography>
      )}
    </div>
  );
};

export default OldNotes;