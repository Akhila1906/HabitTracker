import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";


const WORK_DURATION = 25 * 60; // 25 minutes
const BREAK_DURATION = 5 * 60; // 5 minutes

const Pomodoro = () => {
  const [time, setTime] = useState(WORK_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [cycles, setCycles] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  useEffect(() => {
    if (time === 0) {
      if (!isBreak) {
        setCycles((c) => c + 1);
        setTime(BREAK_DURATION);
        setIsBreak(true);
      } else {
        setTime(WORK_DURATION);
        setIsBreak(false);
      }
      setIsRunning(false);
    }
  }, [time, isBreak]);

  const resetTimer = () => {
    setTime(isBreak ? BREAK_DURATION : WORK_DURATION);
    setIsRunning(false);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6 bg-background text-foreground">
      <h1 className="text-4xl font-bold">
        {isBreak ? "Break Time 🍵" : "Focus Time 💻"}
      </h1>
      <div className="text-6xl font-mono">{formatTime(time)}</div>
      <div className="flex gap-4">
        <Button onClick={() => setIsRunning(!isRunning)}>
          {isRunning ? "Pause" : "Start"}
        </Button>
        <Button variant="outline" onClick={resetTimer}>
          Reset
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Completed Pomodoros: {cycles}
      </p>
    </div>
  );
};

export default Pomodoro;
