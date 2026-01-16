/**
 * Fretboard visualization module
 * Provides functions for working with stringed instrument fretboards
 * 
 * Key challenges for cavaquinho (4 strings):
 * - Sometimes we must omit the tonic or 5th for complex chords
 * - Hand span is limited (~4 frets max for most players)
 * - Need to filter out physically impossible fingerings
 */

import { noteAdd } from './scales';

// NECK_SIZE is the number of frets + 1 (includes open string)
const NECK_SIZE = 13;

// Maximum fret span the human hand can comfortably reach
export const MAX_FRET_SPAN = 6;

// Maximum number of chord voicings to return
const MAX_VOICINGS = 12;

export type Note = string;
export type Tuning = Note[];
export type FretboardArray = Note[][];
export type ChordShape = number[]; // Fret positions for each string (-1 = muted, 0 = open)

export interface ChordVoicing {
  frets: number[];
  baseFret: number;
  notes: Note[];
}

export interface FretboardInterface {
  tuning: Tuning;
  fretboard: FretboardArray;
  allChords: ChordVoicing[];
  draw: (notes: Note[]) => ChordVoicing[];
  findNotes: (note: Note) => Array<{ string: number; fret: number }>;
  getNote: (stringIndex: number, fret: number) => Note;
}

/**
 * Generates note configurations to fill all strings on the instrument.
 * 
 * Strategies:
 * - Triads (3 notes): Double root, third, or fifth
 * - Tetrads (4 notes): Use as-is, plus rootless and fifth-less variations
 * - Pentads+ (5+ notes): Omit fifth first (preserves chord quality),
 *   then root if needed (rootless voicings are common in jazz)
 * 
 * Note: Omitting the root is common when a bass instrument plays the root.
 * Omitting the fifth is common as it's the least important for chord quality
 * (the third defines major/minor, the seventh defines the chord type).
 */
function generateNoteConfigs(notes: Note[], numStrings: number): Note[][] {
  const configs: Note[][] = [];
  
  if (notes.length === numStrings) {
    // Perfect fit - use as is
    configs.push([...notes]);
    
    // Also generate variations with omissions (common on small instruments)
    // Rootless voicing: omit root, double seventh (very common in jazz)
    if (notes.length >= 4) {
      const rootless = notes.slice(1); // Remove root
      rootless.push(notes[3]); // Double the seventh
      configs.push(rootless);
      
      // Another rootless: omit root, double third
      const rootlessDoubleThird = notes.slice(1);
      rootlessDoubleThird.push(notes[1]);
      configs.push(rootlessDoubleThird);
    }
    
    // Fifth-less voicing: omit fifth, double root
    if (notes.length >= 3) {
      const noFifth = notes.filter((_, idx) => idx !== 2);
      noFifth.push(notes[0]); // Double root
      configs.push(noFifth);
      
      // Fifth-less with double third
      const noFifthDoubleThird = notes.filter((_, idx) => idx !== 2);
      noFifthDoubleThird.push(notes[1]);
      configs.push(noFifthDoubleThird);
    }
  } else if (notes.length < numStrings) {
    // Need to double some notes (e.g., triads on 4-string)
    const deficit = numStrings - notes.length;
    
    // Double the root (most common)
    const doubleRoot = [...notes];
    for (let d = 0; d < deficit; d++) {
      doubleRoot.push(notes[0]);
    }
    configs.push(doubleRoot);
    
    // Double the fifth (if available)
    if (notes.length >= 3) {
      const doubleFifth = [...notes];
      for (let d = 0; d < deficit; d++) {
        doubleFifth.push(notes[2]);
      }
      configs.push(doubleFifth);
    }
    
    // Double the third
    if (notes.length >= 2) {
      const doubleThird = [...notes];
      for (let d = 0; d < deficit; d++) {
        doubleThird.push(notes[1]);
      }
      configs.push(doubleThird);
    }
  } else {
    // Too many notes - need to omit some
    // Strategy 1: Omit the fifth (preserves chord quality)
    if (notes.length > 2) {
      const omitFifth = notes.filter((_, idx) => idx !== 2);
      if (omitFifth.length >= numStrings) {
        configs.push(omitFifth.slice(0, numStrings));
      } else {
        // Still need to fill strings, double root
        while (omitFifth.length < numStrings) {
          omitFifth.push(notes[0]);
        }
        configs.push(omitFifth);
      }
    }
    
    // Strategy 2: Omit the root (rootless voicing)
    const omitRoot = notes.slice(1);
    if (omitRoot.length >= numStrings) {
      configs.push(omitRoot.slice(0, numStrings));
    }
    
    // Strategy 3: Keep root, third, seventh, and highest extension
    if (notes.length >= 4) {
      const shell = [notes[0], notes[1], notes[3]];
      if (notes.length > 4) {
        shell.push(notes[notes.length - 1]);
      } else {
        shell.push(notes[0]); // Double root
      }
      if (shell.length === numStrings) {
        configs.push(shell);
      }
    }
  }
  
  return configs;
}

/**
 * Generates all permutations of an array
 */
function getPermutations<T>(arr: T[]): T[][] {
  if (arr.length <= 1) return [arr];
  
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i++) {
    const current = arr[i];
    const remaining = [...arr.slice(0, i), ...arr.slice(i + 1)];
    const perms = getPermutations(remaining);
    for (const perm of perms) {
      result.push([current, ...perm]);
    }
  }
  return result;
}

/**
 * Gets fret span of a fingering (ignoring open strings)
 */
function getFretSpan(frets: number[]): number {
  const fretted = frets.filter(f => f > 0);
  if (fretted.length <= 1) return 0;
  return Math.max(...fretted) - Math.min(...fretted);
}

/**
 * Gets the lowest fretted position (for base fret calculation)
 */
function getBaseFret(frets: number[]): number {
  const fretted = frets.filter(f => f > 0);
  return fretted.length > 0 ? Math.min(...fretted) : 1;
}

/**
 * Checks if a fingering is physically playable
 */
function isPlayable(frets: number[]): boolean {
  // Check fret span
  if (getFretSpan(frets) > MAX_FRET_SPAN) {
    return false;
  }
  
  // All frets must be valid (0-12)
  if (frets.some(f => f < 0 || f >= NECK_SIZE)) {
    return false;
  }
  
  return true;
}

/**
 * Ranks a fingering by playability (lower = better)
 */
function rankVoicing(frets: number[]): number {
  let score = 0;
  
  // Prefer lower positions
  const baseFret = getBaseFret(frets);
  score += baseFret * 2;
  
  // Prefer smaller spans
  score += getFretSpan(frets) * 3;
  
  // Prefer open strings
  const openStrings = frets.filter(f => f === 0).length;
  score -= openStrings * 2;
  
  // Penalize very high frets
  const maxFret = Math.max(...frets);
  if (maxFret > 7) {
    score += (maxFret - 7) * 2;
  }
  
  return score;
}

/**
 * Creates a fretboard representation for a stringed instrument
 * @param tuning - Array of notes representing the open string tuning
 * @returns A fretboard interface with methods for chord visualization
 */
export function fretboard(tuning: Tuning): FretboardInterface {
  // Build the fretboard matrix: fretboard[string][fret] = note
  const f: FretboardArray = [];
  
  for (let i = 0; i < tuning.length; i++) {
    f[i] = [];
    for (let j = 0; j < NECK_SIZE; j++) {
      f[i][j] = noteAdd(tuning[i], j);
    }
  }

  const fretboardInterface: FretboardInterface = {
    tuning,
    fretboard: f,
    allChords: [],
    
    /**
     * Gets the note at a specific position
     */
    getNote: (stringIndex: number, fret: number): Note => {
      if (stringIndex < 0 || stringIndex >= f.length) return '';
      if (fret < 0 || fret >= NECK_SIZE) return '';
      return f[stringIndex][fret];
    },
    
    /**
     * Generates playable chord voicings for a given set of notes
     * @param notes - Array of notes (e.g., ['C', 'E', 'G'] for C major)
     * @returns Array of playable chord voicings
     */
    draw: (notes: Note[]): ChordVoicing[] => {
      // Normalize input to consistent enharmonic spelling
      const normalizedNotes = notes.map((n) => noteAdd(n, 0));
      
      // Reset previous results
      fretboardInterface.allChords = [];
      
      // Generate note configurations (handle triads, tetrads, etc.)
      const configs = generateNoteConfigs(normalizedNotes, tuning.length);
      
      const allVoicings: ChordVoicing[] = [];
      
      // For each configuration, try all string assignments
      for (const config of configs) {
        const permutations = getPermutations(config);
        
        for (const perm of permutations) {
          // Find all fingerings for this permutation
          findFingeringsRecursive(f, perm, 0, [], allVoicings, normalizedNotes);
        }
      }
      
      // Remove duplicates
      const uniqueVoicings = removeDuplicateVoicings(allVoicings);
      
      // Sort by playability
      uniqueVoicings.sort((a, b) => rankVoicing(a.frets) - rankVoicing(b.frets));
      
      // Limit results
      const limitedVoicings = uniqueVoicings.slice(0, MAX_VOICINGS);
      
      fretboardInterface.allChords = limitedVoicings;
      return limitedVoicings;
    },

    /**
     * Finds all positions where a specific note appears on the fretboard
     * @param note - The note to find
     * @returns Array of {string, fret} positions
     */
    findNotes: (note: Note): Array<{ string: number; fret: number }> => {
      const positions: Array<{ string: number; fret: number }> = [];
      const normalizedNote = noteAdd(note, 0);

      for (let string = 0; string < f.length; string++) {
        for (let fret = 0; fret < NECK_SIZE; fret++) {
          if (noteAdd(f[string][fret], 0) === normalizedNote) {
            positions.push({ string, fret });
          }
        }
      }

      return positions;
    }
  };

  return fretboardInterface;
}

/**
 * Recursively finds all valid fingerings for a note assignment
 */
function findFingeringsRecursive(
  fb: FretboardArray,
  noteAssignment: Note[],
  stringIndex: number,
  currentFrets: number[],
  results: ChordVoicing[],
  originalNotes: Note[]
): void {
  if (stringIndex === fb.length) {
    // Completed a fingering
    if (isPlayable(currentFrets)) {
      results.push({
        frets: [...currentFrets],
        baseFret: getBaseFret(currentFrets),
        notes: originalNotes,
      });
    }
    return;
  }
  
  const targetNote = noteAdd(noteAssignment[stringIndex], 0);
  
  // Find all frets on this string that have the target note
  for (let fret = 0; fret < NECK_SIZE; fret++) {
    if (noteAdd(fb[stringIndex][fret], 0) === targetNote) {
      const newFrets = [...currentFrets, fret];
      
      // Early pruning: check if current partial fingering is already unplayable
      if (getFretSpan(newFrets) <= MAX_FRET_SPAN) {
        findFingeringsRecursive(fb, noteAssignment, stringIndex + 1, newFrets, results, originalNotes);
      }
    }
  }
}

/**
 * Removes duplicate voicings (same fret positions)
 */
function removeDuplicateVoicings(voicings: ChordVoicing[]): ChordVoicing[] {
  const seen = new Set<string>();
  const unique: ChordVoicing[] = [];
  
  for (const v of voicings) {
    const key = v.frets.join(',');
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(v);
    }
  }
  
  return unique;
}

// Standard tunings for common instruments
export const TUNINGS = {
  GUITAR_STANDARD: ['E', 'A', 'D', 'G', 'B', 'E'],
  GUITAR_DROP_D: ['D', 'A', 'D', 'G', 'B', 'E'],
  UKULELE_STANDARD: ['G', 'C', 'E', 'A'],
  CAVAQUINHO: ['D', 'G', 'B', 'D'], // Portuguese tuning
  MANDOLIN: ['G', 'D', 'A', 'E'], // Standard mandolin tuning (pairs tuned in unison)
  BASS_STANDARD: ['E', 'A', 'D', 'G'],
};

// Instrument definitions with their tunings and display names
export type InstrumentKey = 'cavaquinho' | 'mandolin' | 'ukulele' | 'guitar';

export interface InstrumentDefinition {
  key: InstrumentKey;
  tuning: string[];
  tuningDisplay: string;
}

export const INSTRUMENTS: Record<InstrumentKey, InstrumentDefinition> = {
  cavaquinho: {
    key: 'cavaquinho',
    tuning: TUNINGS.CAVAQUINHO,
    tuningDisplay: 'D-G-B-D',
  },
  mandolin: {
    key: 'mandolin',
    tuning: TUNINGS.MANDOLIN,
    tuningDisplay: 'G-D-A-E',
  },
  ukulele: {
    key: 'ukulele',
    tuning: TUNINGS.UKULELE_STANDARD,
    tuningDisplay: 'G-C-E-A',
  },
  guitar: {
    key: 'guitar',
    tuning: TUNINGS.GUITAR_STANDARD,
    tuningDisplay: 'E-A-D-G-B-E',
  },
};

// Legacy export for backward compatibility
export const Fretboard = fretboard;
