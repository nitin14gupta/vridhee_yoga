'use client';

import { useEffect, useState, useRef } from 'react';

interface SmartTimerProps {
  isActive: boolean;
  matchPercentage: number;
  onTimeUpdate: (time: string, totalCorrectTime: number) => void;
  className?: string;
}

export default function SmartTimer({ 
  isActive, 
  matchPercentage, 
  onTimeUpdate, 
  className = "" 
}: SmartTimerProps) {
  const [seconds, setSeconds] = useState(0);
  const [totalCorrectSeconds, setTotalCorrectSeconds] = useState(0);
  const [isPoseCorrect, setIsPoseCorrect] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateRef = useRef<number>(0);

  // Check if pose is correct (≥90% match)
  useEffect(() => {
    const correct = matchPercentage >= 90;
    setIsPoseCorrect(correct);
  }, [matchPercentage]);

  // Timer logic
  useEffect(() => {
    if (isActive && isPoseCorrect) {
      // Start timer when pose is correct
      intervalRef.current = setInterval(() => {
        setSeconds(prev => {
          const newSeconds = prev + 1;
          setTotalCorrectSeconds(prevTotal => prevTotal + 1);
          return newSeconds;
        });
      }, 1000);
    } else {
      // Pause timer when pose is incorrect or inactive
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isPoseCorrect]);

  // Reset timer when session is stopped
  useEffect(() => {
    if (!isActive) {
      setSeconds(0);
      setTotalCorrectSeconds(0);
    }
  }, [isActive]);

  // Format time helper
  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Update parent component
  useEffect(() => {
    const currentTime = Date.now();
    if (currentTime - lastUpdateRef.current >= 100) { // Update every 100ms max
      onTimeUpdate(formatTime(seconds), totalCorrectSeconds);
      lastUpdateRef.current = currentTime;
    }
  }, [seconds, totalCorrectSeconds, onTimeUpdate]);

  return (
    <span className={className}>
      {formatTime(seconds)}
    </span>
  );
}
