import React from 'react';

interface NeckProps {
  tuning: string[];
  frets: number[];
  strings: number;
  fretsOnChord: number;
  baseFret?: number;
  capo?: boolean;
  lite?: boolean;
}

const offsets: Record<number, { x: number; y: number; length: number }> = {
  4: { x: 10, y: 10, length: 40 },
  5: { x: 5, y: 5, length: 45 },
  6: { x: 0, y: 0, length: 50 },
};

const getNeckHorizonalLine = (pos: number, strings: number): string =>
  `M ${offsets[strings]?.x ?? 0} ${12 * pos} H ${offsets[strings]?.length ?? 50}`;

const getNeckVerticalLine = (pos: number, strings: number): string =>
  `M ${(offsets[strings]?.y ?? 0) + pos * 10} 0 V 480`;

const getNeckPath = (strings: number, fretsOnChord: number): string =>
  Array.from({ length: fretsOnChord + 1 })
    .map((_, pos) => getNeckHorizonalLine(pos, strings))
    .join(' ')
    .concat(
      Array.from({ length: strings })
        .map((_, pos) => getNeckVerticalLine(pos, strings))
        .join(' ')
    );

const getBarreOffset = (
  strings: number,
  frets: number[],
  baseFret: number,
  capo: boolean
): number =>
  strings === 6
    ? frets[0] === 1 || capo
      ? baseFret > 9
        ? -12
        : -11
      : baseFret > 9
        ? -10
        : -7
    : frets[0] === 1 || capo
      ? baseFret > 9
        ? -1
        : 0
      : baseFret > 9
        ? 3
        : 4;

const Neck: React.FC<NeckProps> = ({
  tuning,
  frets,
  strings,
  fretsOnChord,
  baseFret = 1,
  capo = false,
  lite = false,
}) => {
  const offset = offsets[strings] ?? offsets[6];

  return (
    <g>
      <path
        stroke="#444"
        strokeWidth="0.25"
        strokeLinecap="square"
        strokeLinejoin="miter"
        d={getNeckPath(strings, fretsOnChord)}
      />
      {baseFret === 1 ? (
        <path
          stroke="#444"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          d={`M ${offset.x} 0 H ${offset.length}`}
        />
      ) : (
        <text
          fontSize="0.25rem"
          fill="#444"
          fontFamily="Verdana"
          x={getBarreOffset(strings, frets, baseFret, capo)}
          y="8"
        >
          {baseFret}fr
        </text>
      )}
      {!lite && (
        <g>
          {tuning.slice().map((note, index) => (
            <text
              key={index}
              fontSize="0.3rem"
              fill="#444"
              fontFamily="Verdana"
              textAnchor="middle"
              x={offset.x + index * 10}
              y="-7"
            >
              {note}
            </text>
          ))}
        </g>
      )}
    </g>
  );
};

export default Neck;
