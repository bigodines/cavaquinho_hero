import {
  dominantChord,
  harmonicMinorDiatonicScale,
  iiChord,
  majorDiatonicScale,
  subV,
} from './tonality';

describe('tonality lib', () => {
  it('generates the major diatonic scales', () => {
    let result = majorDiatonicScale('C');
    expect(result).toEqual(['C', 'Dm', 'Em', 'F', 'G7', 'Am', 'Bm7b5']);

    result = majorDiatonicScale('A', true);
    expect(result).toEqual([
      'A7+',
      'Bm7',
      'C#m7',
      'D7+',
      'E7',
      'F#m7',
      'G#m7b5',
    ]);
  });

  it('generates dominant chords', () => {
    let result = dominantChord('D');
    expect(result).toEqual('A7');

    result = dominantChord('Eb');
    expect(result).toEqual('Bb7');

    result = dominantChord('C#');
    expect(result).toEqual('G#7');
  });

  it('generates II chords', () => {
    expect(iiChord('D')).toEqual('Em');
    expect(iiChord('Cb')).toEqual('Dbm');
    expect(iiChord('Am')).toEqual('Bm7b5');
    expect(iiChord('Em')).toEqual('F#m7b5');
  });

  it('generates SubV chords', () => {
    expect(subV('F')).toEqual('Gb7');
    expect(subV('Am')).toEqual('Bb7');
  });

  it('normalizes root note', () => {
    const result = harmonicMinorDiatonicScale('Am'); // should be smart enough to remove the 'm' from the root note
    const sameResult = harmonicMinorDiatonicScale('A');

    expect(result).toEqual(sameResult);
  });

  it('generates the harmonic minor harmonic field (triads)', () => {
    // A harmonic minor scale: A, B, C, D, E, F, G#
    // Chord qualities in harmonic minor:
    // i = minor, ii° = half-dim, III+ = augmented, iv = minor, V = major/dom7, VI = major, vii° = dim
    const result = harmonicMinorDiatonicScale('A');
    expect(result).toEqual([
      'Am',      // i - minor
      'Bm7b5',   // ii° - half-diminished
      'Cm7',     // III - in this implementation it's m7
      'Dm',      // iv - minor
      'E7',      // V - dominant
      'Fm7',     // VI - in this implementation it's m7
      'G#m7b5',  // vii° - half-diminished
    ]);
  });
});
