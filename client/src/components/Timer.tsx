'use client';

import { useEffect, useState } from 'react';

interface TimerProps {
  isActive: boolean;
  onTimeUpdate?: (time: string) => void;
  className?: string;
}

export default function Timer({ isActive, onTimeUpdate, className = "" }: TimerProps) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        setSeconds(prevSeconds => {
          const newSeconds = prevSeconds + 1;
          const timeString = formatTime(newSeconds);
          if (onTimeUpdate) {
            onTimeUpdate(timeString);
          }
          return newSeconds;
        });
      }, 1000);
    } else {
      setSeconds(0);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, onTimeUpdate]);

  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <span className={className}>
      {formatTime(seconds)}
    </span>
  );
}
