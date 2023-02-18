import React from 'react';

const Chord = ({ fretboardWidth, fretboardHeight, numFrets, strings, chord }) => {
  const stringSpacing = 20; // spacing between strings
  const fretSpacing = 30; // spacing between frets
  const nutWidth = 5; // width of the nut
  const fretWidth = 2; // width of each fret
  const fretHeight = 25; // height of each fret
  const stringCount = strings.length; // number of strings

  const width = fretboardWidth || (numFrets + 1) * fretSpacing + nutWidth; // total width of fretboard
  const height = fretboardHeight || stringCount * stringSpacing; // total height of fretboard

  // calculate positions of the notes in the chord
  const chordNotes = chord.notes.map(note => {
    const stringIndex = strings.indexOf(note.string);
    const fretIndex = note.fret;

    if (stringIndex === -1 || fretIndex > numFrets) {
      // ignore notes that are outside the bounds of the fretboard
      return null;
    }

    return {
      x: fretIndex * fretSpacing + nutWidth,
      y: stringIndex * stringSpacing + stringSpacing / 2
    };
  }).filter(note => note !== null);

  const renderChordNotes = () => {
    return chordNotes.map((note, index) => (
      <circle
        key={index}
        cx={note.x}
        cy={note.y}
        r={fretHeight / 3}
        fill="black"
      />
    ));
  };

  return (
    <svg width={width} height={height} style={{border: '1px solid black'}}>
      <rect x={0} y={0} width={width} height={height} fill="white" />
      {renderChordNotes()}
      <rect x={0} y={0} width={width} height={height} fill="none" stroke="black" strokeWidth="2" />
      {strings.map((string, index) => (
        <line
          key={index}
          x1={nutWidth}
          y1={index * stringSpacing + stringSpacing / 2}
          x2={width - fretSpacing / 2}
          y2={index * stringSpacing + stringSpacing / 2}
          stroke="black"
          strokeWidth="1"
        />
      ))}
      {Array.from({ length: numFrets + 1 }).map((_, index) => {
        const x = index * fretSpacing + nutWidth;
        return (
          <g key={index}>
            <rect
              x={x - fretWidth / 2}
              y={0}
              width={fretWidth}
              height={height}
              fill="white"
            />
            {index > 0 && (
              <line
                x1={x}
                y1={0}
                x2={x}
                y2={height}
                stroke="black"
                strokeWidth="1"
              />
            )}
          </g>
        );
      })}
    </svg>
  );
};

export default Chord;
