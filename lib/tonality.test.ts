import {
  dominantChord,
  harmonicMinorDiatonicScale,
  naturalMinorDiatonicScale,
  melodicMinorDiatonicScale,
  iiChord,
  majorDiatonicScale,
  subV,
} from './tonality';

describe('tonality lib', () => {
  it('generates the major diatonic scales (tetrads)', () => {
    let result = majorDiatonicScale('C');
    expect(result).toEqual(['C7M', 'Dm7', 'Em7', 'F7M', 'G7', 'Am7', 'Bm7b5']);

    result = majorDiatonicScale('A');
    expect(result).toEqual([
      'A7M',
      'Bm7',
      'C#m7',
      'D7M',
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

  it('generates the harmonic minor harmonic field (tetrads)', () => {
    // A harmonic minor scale: A, B, C, D, E, F, G#
    // Chord qualities in harmonic minor (tetrads):
    // i = m7M (minor triad + major 7th)
    // ii° = half-diminished (m7b5)
    // III+ = augmented major 7 (7M#5)
    // iv = minor 7 (m7)
    // V = dominant 7 (7)
    // VI = major 7 (7M)
    // vii° = diminished 7 (dim7)
    const result = harmonicMinorDiatonicScale('A');
    expect(result).toEqual([
      'Am7M',    // i - minor/major 7
      'Bm7b5',   // ii° - half-diminished
      'C7M#5',   // III+ - augmented major 7
      'Dm7',     // iv - minor 7
      'E7',      // V - dominant 7
      'F7M',     // VI - major 7
      'G#dim7',  // vii° - diminished 7
    ]);
  });

  it('generates the natural minor harmonic field (tetrads)', () => {
    // A natural minor scale (Aeolian): A, B, C, D, E, F, G
    // Chord qualities:
    // i = m7, ii° = m7b5, III = 7M, iv = m7, v = m7, VI = 7M, VII = 7
    const result = naturalMinorDiatonicScale('A');
    expect(result).toEqual([
      'Am7',     // i - minor 7
      'Bm7b5',   // ii° - half-diminished
      'C7M',     // III - major 7
      'Dm7',     // iv - minor 7
      'Em7',     // v - minor 7
      'F7M',     // VI - major 7
      'G7',      // VII - dominant 7
    ]);
  });

  it('generates the melodic minor harmonic field (tetrads)', () => {
    // A melodic minor scale: A, B, C, D, E, F#, G#
    // Chord qualities:
    // i = m7M, ii = m7, III+ = 7M#5, IV = 7, V = 7, vi° = m7b5, vii° = m7b5
    const result = melodicMinorDiatonicScale('A');
    expect(result).toEqual([
      'Am7M',    // i - minor/major 7
      'Bm7',     // ii - minor 7
      'C7M#5',   // III+ - augmented major 7
      'D7',      // IV - dominant 7
      'E7',      // V - dominant 7
      'F#m7b5',  // vi° - half-diminished
      'G#m7b5',  // vii° - half-diminished
    ]);
  });
});
