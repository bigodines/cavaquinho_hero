import React from 'react';

interface DotProps {
  string: number;
  fret: number;
  finger?: number;
  strings: number;
  lite?: boolean;
}

const positions = {
  fret: [-4, 6.5, 18, 30, 42, 54, 66, 78, 90, 114, 126, 138],
  finger: [-3, 8, 19.5, 31.5, 43.5],
};

const stringPositions: Record<number, number[]> = {
  4: [50, 40, 30, 20, 10],
  5: [55, 45, 35, 25, 15, 5],
  6: [50, 40, 30, 20, 10, 0],
};

const getStringPosition = (string: number, strings: number): number =>
  stringPositions[strings]?.[string] ?? 0;

const radius = {
  open: 2,
  fret: 4,
};

const Dot: React.FC<DotProps> = ({ string, fret, finger, strings, lite = false }) =>
  fret === -1 ? (
    <text
      fontSize="0.7rem"
      fill="#444"
      fontFamily="Verdana"
      textAnchor="middle"
      x={getStringPosition(string, strings)}
      y="-2"
    >
      x
    </text>
  ) : (
    <g>
      <circle
        strokeWidth="0.25"
        stroke="#444"
        fill={fret === 0 ? 'transparent' : '#444'}
        cx={getStringPosition(string, strings)}
        cy={positions.fret[fret]}
        r={fret === 0 ? radius.open : radius.fret}
      />
      {!lite && finger && finger > 0 && (
        <text
          fontSize="3pt"
          fontFamily="Verdana"
          textAnchor="middle"
          fill="white"
          x={getStringPosition(string, strings)}
          y={positions.finger[fret]}
        >
          {finger}
        </text>
      )}
    </g>
  );

export default Dot;
