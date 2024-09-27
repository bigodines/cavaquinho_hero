import { NoteAdd as noteAdd } from './scales';

// NECK_SIZE is the number of frets + 1
const NECK_SIZE = 13;

type Note = string; // Assuming Note is a string, adjust if necessary
type Tuning = Note[];
type FretboardArray = Note[][];

interface FretboardInterface {
    tuning: Tuning;
    fretboard: FretboardArray;
    AllChords: Note[][];
    Draw: (notes: Note[]) => void;
}

export function Fretboard(tuning: Tuning): FretboardInterface {
    // Builds the fretboard

    // fretboard consists of 13 notes per string
    // (0 is the tuning note itself)
    const f: FretboardArray = [];
    for (let i = 0; i < tuning.length; i++) {
        f[i] = [];

        for (let j = 0; j < NECK_SIZE; j++) {
            f[i][j] = noteAdd(tuning[i], j);
        }
    }

    const fretboard: FretboardInterface = {
        tuning,
        fretboard: f,
        AllChords: [],
        Draw: (notes: Note[]) => {
            // normalize input to the same enharmonic dict
            notes = notes.map((n) => noteAdd(n, 0));
            // reset any previous chords
            fretboard.AllChords = [];

            // chordConfigs contains sets of 4 notes that will be used to draw chords. It normalizes chords with
            // less than 4 sounds (triads) by doubling certain notes as well as replacing notes when there are more than 4 sounds
            // (chords with tension, pentachords etc)
            const chordConfigs: Note[][] = [];
            // triad support
            if (notes.length < tuning.length) {
                // TODO: check for bounds, hello?!?!?!

                // first strat: double the root note
                let notesAux = [...notes];
                notesAux.push(notesAux[0]);
                chordConfigs.push(notesAux);

                // second strat: double the third
                notesAux = [...notes];
                // Continue with the rest of the logic...
            }
        }
    };

    return fretboard;
}