/**
 * Music theory tonality and harmonic fields module
 * Provides functions for working with diatonic scales and chord progressions
 */

import { major, harmonicMinor, noteAdd, degreeLookup, enharmony, type Note } from './scales';

/**
 * Generates the diatonic harmonic field of a major scale
 * @param root - The root note
 * @param tetrads - Whether to include 7th chords (default: false for triads)
 * @returns Array of diatonic chords with their qualities
 */
export const majorDiatonicScale = (root: Note, tetrads: boolean = false): string[] => {
  const scale = major(root);
  
  if (!scale || scale.length !== 7) {
    console.error('invalid note');
    return [];
  }

  return scale.map((note, i) => {
    const degree = i + 1;
    
    // I and IV are major (or major 7th)
    if ((degree === 1 || degree === 4) && tetrads) {
      return note + '7+';
    }
    
    // ii, iii, vi are minor (or minor 7th)
    if (degree === 2 || degree === 3 || degree === 6) {
      const suffix = tetrads ? 'm7' : 'm';
      return note + suffix;
    }
    
    // V is dominant 7th
    if (degree === 5) {
      return note + '7';
    }
    
    // vii° is diminished (or half-diminished)
    if (degree === 7) {
      return note + 'm7b5';
    }
    
    return note;
  });
};

/**
 * Generates the harmonic minor field
 * @param root - The root note (can include 'm' suffix)
 * @param tetrads - Whether to include 7th chords (default: false)
 * @returns Array of diatonic chords with their qualities
 */
export const harmonicMinorDiatonicScale = (root: Note, tetrads: boolean = false): string[] => {
  // Strip 'm' suffix if present at the end
  const cleanRoot = root.endsWith('m') && root.length > 1 ? root.slice(0, -1) : root;
  
  const scale = harmonicMinor(cleanRoot);

  if (!scale || scale.length !== 7) {
    console.error('invalid note');
    return [];
  }

  return scale.map((note, i) => {
    const degree = i + 1;
    
    // i and iv are minor
    if (degree === 1 || degree === 4) {
      const suffix = tetrads ? 'm7' : 'm';
      return note + suffix;
    }

    // ii° is half-diminished
    if (degree === 2) {
      return note + 'm7b5';
    }

    // III and VI are augmented
    if (degree === 3 || degree === 6) {
      const suffix = tetrads ? '7+' : 'm7';
      return note + suffix;
    }

    // V is dominant
    if (degree === 5) {
      return note + '7';
    }

    // vii° is diminished / half-diminished
    if (degree === 7) {
      return note + 'm7b5';
    }

    return note;
  });
};

/**
 * Extracts the root note from a chord symbol
 * @param chord - The chord symbol (e.g., 'Am7', 'C#', 'Bb7+')
 * @returns The root note without chord quality indicators
 */
const extractRootFromChord = (chord: string): Note => {
  return chord.replace(/m|7|\+|b5|o|dim|aug|maj|M/g, '');
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
