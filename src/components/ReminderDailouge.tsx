import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

type ReminderDialogProps = {
  open: boolean;
  onClose: () => void;
  onSetReminder: (time: string) => void;
};

const ReminderDialog: React.FC<ReminderDialogProps> = ({ open, onClose, onSetReminder }) => {
  const [reminderTime, setReminderTime] = useState('');

  const handleSetReminder = () => {
    onSetReminder(reminderTime);
    setReminderTime('');
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Set Reminder</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="reminder-time"
          label="Reminder Time"
          type="datetime-local"
          fullWidth
          variant="standard"
          value={reminderTime}
          onChange={(e) => setReminderTime(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSetReminder}>Set Reminder</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReminderDialog;