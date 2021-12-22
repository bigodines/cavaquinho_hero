import {
    NoteAdd as noteAdd,
} from './scales'


// NECK_SIZE is the number of frets + 1
const NECK_SIZE = 13
export function Fretboard(tuning) {
    // Builds the fretboard

    // fretboard consists of 13 notes per string
    // (0 is the tunning note itself)
    const f = []
    for (let i = 0; i < tuning.length; i++) {
        f[i] = []

        for (let j = 0; j < NECK_SIZE; j++) {
            f[i][j] = noteAdd(tuning[i], j)
        }
    }

    this.tuning = tuning
    this.fretboard = f
    this.AllChords = []

    /**
     * Given a set of notes, finds their positions in the fretboard
     * Display notes in the fretboard
     */
    this.Draw = (notes) => {
        // normalize input to the same enharmonic dict
        notes = notes.map((n) => {
            return noteAdd(n, 0)
        })
        // reset any previous chords
        this.AllChords = []

        // chordConfigs contains sets of 4 notes that will be used to draw chords. It normalizes chords with
        // less than 4 sounds (triads) by doubling certain notes as well as replacing notes when there are more than 4 sounds
        // (chords with tension, pentachords etc)
        const chordConfigs = []
        // triad support
        if (notes.length < 4) {
            // TODO: check for bounds, hello?!?!?!

            // first strat: double the root note
            let notesAux = [...notes]
            notesAux.push(notesAux[0])
            chordConfigs.push(notesAux)

            // second strat: double the third
            notesAux = [...notes]
            notesAux.push(notesAux[1])
            chordConfigs.push(notesAux)

            // third strat: double the fifth
            notesAux = [...notes]
            notesAux.push(notesAux[2])
            chordConfigs.push(notesAux)
        } else if (notes.length === 4) {
            chordConfigs.push(notes)
        }

        for (let i = 0; i < chordConfigs.length; i++) {
            // build all possible chords from each of the notes from the 1st string
            this.buildChord(chordConfigs[i], 0, 0, [], 999, 0)
        }

        // TODO: sort by easiest to build

        // console.debug(this.AllChords)
        return this.AllChords
    }

    this.buildChord = (remainingNotes, string, fret, currentResult, min, max) => {
        if (currentResult && (remainingNotes.length === 0 || string > this.fretboard.length)) {
            this.AllChords.push(currentResult)
        }
        const notesCp = [...remainingNotes]

        for (let i = string; i < this.fretboard.length; i++) {
            for (let j = fret; j < NECK_SIZE; j++) {
                const noteIdx = notesCp.indexOf(this.GetNote(i, j))
                if (noteIdx >= 0) {
                    // found a note from our target! check if it is valid
                    if (j < min && j > 0) {
                        min = j
                    }
                    if (j > max) {
                        max = j
                    }
                    if (max - min > 6) {
                        continue // too hard. bigo's hands are small
                    }

                    // console.debug(`Found the ${this.fretboard[i][j]} string: ${i} fret: ${j}`)
                    const downStream = [...notesCp]
                    downStream.splice(noteIdx, 1)
                    currentResult[i] = j
                    this.buildChord(downStream, i + 1, 0, [...currentResult], min, max)
                }
            }
        }
    }

    this.GetNote = (string, fret) => {
        return this.fretboard[string][fret]
    }

    return this
}

/**
 * Return an array with all possible positions to assembly
 * a given chord in the fretboard
 * @param {string} name
 * @returns {Array}
 */
Fretboard.prototype.chord = (name) => {
    const f = this.fretboard
    return f
}

