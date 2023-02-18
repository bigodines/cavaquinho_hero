import React from 'react';

const FretboardY =  ({ numFrets, strings }) => {
  const stringSpacing = 30; // spacing between strings
  const fretSpacing = 20; // spacing between frets
  const nutWidth = 5; // width of the nut
  const fretWidth = 25; // width of each fret
  const fretHeight = 2; // height of each fret
  const stringCount = strings.length; // number of strings

  const height = (numFrets + 1) * fretSpacing + nutWidth; // total height of fretboard
  const width = stringCount * stringSpacing; // total width of fretboard

  const renderStrings = () => {
    return strings.map((string, index) => {
      const x = index * stringSpacing + stringSpacing / 2;

      return (
        <line
          key={index}
          x1={x}
          y1={nutWidth}
          x2={x}
          y2={height - fretSpacing / 2}
          stroke="black"
          strokeWidth="1"
        />
      );
    });
  };

  const renderFrets = () => {
    const frets = [];

    for (let i = 0; i <= numFrets; i++) {
      const y = i * fretSpacing + nutWidth;
      frets.push(
        <rect
          key={i}
          x={0}
          y={y - fretHeight / 2}
          width={width}
          height={fretHeight}
          fill="white"
        />
      );

      if (i === 0) {
        frets.push(
          <rect
            key={`nut`}
            x={0}
            y={0}
            width={width}
            height={nutWidth}
            fill="black"
          />
        );
      } else {
        frets.push(
          <line
            key={`fret-${i}`}
            x1={0}
            y1={y}
            x2={width}
            y2={y}
            stroke="black"
            strokeWidth="1"
          />
        );
      }
    }

    return frets;
  };

  return (
    <svg width={width} height={height} style={{ border: '1px solid black' }}>
      {renderFrets()}
      {renderStrings()}
    </svg>
  );
};

export default FretboardY;
