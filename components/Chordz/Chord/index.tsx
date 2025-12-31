import React from 'react';
import Neck from './Neck';
import Dot from './Dot';
import Barre from './Barre';
import type { ChordData, Instrument } from './types';

interface ChordProps {
  chord: ChordData | null;
  instrument: Instrument;
  lite?: boolean;
}

const onlyDots = (chord: ChordData) =>
  chord.frets
    .map((f, index) => ({ position: index, value: f }))
    .filter((f) => !chord.barres || chord.barres.indexOf(f.value) === -1);

const Chord: React.FC<ChordProps> = ({ chord, instrument, lite = false }) => {
  // Calculate viewBox height based on fretsOnChord (12px per fret + padding)
  const viewBoxHeight = (instrument.fretsOnChord || 5) * 12 + 40;
  
  return chord ? (
    <svg
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMinYMin meet"
      viewBox={`0 0 80 ${viewBoxHeight}`}
    >
      <g transform="translate(13, 13)">
        <Neck
          tuning={instrument.tunings.standard}
          strings={instrument.strings}
          frets={chord.frets}
          capo={chord.capo}
          fretsOnChord={instrument.fretsOnChord}
          baseFret={chord.baseFret || 1}
          lite={lite}
        />

        {chord.barres &&
          chord.barres.map((barre, index) => (
            <Barre
              key={index}
              capo={index === 0 && chord.capo}
              barre={barre}
              finger={chord.fingers && chord.fingers[chord.frets.indexOf(barre)]}
              frets={chord.frets}
              lite={lite}
            />
          ))}

        {onlyDots(chord).map((fret) => (
          <Dot
            key={fret.position}
            string={instrument.strings - fret.position}
            fret={fret.value}
            strings={instrument.strings}
            finger={chord.fingers && chord.fingers[fret.position]}
            lite={lite}
          />
        ))}
      </g>
    </svg>
  ) : null;
};

export default Chord;
