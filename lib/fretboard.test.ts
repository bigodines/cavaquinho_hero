import { fretboard } from './fretboard';

describe('lib.Fretboard', () => {
  it('can create a valid fretboard', () => {
    // 1 string instrument
    let fb = fretboard(['C']);

    let actual = fb.fretboard;

    expect(actual[0][0]).toBe('C');
    expect(actual[0][12]).toBe('C');
    expect(actual[0][2]).toBe('D');

    // 2 strings
    fb = fretboard(['A', 'D']);

    actual = fb.fretboard;
    expect(actual[0][4]).toBe('C#');
    expect(actual[1][3]).toBe('F');
  });

  it('can find notes on the fretboard', () => {
    const fb = fretboard(['D', 'G', 'B', 'D']);

    const positions = fb.findNotes('D');
    
    // D should appear on multiple positions
    expect(positions.length).toBeGreaterThan(0);
    
    // Open strings should have D
    const openD = positions.filter(p => p.fret === 0);
    expect(openD.length).toBeGreaterThan(0);
  });
});
