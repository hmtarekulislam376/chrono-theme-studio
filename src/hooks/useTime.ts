import { useState, useEffect } from 'react';

export const useTime = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return {
      hours: date.getHours().toString().padStart(2, '0'),
      minutes: date.getMinutes().toString().padStart(2, '0'),
      seconds: date.getSeconds().toString().padStart(2, '0'),
      period: date.getHours() >= 12 ? 'PM' : 'AM',
      hours12: (date.getHours() % 12 || 12).toString().padStart(2, '0')
    };
  };

  return {
    time,
    ...formatTime(time)
  };
};