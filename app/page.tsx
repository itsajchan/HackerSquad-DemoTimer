"use client";

import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [part1Duration, setPart1Duration] = useState(300); // 5 minutes in seconds
  const [part2Duration, setPart2Duration] = useState(120); // 2 minutes in seconds
  const [timeRemaining, setTimeRemaining] = useState(part1Duration);
  const [isRunning, setIsRunning] = useState(false);
  const [currentPart, setCurrentPart] = useState(1); // 1 for DING, 2 for Applause

  // Refs for audio elements - you'll need to provide actual audio files
  const dingSoundRef = useRef<HTMLAudioElement>(null);
  const applauseSoundRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!isRunning) return;

    if (timeRemaining <= 0) {
      if (currentPart === 1) {
        // Play DING sound
        dingSoundRef.current?.play();
        // alert('DING!'); // Placeholder for DING sound
        setCurrentPart(2);
        setTimeRemaining(part2Duration);
      } else if (currentPart === 2) {
        // Play Applause sound
        applauseSoundRef.current?.play();
        // alert('Time for Applause!'); // Placeholder for Applause sound
        setIsRunning(false);
        // Optionally reset to part 1 for the next speaker
        // setCurrentPart(1);
        // setTimeRemaining(part1Duration);
      }
      return;
    }

    const timerId = setInterval(() => {
      setTimeRemaining((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [isRunning, timeRemaining, currentPart, part1Duration, part2Duration]);

  const handleStartPause = () => {
    if (isRunning) {
      setIsRunning(false);
    } else {
      if (timeRemaining === 0 && currentPart === 2) { // If timer ended, reset before starting
        setCurrentPart(1);
        setTimeRemaining(part1Duration);
      }
      setIsRunning(true);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentPart(1);
    setTimeRemaining(part1Duration);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-12 bg-gray-900 text-white font-sans">
      {/* Audio elements (hidden) */}
      <audio ref={dingSoundRef} src="/Ding.mp3" preload="auto"></audio>
      <audio ref={applauseSoundRef} src="/Applause.mp3" preload="auto"></audio>

      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h1 className="text-4xl font-bold text-center mb-6 text-teal-400">
          HackerSquad Timer
        </h1>

        <div className="mb-6 space-y-4">
          <div>
            <label htmlFor="part1Duration" className="block text-sm font-medium text-gray-400 mb-1">
              Part 1 Duration (seconds - DING):
            </label>
            <input
              type="number"
              id="part1Duration"
              value={part1Duration}
              onChange={(e) => setPart1Duration(Math.max(0, parseInt(e.target.value, 10) || 0))}
              disabled={isRunning}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
            />
          </div>
          <div>
            <label htmlFor="part2Duration" className="block text-sm font-medium text-gray-400 mb-1">
              Part 2 Duration (seconds - Applause):
            </label>
            <input
              type="number"
              id="part2Duration"
              value={part2Duration}
              onChange={(e) => setPart2Duration(Math.max(0, parseInt(e.target.value, 10) || 0))}
              disabled={isRunning}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
            />
          </div>
        </div>

        <div className="text-center mb-8">
          <p className="text-lg text-gray-300 mb-1">
            Current Part: {currentPart === 1 ? '1 (Presentation)' : '2 (Q&A / Applause Cue)'}
          </p>
          <div className="text-7xl font-mono font-bold text-teal-400 tracking-wider">
            {formatTime(timeRemaining)}
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={handleStartPause}
            className={`px-8 py-3 rounded-md text-lg font-semibold transition-colors
                        ${isRunning ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'}
                        text-white w-32`}
          >
            {isRunning ? 'Pause' : (timeRemaining === 0 && currentPart === 2) ? 'Restart' : 'Start'}
          </button>
          <button
            onClick={handleReset}
            disabled={isRunning && timeRemaining > 0 && currentPart === 1} // Disable reset unless paused or part 1 not started
            className="px-8 py-3 rounded-md text-lg font-semibold bg-red-500 hover:bg-red-600 text-white transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed w-32"
          >
            Reset
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-8">
          {currentPart === 1 ? 'Timer will DING then switch to Part 2.' : 'Timer will prompt for APPLAUSE then stop.'}
        </p>
      </div>
    </main>
  );
}
