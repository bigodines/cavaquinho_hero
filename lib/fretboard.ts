/**
 * Fretboard visualization module
 * Provides functions for working with stringed instrument fretboards
 */

import { noteAdd } from './scales';

// NECK_SIZE is the number of frets + 1 (includes open string)
const NECK_SIZE = 13;

export type Note = string;
export type Tuning = Note[];
export type FretboardArray = Note[][];
export type ChordShape = number[]; // Fret positions for each string (-1 = muted, 0 = open)

export interface FretboardInterface {
  tuning: Tuning;
  fretboard: FretboardArray;
  allChords: Note[][];
  draw: (notes: Note[]) => void;
  findNotes: (note: Note) => Array<{ string: number; fret: number }>;
}

/**
 * Creates a fretboard representation for a stringed instrument
 * @param tuning - Array of notes representing the open string tuning
 * @returns A fretboard interface with methods for chord visualization
 */
export function fretboard(tuning: Tuning): FretboardInterface {
  // Build the fretboard - each string has NECK_SIZE notes
  // fretboard[stringIndex][fretNumber] = note
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
     * Draws chord shapes for a given set of notes
     * @param notes - Array of notes to visualize as a chord
     */
    draw: (notes: Note[]) => {
      // Normalize input to the same enharmonic dictionary
      const normalizedNotes = notes.map((n) => noteAdd(n, 0));
      
      // Reset any previous chords
      fretboardInterface.allChords = [];

      // For triads (3 notes), we need to add a 4th note
      // Common strategies: double the root or double the third
      const chordConfigs: Note[][] = [];
      
      if (normalizedNotes.length < tuning.length) {
        // Strategy 1: double the root note
        const config1 = [...normalizedNotes, normalizedNotes[0]];
        chordConfigs.push(config1);

        // Strategy 2: double the third (if it exists)
        if (normalizedNotes.length >= 2) {
          const config2 = [...normalizedNotes, normalizedNotes[1]];
          chordConfigs.push(config2);
        }
      } else {
        // For 4+ note chords, use as is
        chordConfigs.push(normalizedNotes.slice(0, tuning.length));
      }

      // TODO: Implement chord shape generation algorithm
      // This would find all possible fingerings for the chord
      // across the fretboard, considering:
      // - Playability (reasonable fret spans)
      // - Voice leading
      // - String skipping
      
      console.log('Chord visualization for:', normalizedNotes);
      console.log('Chord configs:', chordConfigs);
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

// Standard tunings for common instruments
export const TUNINGS = {
  GUITAR_STANDARD: ['E', 'A', 'D', 'G', 'B', 'E'],
  GUITAR_DROP_D: ['D', 'A', 'D', 'G', 'B', 'E'],
  UKULELE_STANDARD: ['G', 'C', 'E', 'A'],
  CAVAQUINHO: ['D', 'G', 'B', 'D'], // Portuguese tuning
  BASS_STANDARD: ['E', 'A', 'D', 'G'],
};

// Legacy export for backward compatibility
export const Fretboard = fretboard;
