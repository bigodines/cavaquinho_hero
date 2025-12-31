import { fretboard, TUNINGS } from './fretboard';

describe('Debug D7 voicings', () => {
  it('should show all D7 voicings', () => {
    const fb = fretboard(TUNINGS.CAVAQUINHO);
    const D7 = ['D', 'F#', 'A', 'C'];
    const voicings = fb.draw(D7);

    console.log(`\nGenerated ${voicings.length} voicings for D7:\n`);

    voicings.forEach((v, i) => {
      const fretStr = v.frets.join(',');
      const notes = v.frets.map((fret, string) => fb.getNote(string, fret));
      const hasD = notes.includes('D');
      const frettedPositions = v.frets.filter(f => f > 0);
      const span = frettedPositions.length > 1 
        ? Math.max(...frettedPositions) - Math.min(...frettedPositions)
        : 0;
      
      console.log(`#${i+1} [${fretStr}] baseFret=${v.baseFret} span=${span} notes=${notes.join('-')} ${hasD ? '' : '(ROOTLESS)'}`);
    });

    // Look for the specific voicings the user mentioned
    console.log('\n--- Looking for specific voicings ---');

    // Most popular rootless: F#-A-C-F# at fret 1
    // Tuning: D-G-B-D
    // String 0 (D): fret 4 = F#
    // String 1 (G): fret 2 = A  
    // String 2 (B): fret 1 = C
    // String 3 (D): fret 4 = F#
    const desired1 = [4, 2, 1, 4];
    const found1 = voicings.find(v => 
      v.frets[0] === desired1[0] && 
      v.frets[1] === desired1[1] && 
      v.frets[2] === desired1[2] && 
      v.frets[3] === desired1[3]
    );
    console.log(`Voicing [4,2,1,4] (F#-A-C-F#): ${found1 ? 'FOUND ✓' : 'NOT FOUND ✗'}`);
    if (found1) {
      console.log(`  Position: #${voicings.indexOf(found1) + 1}`);
    }

    // Check what notes are at fret positions
    console.log('\nFretboard reference:');
    console.log('String 0 (D): fret 1 =', fb.getNote(0, 1), ', fret 4 =', fb.getNote(0, 4));
    console.log('String 1 (G): fret 2 =', fb.getNote(1, 2), ', fret 5 =', fb.getNote(1, 5));
    console.log('String 2 (B): fret 1 =', fb.getNote(2, 1), ', fret 3 =', fb.getNote(2, 3));
    console.log('String 3 (D): fret 4 =', fb.getNote(3, 4));

    expect(voicings.length).toBeGreaterThan(0);
  });
});
