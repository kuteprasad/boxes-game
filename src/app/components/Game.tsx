"use client";

import React, { useState } from 'react';

interface Point {
  row: number;
  col: number;
}

const Grid: React.FC<{
  size: number;
  onClick: (point: Point) => void;
  connections: Record<string, boolean>;
  drawnLines: Record<string, boolean>;
}> = ({ size, onClick, connections, drawnLines }) => {
  const points = Array.from({ length: size }, (_, row) => 
    Array.from({ length: size }, (_, col) => ({ row, col }))
  );

  return (
    <div className="grid grid-cols-4 gap-1 relative">
      {points.map((row, rowIndex) =>
        row.map((point, colIndex) => {
          const pointKey = `${point.row}-${point.col}`;
          return (
            <div
              key={pointKey}
              className={`w-8 h-8 rounded-full border flex items-center justify-center cursor-pointer 
                          ${connections[pointKey] ? 'bg-blue-400' : 'bg-gray-300'}`}
              onClick={() => onClick(point)}
              style={{ position: 'relative' }}
            >
              {connections[pointKey] && <div className="absolute text-white">🏠</div>}
            </div>
          );
        })
      )}
      {Object.keys(drawnLines).map((lineKey) => {
        const [start, end] = lineKey.split('_');
        const [startRow, startCol] = start.split('-').map(Number);
        const [endRow, endCol] = end.split('-').map(Number);

        const left = Math.min(startCol, endCol) * 2 + 8;
        const top = Math.min(startRow, endRow) * 2 + 8;
        const width = Math.abs(endCol - startCol) * 2 + 8;

        return (
          <div
            key={lineKey}
            className="absolute bg-blue-400"
            style={{
              height: '4px',
              left: `${left}px`,
              top: `${top + 24}px`, // Adjust to align with the points
              width: `${width}px`,
              position: 'absolute',
            }}
          />
        );
      })}
    </div>
  );
};

const Game: React.FC = () => {
  const [size] = useState<number>(4);
  const [connections, setConnections] = useState<Record<string, boolean>>({});
  const [drawnLines, setDrawnLines] = useState<Record<string, boolean>>({});
  const [firstPoint, setFirstPoint] = useState<Point | null>(null);
  const [turn, setTurn] = useState<'Alice' | 'Bob'>('Alice');
  const [scores, setScores] = useState<{ Alice: number; Bob: number }>({ Alice: 0, Bob: 0 });

  const handleClick = (point: Point) => {
    const pointKey = `${point.row}-${point.col}`;

    // If firstPoint is null, set it
    if (!firstPoint) {
      setFirstPoint(point);
    } else {
      // Otherwise, check if we can connect to the second point
      const secondPointKey = `${point.row}-${point.col}`;
      if (pointKey === `${firstPoint.row}-${firstPoint.col}` || connections[secondPointKey]) {
        setFirstPoint(null); // Reset if the same point or already connected
        return;
      }

      // Draw line between points
      const lineKey = `${firstPoint.row}-${firstPoint.col}_${point.row}-${point.col}`;
      setDrawnLines((prev) => ({
        ...prev,
        [lineKey]: true,
      }));

      // Connect points and check for square formation
      setConnections((prev) => {
        const newConnections = { ...prev, [pointKey]: true, [firstPoint.row + '-' + firstPoint.col]: true };
        checkSquareFormation(newConnections, point, firstPoint);
        return newConnections;
      });

      setFirstPoint(null); // Reset firstPoint after connecting
    }
  };

  const checkSquareFormation = (connections: Record<string, boolean>, point1: Point, point2: Point) => {
    // Determine if a square can be formed
    const [row1, col1] = [point1.row, point1.col];
    const [row2, col2] = [point2.row, point2.col];

    const squareFormed = (
      connections[`${row1}-${col2}`] && connections[`${row2}-${col1}`] && 
      Math.abs(row1 - row2) === 1 && Math.abs(col1 - col2) === 1
    );

    if (squareFormed) {
      setScores((prev) => ({
        ...prev,
        [turn]: prev[turn] + 1,
      }));
      // Set house on the square's position (average position)
      const houseRow = (row1 + row2) / 2;
      const houseCol = (col1 + col2) / 2;
      setConnections((prev) => ({
        ...prev,
        [`${Math.floor(houseRow)}-${Math.floor(houseCol)}`]: true,
      }));
    }

    // Switch turns
    setTurn(turn === 'Alice' ? 'Bob' : 'Alice');
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Boxes Game</h1>
      <Grid size={size} onClick={handleClick} connections={connections} drawnLines={drawnLines} />
      <div className="mt-4 text-white">
        <h2>Scores</h2>
        <p>Alice: {scores.Alice}</p>
        <p>Bob: {scores.Bob}</p>
        <p>Current Turn: {turn}</p>
      </div>
    </div>
  );
};

export default Game;
