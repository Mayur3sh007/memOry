import React, { useState } from 'react';
import { IconCalendar, IconClock } from '@tabler/icons-react';

const SimpleDateTimePicker = ({ onDateTimeChange } : { onDateTimeChange: (dateTime: Date) => void }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleDateChange = (e : any) => {
    setDate(e.target.value);
    onDateTimeChange && onDateTimeChange(new Date(`${e.target.value} ${time}`));
  };

  const handleTimeChange = (e : any) => {
    setTime(e.target.value);
    onDateTimeChange && onDateTimeChange(new Date(`${date} ${e.target.value}`));
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <input
          type="date"
          value={date}
          onChange={handleDateChange}
          className='bg-gray-200 rounded-md text-black'
        />
      </div>
      <div className="relative">
        <input
          type="time"
          value={time}
          onChange={handleTimeChange}
          className="pl-8 pr-2 py-1 bg-gray-200 rounded text-sm text-black"
        />
      </div>
    </div>
  );
};

export default SimpleDateTimePicker;