
import React from 'react';

interface CircularProgressProps {
  percentage: number;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({ percentage }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const getStrokeColor = () => {
    if (percentage < 40) return '#f87171'; // red-400
    if (percentage < 70) return '#facc15'; // yellow-400
    return '#4ade80'; // green-400
  };

  return (
    <svg className="w-full h-full" viewBox="0 0 120 120">
      <circle
        className="text-slate-700"
        strokeWidth="10"
        stroke="currentColor"
        fill="transparent"
        r={radius}
        cx="60"
        cy="60"
      />
      <circle
        strokeWidth="10"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        stroke={getStrokeColor()}
        fill="transparent"
        r={radius}
        cx="60"
        cy="60"
        transform="rotate(-90 60 60)"
        style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
      />
    </svg>
  );
};