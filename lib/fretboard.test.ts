import { fretboard, ChordVoicing } from './fretboard';
import { noteAdd } from './scales';

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

  it('can draw tetrads (4-note chords)', () => {
    const fb = fretboard(['D', 'G', 'B', 'D']);

    // G7 = G, B, D, F
    const G7 = ['G', 'B', 'D', 'F'];
    const voicings = fb.draw(G7);

    expect(voicings.length).toBeGreaterThan(0);
    
    // Each voicing should have 4 frets (one per string)
    for (const voicing of voicings) {
      expect(voicing.frets.length).toBe(4);
      expect(validateChordVoicing(fb, voicing, G7)).toBe(true);
    }
  });

  it('can draw triads (3-note chords)', () => {
    const fb = fretboard(['D', 'G', 'B', 'D']);

    // A major = A, C#, E
    const Amaj = ['A', 'C#', 'E'];
    const voicings = fb.draw(Amaj);

    expect(voicings.length).toBeGreaterThan(0);
    
    // Each voicing should still have 4 frets (doubled note)
    for (const voicing of voicings) {
      expect(voicing.frets.length).toBe(4);
      expect(validateChordVoicing(fb, voicing, Amaj)).toBe(true);
    }
  });

  it('generates rootless voicings for tetrads', () => {
    const fb = fretboard(['D', 'G', 'B', 'D']);

    // D7 = D, F#, A, C
    // A common voicing omits D and uses F#, A, C (with one doubled)
    const D7 = ['D', 'F#', 'A', 'C'];
    const voicings = fb.draw(D7);

    expect(voicings.length).toBeGreaterThan(0);
    
    // Debug: log all voicings
    console.log('D7 voicings:', voicings.length);
    voicings.forEach((v, i) => {
      const notes = v.frets.map((f, s) => fb.getNote(s, f));
      console.log(`${i+1}. [${v.frets.join(',')}] = [${notes.join(',')}]`);
    });
    
    // Check that at least one voicing doesn't include the root (D)
    const rootlessVoicings = voicings.filter(v => {
      const notesInVoicing = v.frets.map((fret, string) => 
        fb.getNote(string, fret)
      );
      // A rootless voicing won't have D
      return !notesInVoicing.some(n => n === 'D');
    });
    
    console.log('Rootless voicings:', rootlessVoicings.length);
    rootlessVoicings.forEach((v, i) => {
      const notes = v.frets.map((f, s) => fb.getNote(s, f));
      console.log(`  ${i+1}. [${v.frets.join(',')}] = [${notes.join(',')}]`);
    });
    
    expect(rootlessVoicings.length).toBeGreaterThan(0);
    
    // Check for the specific popular voicing: [4,2,1,4] = F#,A,C,F#
    const popularRootless = voicings.find(v => v.frets.join(',') === '4,2,1,4');
    console.log('Popular rootless [4,2,1,4]:', popularRootless ? 'FOUND' : 'MISSING');
    expect(popularRootless).toBeDefined();
  });

  it('generates playable voicings (fret span <= 5)', () => {
    const fb = fretboard(['D', 'G', 'B', 'D']);

    const chords = [
      ['C', 'E', 'G', 'B'],    // C7M
      ['A', 'C#', 'E', 'G#'],  // A7M
      ['E', 'G#', 'B', 'D'],   // E7
    ];

    for (const chord of chords) {
      const voicings = fb.draw(chord);
      
      for (const voicing of voicings) {
        const frettedPositions = voicing.frets.filter(f => f > 0);
        if (frettedPositions.length > 1) {
          const span = Math.max(...frettedPositions) - Math.min(...frettedPositions);
          expect(span).toBeLessThanOrEqual(5); // MAX_FRET_SPAN = 5
        }
      }
    }
  });

  it('can get note at a position', () => {
    const fb = fretboard(['D', 'G', 'B', 'D']);
    
    // Open strings
    expect(fb.getNote(0, 0)).toBe('D');
    expect(fb.getNote(1, 0)).toBe('G');
    expect(fb.getNote(2, 0)).toBe('B');
    expect(fb.getNote(3, 0)).toBe('D');
    
    // Some fretted positions
    expect(fb.getNote(0, 2)).toBe('E');
    expect(fb.getNote(1, 2)).toBe('A');
  });
});

/**
 * Helper to validate that a chord voicing contains all expected notes
 */
function validateChordVoicing(
  fb: ReturnType<typeof fretboard>,
  voicing: ChordVoicing,
  originalNotes: string[]
): boolean {
  const normalizedOriginal = originalNotes.map(n => noteAdd(n, 0));
  
  for (let string = 0; string < voicing.frets.length; string++) {
    const fret = voicing.frets[string];
    const note = noteAdd(fb.getNote(string, fret), 0);
    
    if (!normalizedOriginal.includes(note)) {
      console.error(`Note ${note} at string ${string} fret ${fret} not in ${normalizedOriginal}`);
      return false;
    }
  }
  
  return true;
}
