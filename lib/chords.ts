/**
 * Music theory chords module
 * Provides functions for constructing and analyzing chords (triads and tetrads)
 */

import {
  noteAdd,
  degreeLookup,
  enharmony,
  type Note
} from './scales';

export interface Triad {
  first: Note;
  third: Note;
  fifth: Note;
}

export interface Tetrad extends Triad {
  seventh: Note;
}

export interface Sixth extends Triad {
  sixth: Note;
}

/**
 * Constructs a triad with proper enharmonic spelling
 * @param notes - Array of 3 notes [root, third, fifth]
 * @returns A triad object with correctly spelled notes
 */
function buildTriad(notes: [Note, Note, Note]): Triad | null {
  if (notes.length !== 3) {
    return null;
  }

  const chord: Triad = {
    first: notes[0],
    third: notes[1],
    fifth: notes[2]
  };

  // Ensure third has the correct enharmonic spelling
  let expected = degreeLookup(notes[0], 3);
  if (chord.third[0] !== expected) {
    chord.third = enharmony(chord.third, expected);
  }

  // Ensure fifth has the correct enharmonic spelling
  expected = degreeLookup(notes[0], 5);
  if (chord.fifth[0] !== expected) {
    chord.fifth = enharmony(chord.fifth, expected);
  }

  return chord;
}

/**
 * Constructs a tetrad with proper enharmonic spelling
 * @param notes - Array of 4 notes [root, third, fifth, seventh]
 * @returns A tetrad object with correctly spelled notes
 */
function buildTetrad(notes: [Note, Note, Note, Note]): Tetrad | null {
  if (notes.length !== 4) {
    return null;
  }

  const chord: Tetrad = {
    first: notes[0],
    third: notes[1],
    fifth: notes[2],
    seventh: notes[3]
  };

  // Ensure proper enharmonic spelling for each degree
  let expected = degreeLookup(notes[0], 3);
  if (chord.third[0] !== expected) {
    chord.third = enharmony(chord.third, expected);
  }

  expected = degreeLookup(notes[0], 5);
  if (chord.fifth[0] !== expected) {
    chord.fifth = enharmony(chord.fifth, expected);
  }

  expected = degreeLookup(notes[0], 7);
  if (chord.seventh[0] !== expected) {
    chord.seventh = enharmony(chord.seventh, expected);
  }

  return chord;
}

// ============ TRIADS ============

/**
 * Constructs a major triad (X = X + 3M + 5J)
 * @param note - The root note
 * @returns Major triad
 */
export function majorTriad(note: Note): Triad | null {
  const third = noteAdd(note, 4); // Major third
  const fifth = noteAdd(note, 7); // Perfect fifth
  return buildTriad([note, third, fifth]);
}

/**
 * Constructs a minor triad (Xm = X + 3m + 5J)
 * @param note - The root note
 * @returns Minor triad
 */
export function minorTriad(note: Note): Triad | null {
  const third = noteAdd(note, 3); // Minor third
  const fifth = noteAdd(note, 7); // Perfect fifth
  return buildTriad([note, third, fifth]);
}

/**
 * Constructs an augmented triad (X+ = X + 3M + 5aug)
 * @param note - The root note
 * @returns Augmented triad
 */
export function augmentedTriad(note: Note): Triad | null {
  const third = noteAdd(note, 4); // Major third
  const fifth = noteAdd(note, 8); // Augmented fifth
  return buildTriad([note, third, fifth]);
}

/**
 * Constructs a diminished triad (Xdim = X + 3m + 5dim)
 * @param note - The root note
 * @returns Diminished triad
 */
export function diminishedTriad(note: Note): Triad | null {
  const third = noteAdd(note, 3); // Minor third
  const fifth = noteAdd(note, 6); // Diminished fifth
  return buildTriad([note, third, fifth]);
}

// ============ TETRADS ============

/**
 * Constructs a dominant seventh chord (X7 = X + 3M + 5J + 7m)
 * @param note - The root note
 * @returns Dominant seventh tetrad
 */
export function sevenTetrad(note: Note): Tetrad | null {
  const triad = majorTriad(note);
  if (!triad) return null;
  
  const seventh = noteAdd(note, 10); // Minor seventh
  return buildTetrad([note, triad.third, triad.fifth, seventh]);
}

/**
 * Constructs a major seventh chord (X7M = X + 3M + 5J + 7M)
 * @param note - The root note
 * @returns Major seventh tetrad
 */
export function sevenMajorTetrad(note: Note): Tetrad | null {
  const triad = majorTriad(note);
  if (!triad) return null;
  
  const seventh = noteAdd(note, 11); // Major seventh
  return buildTetrad([note, triad.third, triad.fifth, seventh]);
}

/**
 * Constructs a minor seventh chord (Xm7 = X + 3m + 5J + 7m)
 * @param note - The root note
 * @returns Minor seventh tetrad
 */
export function minorSevenTetrad(note: Note): Tetrad | null {
  const triad = minorTriad(note);
  if (!triad) return null;
  
  const seventh = noteAdd(note, 10); // Minor seventh
  return buildTetrad([note, triad.third, triad.fifth, seventh]);
}

/**
 * Constructs a minor major seventh chord (Xm7M = X + 3m + 5J + 7M)
 * @param note - The root note
 * @returns Minor major seventh tetrad
 */
export function minorSevenMajorTetrad(note: Note): Tetrad | null {
  const triad = minorTriad(note);
  if (!triad) return null;
  
  const seventh = noteAdd(note, 11); // Major seventh
  return buildTetrad([note, triad.third, triad.fifth, seventh]);
}

/**
 * Constructs an augmented seventh chord (X7+ = X + 3M + 5aug + 7m)
 * @param note - The root note
 * @returns Augmented seventh tetrad
 */
export function augmentedSeventhTetrad(note: Note): Tetrad | null {
  const triad = augmentedTriad(note);
  if (!triad) return null;
  
  const seventh = noteAdd(note, 10); // Minor seventh
  return buildTetrad([note, triad.third, triad.fifth, seventh]);
}

/**
 * Constructs an augmented major seventh chord (X7M+ = X + 3M + 5aug + 7M)
 * @param note - The root note
 * @returns Augmented major seventh tetrad
 */
export function augmentedMajorSeventhTetrad(note: Note): Tetrad | null {
  const triad = augmentedTriad(note);
  if (!triad) return null;
  
  const seventh = noteAdd(note, 11); // Major seventh
  return buildTetrad([note, triad.third, triad.fifth, seventh]);
}

/**
 * Constructs a half-diminished seventh chord (Xm7b5 = X + 3m + 5dim + 7m)
 * @param note - The root note
 * @returns Half-diminished tetrad
 */
export function halfDiminishedTetrad(note: Note): Tetrad | null {
  const triad = diminishedTriad(note);
  if (!triad) return null;
  
  const seventh = noteAdd(note, 10); // Minor seventh
  return buildTetrad([note, triad.third, triad.fifth, seventh]);
}

/**
 * Constructs a fully diminished seventh chord (Xdim7 = X + 3m + 5dim + 7dim)
 * @param note - The root note
 * @returns Diminished tetrad
 */
export function diminishedTetrad(note: Note): Tetrad | null {
  const triad = diminishedTriad(note);
  if (!triad) return null;
  
  const seventh = noteAdd(note, 9); // Diminished seventh
  return buildTetrad([note, triad.third, triad.fifth, seventh]);
}

/**
 * Constructs a dominant flat five chord (X7b5 = X + 3M + 5dim + 7m)
 * @param note - The root note
 * @returns Dominant flat five tetrad
 */
export function sevenFlatFiveTetrad(note: Note): Tetrad | null {
  const third = noteAdd(note, 4);  // Major third
  const fifth = noteAdd(note, 6);  // Diminished fifth
  const seventh = noteAdd(note, 10); // Minor seventh
  return buildTetrad([note, third, fifth, seventh]);
}

/**
 * Constructs a major sixth chord (X6 = X + 3M + 5J + 6M)
 * @param note - The root note
 * @returns Major sixth chord
 */
export function sixthTetrad(note: Note): Sixth | null {
  const third = noteAdd(note, 4);  // Major third
  const fifth = noteAdd(note, 7);  // Perfect fifth
  const sixth = noteAdd(note, 9);  // Major sixth

  const triad = buildTriad([note, third, fifth]);
  if (!triad) return null;

  const expected = degreeLookup(note, 6);
  const correctedSixth = sixth[0] !== expected ? enharmony(sixth, expected) : sixth;

  return {
    ...triad,
    sixth: correctedSixth
  };
}

/**
 * Constructs a minor sixth chord (Xm6 = X + 3m + 5J + 6M)
 * @param note - The root note
 * @returns Minor sixth chord
 */
export function minorSixthTetrad(note: Note): Sixth | null {
  const third = noteAdd(note, 3);  // Minor third
  const fifth = noteAdd(note, 7);  // Perfect fifth
  const sixth = noteAdd(note, 9);  // Major sixth

  const triad = buildTriad([note, third, fifth]);
  if (!triad) return null;

  const expected = degreeLookup(note, 6);
  const correctedSixth = sixth[0] !== expected ? enharmony(sixth, expected) : sixth;

  return {
    ...triad,
    sixth: correctedSixth
  };
}

// Legacy exports for backward compatibility
export const NoteAdd = noteAdd;
export const Triad = buildTriad;
export const Tetrad = buildTetrad;
export const MajorTriad = majorTriad;
export const MinorTriad = minorTriad;
export const AugmentedTriad = augmentedTriad;
export const DiminishedTriad = diminishedTriad;
export const SevenTetrad = sevenTetrad;
export const SevenMajorTetrad = sevenMajorTetrad;
export const MinorSevenMajorTetrad = minorSevenMajorTetrad;
export const AugmentedSeventhTetrad = augmentedSeventhTetrad;
export const AugmentedMajorSeventhTetrad = augmentedMajorSeventhTetrad;
export const HalfDiminishedTetrad = halfDiminishedTetrad;
export const DiminishedTetrad = diminishedTetrad;
export const SevenFlatFiveTetrad = sevenFlatFiveTetrad;
export const SixthTetrad = sixthTetrad;
export const MinorSixthTetrad = minorSixthTetrad;
