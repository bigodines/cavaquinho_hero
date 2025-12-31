/**
 * Music theory tonality and harmonic fields module
 * Provides functions for working with diatonic scales and chord progressions
 */

import { major, harmonicMinor, naturalMinor, melodicMinor, noteAdd, degreeLookup, enharmony, type Note } from './scales';

/**
 * Generates the diatonic harmonic field of a major scale (tetrads with 7ths)
 * @param root - The root note
 * @returns Array of diatonic chords with their qualities (all as tetrads)
 * 
 * Chord qualities by degree:
 * - I: Major 7 (7M)
 * - ii: Minor 7 (m7)
 * - iii: Minor 7 (m7)
 * - IV: Major 7 (7M)
 * - V: Dominant 7 (7)
 * - vi: Minor 7 (m7)
 * - vii°: Half-diminished (m7b5)
 */
export const majorDiatonicScale = (root: Note): string[] => {
  const scale = major(root);
  
  if (!scale || scale.length !== 7) {
    console.error('invalid note');
    return [];
  }

  return scale.map((note, i) => {
    const degree = i + 1;
    
    // I and IV are major 7th
    if (degree === 1 || degree === 4) {
      return note + '7M';
    }
    
    // ii, iii, vi are minor 7th
    if (degree === 2 || degree === 3 || degree === 6) {
      return note + 'm7';
    }
    
    // V is dominant 7th
    if (degree === 5) {
      return note + '7';
    }
    
    // vii° is half-diminished
    if (degree === 7) {
      return note + 'm7b5';
    }
    
    return note;
  });
};

/**
 * Generates the harmonic minor diatonic field (tetrads with 7ths)
 * @param root - The root note (can include 'm' suffix)
 * @returns Array of diatonic chords with their qualities (all as tetrads)
 * 
 * Chord qualities by degree:
 * - i: Minor/Major 7 (m7M) - minor triad with major 7th
 * - ii°: Half-diminished (m7b5)
 * - III+: Augmented Major 7 (7M#5)
 * - iv: Minor 7 (m7)
 * - V: Dominant 7 (7)
 * - VI: Major 7 (7M)
 * - vii°: Diminished 7 (dim7)
 */
export const harmonicMinorDiatonicScale = (root: Note): string[] => {
  // Strip 'm' suffix if present at the end
  const cleanRoot = root.endsWith('m') && root.length > 1 ? root.slice(0, -1) : root;
  
  const scale = harmonicMinor(cleanRoot);

  if (!scale || scale.length !== 7) {
    console.error('invalid note');
    return [];
  }

  return scale.map((note, i) => {
    const degree = i + 1;
    
    // i is minor/major 7 (minor triad + major 7th)
    if (degree === 1) {
      return note + 'm7M';
    }
    
    // iv is minor 7
    if (degree === 4) {
      return note + 'm7';
    }

    // ii° is half-diminished
    if (degree === 2) {
      return note + 'm7b5';
    }

    // III+ is augmented major 7
    if (degree === 3) {
      return note + '7M#5';
    }
    
    // VI is major 7
    if (degree === 6) {
      return note + '7M';
    }

    // V is dominant 7
    if (degree === 5) {
      return note + '7';
    }

    // vii° is diminished 7 (fully diminished)
    if (degree === 7) {
      return note + 'dim7';
    }

    return note;
  });
};

/**
 * Generates the natural minor (Aeolian) diatonic field (tetrads with 7ths)
 * @param root - The root note (can include 'm' suffix)
 * @returns Array of diatonic chords with their qualities (all as tetrads)
 * 
 * Chord qualities by degree:
 * - i: Minor 7 (m7)
 * - ii°: Half-diminished (m7b5)
 * - III: Major 7 (7M)
 * - iv: Minor 7 (m7)
 * - v: Minor 7 (m7)
 * - VI: Major 7 (7M)
 * - VII: Dominant 7 (7)
 */
export const naturalMinorDiatonicScale = (root: Note): string[] => {
  // Strip 'm' suffix if present at the end
  const cleanRoot = root.endsWith('m') && root.length > 1 ? root.slice(0, -1) : root;
  
  const scale = naturalMinor(cleanRoot);

  if (!scale || scale.length !== 7) {
    console.error('invalid note');
    return [];
  }

  return scale.map((note, i) => {
    const degree = i + 1;
    
    // i, iv, v are minor 7
    if (degree === 1 || degree === 4 || degree === 5) {
      return note + 'm7';
    }

    // ii° is half-diminished
    if (degree === 2) {
      return note + 'm7b5';
    }

    // III and VI are major 7
    if (degree === 3 || degree === 6) {
      return note + '7M';
    }

    // VII is dominant 7
    if (degree === 7) {
      return note + '7';
    }

    return note;
  });
};

/**
 * Generates the melodic minor diatonic field (tetrads with 7ths)
 * Uses the ascending form of the melodic minor scale
 * @param root - The root note (can include 'm' suffix)
 * @returns Array of diatonic chords with their qualities (all as tetrads)
 * 
 * Chord qualities by degree:
 * - i: Minor/Major 7 (m7M)
 * - ii: Minor 7 (m7)
 * - III+: Augmented Major 7 (7M#5)
 * - IV: Dominant 7 (7)
 * - V: Dominant 7 (7)
 * - vi°: Half-diminished (m7b5)
 * - vii°: Half-diminished (m7b5)
 */
export const melodicMinorDiatonicScale = (root: Note): string[] => {
  // Strip 'm' suffix if present at the end
  const cleanRoot = root.endsWith('m') && root.length > 1 ? root.slice(0, -1) : root;
  
  const scale = melodicMinor(cleanRoot);

  if (!scale || scale.length !== 7) {
    console.error('invalid note');
    return [];
  }

  return scale.map((note, i) => {
    const degree = i + 1;
    
    // i is minor/major 7 (minor triad + major 7th)
    if (degree === 1) {
      return note + 'm7M';
    }

    // ii is minor 7
    if (degree === 2) {
      return note + 'm7';
    }

    // III+ is augmented major 7
    if (degree === 3) {
      return note + '7M#5';
    }

    // IV and V are dominant 7
    if (degree === 4 || degree === 5) {
      return note + '7';
    }

    // vi° and vii° are half-diminished
    if (degree === 6 || degree === 7) {
      return note + 'm7b5';
    }

    return note;
  });
};

/**
 * Extracts the root note from a chord symbol
 * @param chord - The chord symbol (e.g., 'Am7', 'C#7M', 'Bb7', 'G#dim7', 'C7M#5')
 * @returns The root note without chord quality indicators
 */
const extractRootFromChord = (chord: string): Note => {
  // Match the root note: a letter A-G optionally followed by # or b
  const match = chord.match(/^([A-G][#b]?)/);
  return match ? match[1] : chord;
};

/**
 * Finds the dominant (V) chord for a given chord
 * Used in V-I progressions
 * @param chord - The target chord
 * @returns The dominant 7th chord
 */
export const dominantChord = (chord: string): string => {
  const root = extractRootFromChord(chord);
  const scale = major(root);
  // Return the 5th degree with a dominant 7th
  return scale[4] + '7';
};

/**
 * Finds the ii chord for a given chord
 * Used in ii-V-I progressions
 * @param chord - The target chord
 * @returns The ii chord (minor or half-diminished depending on if target is minor)
 */
export const iiChord = (chord: string): string => {
  const isMinor = chord.includes('m');
  const root = extractRootFromChord(chord);
  const scale = major(root);
  
  if (isMinor) {
    // For minor chords, use half-diminished ii
    return scale[1] + 'm7b5';
  } else {
    // For major chords, use minor ii
    return scale[1] + 'm';
  }
};

/**
 * Returns the substitute dominant (SubV or tritone substitution)
 * The SubV is a half-step above the target chord
 * @param chord - The target chord
 * @returns The substitute dominant chord
 */
export const subV = (chord: string): string => {
  const root = extractRootFromChord(chord);
  
  let target = noteAdd(root, 1); // Half step up
  const expected = degreeLookup(root, 2);
  
  if (target[0] !== expected) {
    target = enharmony(target, expected);
  }

  return target + '7';
};

/**
 * Returns the preparatory diminished chord
 * The diminished chord is a half-step below the target
 * @param chord - The target chord
 * @returns The preparatory diminished chord
 */
export const prepDim = (chord: string): string => {
  const root = extractRootFromChord(chord);
  
  let target = noteAdd(root, 11); // Half step down (or 11 up)
  const expected = degreeLookup(root, 7);
  
  if (target[0] !== expected) {
    target = enharmony(target, expected);
  }

  return target + 'o';
};

// Legacy exports for backward compatibility
export const MajorDiatonicScale = majorDiatonicScale;
export const HarmonicMinorDiatonicScale = harmonicMinorDiatonicScale;
export const DominantChord = dominantChord;
export const IIChord = iiChord;
export const SubV = subV;
export const PrepDim = prepDim;
