/**
 * Music theory scales module
 * Provides functions for working with musical notes and scales
 */

// Note dictionary - the basic musical alphabet
const DICT = ['A', 'B', 'C', 'D', 'E', 'F', 'G'] as const;

// Chromatic scale representations - three enharmonic equivalents
const CHROM_A = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'] as const;
const CHROM_B = ['Bbb', 'Cbb', 'Cb', 'Dbb', 'Db', 'Ebb', 'Fbb', 'Fb', 'Gbb', 'Gb', 'Abb', 'Ab'] as const;
const CHROM_C = ['G##', 'Bb', 'A##', 'B#', 'B##', 'C##', 'Eb', 'D##', 'E#', 'E##', 'F##', 'G#'] as const;

const ALL_SCALES = [CHROM_A, CHROM_B, CHROM_C] as const;

export type Note = string;
export type Scale = Note[];

/**
 * Checks if a note is valid
 * @param note - The note to validate (e.g., 'C', 'A#', 'Bb')
 * @returns true if the note exists in any of the chromatic scales
 */
export const isValidNote = (note: string): boolean => {
  return ALL_SCALES.some(scale => (scale as readonly string[]).includes(note));
};

/**
 * Adds semitones to a note and returns the resulting note
 * @param note - The starting note
 * @param semiTone - Number of semitones to add (can be positive or negative)
 * @returns The resulting note
 */
export const noteAdd = (note: string, semiTone: number): string => {
  let noteIdx = -1;
  
  // Find which chromatic scale contains this note
  for (const scale of ALL_SCALES) {
    noteIdx = (scale as readonly string[]).indexOf(note);
    if (noteIdx >= 0) break;
  }

  // Calculate new position, wrapping around if necessary
  let pos = noteIdx + semiTone;
  while (pos >= CHROM_A.length) {
    pos = pos - CHROM_A.length;
  }
  while (pos < 0) {
    pos = pos + CHROM_A.length;
  }
  
  return CHROM_A[pos];
};

/**
 * Finds the expected note letter for a given degree from a root note
 * Example: degreeLookup('C', 3) returns 'E' (the 3rd degree in C major scale)
 * @param note - The root note
 * @param degree - The scale degree (1-7)
 * @returns The expected note letter (without accidentals)
 */
export const degreeLookup = (note: string, degree: number): string => {
  const firstPos = (DICT as readonly string[]).indexOf(note[0]);
  let normalizedIdx = firstPos + degree - 1;
  
  // Cycle through the note dictionary
  if (normalizedIdx >= DICT.length) {
    normalizedIdx = normalizedIdx - DICT.length;
  }

  return DICT[normalizedIdx];
};

/**
 * Finds the correct enharmonic equivalent of a note
 * @param from - The note to convert
 * @param to - The target note letter
 * @returns The enharmonic equivalent that starts with the target letter
 */
export const enharmony = (from: string, to: string): string => {
  let noteIdx = -1;
  
  // Find which scale contains the source note
  for (const scale of ALL_SCALES) {
    noteIdx = (scale as readonly string[]).indexOf(from);
    if (noteIdx >= 0) break;
  }

  // Sanity check
  if (noteIdx === -1) {
    console.error('note does not exist: ', from);
    return from;
  }

  // Find the enharmonic equivalent that starts with the target letter
  for (const scale of ALL_SCALES) {
    if (scale[noteIdx][0] === to) {
      return scale[noteIdx];
    }
  }

  // If no match found, return original
  return from;
};

/**
 * Generates a scale based on a pattern of intervals
 * @param root - The root note
 * @param scaleSteps - Array of semitone intervals
 * @returns Array of notes in the scale
 */
const scaleGenerator = (root: string, scaleSteps: number[]): Scale => {
  if (!isValidNote(root)) {
    return [root];
  }
  
  const resultScale: string[] = [root];
  let degree = 2;
  let lastAddedNote = root;
  
  for (const step of scaleSteps) {
    let target = noteAdd(lastAddedNote, step);
    const expected = degreeLookup(root, degree);
    
    if (target[0] !== expected) {
      target = enharmony(target, expected);
    }
    
    resultScale.push(target);
    lastAddedNote = target;
    degree++;
  }

  return resultScale;
};

/**
 * Generates a major scale from a root note
 * Pattern: W W H W W W H (Whole, Whole, Half, Whole, Whole, Whole, Half)
 * @param root - The root note
 * @returns The major scale
 */
export const major = (root: string): Scale => {
  const scaleSteps = [2, 2, 1, 2, 2, 2];
  return scaleGenerator(root, scaleSteps);
};

/**
 * Generates a harmonic minor scale from a root note
 * Pattern: W H W W H W+H H (includes an augmented second interval)
 * @param root - The root note
 * @returns The harmonic minor scale
 */
export const harmonicMinor = (root: string): Scale => {
  const scaleSteps = [2, 1, 2, 2, 1, 3];
  return scaleGenerator(root, scaleSteps);
};

// Legacy exports for backward compatibility
export const IsValidNote = isValidNote;
export const NoteAdd = noteAdd;
export const DegreeLookup = degreeLookup;
export const Enharmony = enharmony;
export const Major = major;
export const HarmonicMinor = harmonicMinor;
