import {
    NoteAdd as noteAdd,
    DegreeLookup, Enharmony
} from './scales'
/*
----------- Triads -----------
The comments before funcs describe distances from note or from the previous note
For example:
<note> chord = 3rd degree from note (4 semi tones) + 5th degree from note (7 semi tones) OR
<note> chord = 3rd degree from note (4 semi tones) + 3rd degree minor from third (3 semi tones)

they are obviously the same, so pick the way you want to study
*/
function Triad(notes) {
    if (notes.length !== 3) {
        return null
    }
    const chord = {
        first: notes[0],
        third: notes[1],
        fifth: notes[2]
    }

    let expected = DegreeLookup(notes[0], 3)

    if (chord.third[0] !== expected) {
        chord.third = Enharmony(chord.third, expected)
    }

    expected = DegreeLookup(notes[0], 5)
    if (chord.fifth[0] !== expected) {
        chord.fifth = Enharmony(chord.fifth, expected)
    }

    return chord
}

// X = X + 3M + 5J
// X = X + 3M + 3m
function majorTriad(note) {
    const third = noteAdd(note, 4)
    const fifth = noteAdd(note, 7) // or 3 from the 3rd

    return Triad([note, third, fifth])
}

// Xm = X + 3m + 5J
// Xm = X + 3m + 3M
function minorTriad(note) {
    const third = noteAdd(note, 3)
    const fifth = noteAdd(note, 7)

    return Triad([note, third, fifth])
}

// X+ = X + 3M + 5aum
// X+ = X + 3M + 3M
function augmentedTriad(note) {
    const third = noteAdd(note, 4)
    const fifth = noteAdd(note, 8)

    return Triad([note, third, fifth])
}

// Xdim = 3m + 5dim
// Xdim = 3m + 3m
function diminishedTriad(note) {
    const third = noteAdd(note, 3)
    const fifth = noteAdd(note, 6)

    return Triad([note, third, fifth])
}

/*
----------- Tetrads -----------
*/
function Tetrad(notes) {
    if (notes.length !== 4) {
        return null
    }

    const chord = {
        first: notes[0],
        third: notes[1],
        fifth: notes[2],
        seventh: notes[3]
    }

    let expected = DegreeLookup(notes[0], 3)

    if (chord.third[0] !== expected) {
        chord.third = Enharmony(chord.third, expected)
    }

    expected = DegreeLookup(notes[0], 5)
    if (chord.fifth[0] !== expected) {
        chord.fifth = Enharmony(chord.fifth, expected)
    }

    expected = DegreeLookup(notes[0], 7)
    if (chord.seventh[0] !== expected) {
        chord.seventh = Enharmony(chord.seventh, expected)
    }

    return chord
}

// X7 = 3M + 5J + 7m
// X7 = 3M + 3m + 3m
function sevenTetrad(note) {
    const triad = majorTriad(note)
    const third = triad.third
    const fifth = triad.fifth
    const seventh = noteAdd(note, 10)

    return Tetrad([note, third, fifth, seventh])
}

// X7M = X + 3M + 5J + 7M
// X7M = X + 3M + 3m + 3M
function sevenMajorTetrad(note) {
    const triad = majorTriad(note)

    const third = triad.third
    const fifth = triad.fifth
    const seventh = noteAdd(note, 11)

    return Tetrad([note, third, fifth, seventh])
}

// Xm7 = X + 3m + 5J + 7m
// Xm7 = X + 3m + 3M + 3m
function minorSevenTetrad(note) {
    // just add a seventh minor to the minor triad
    const triad = minorTriad(note)

    const third = triad.third
    const fifth = triad.fifth
    const seventh = noteAdd(note, 10)

    return Tetrad([note, third, fifth, seventh])
}

// Xm7M = X + 3m + 5J + 7M
// Xm7M = X + 3m + 3M + 3M
function minorSevenMajorTetrad(note) {
    const triad = minorTriad(note)
    const third = triad.third
    const fifth = triad.fifth
    const seventh = noteAdd(note, 11)

    return Tetrad([note, third, fifth, seventh])
}

// X7+ = X + 3M + 5aum + 7m
// X7+ = X + 3M + 3M + 3dim
function augmentedSeventhTetrad(note) {
    const triad = augmentedTriad(note)

    const third = triad.third
    const fifth = triad.fifth
    const seventh = noteAdd(note, 10)

    return Tetrad([note, third, fifth, seventh])
}

// X7+ = X + 3M + 5aum + 7m
// X7+ = X + 3M + 3M + 3dim
function augmentedMajorSeventhTetrad(note) {
    const triad = augmentedTriad(note)
    const third = triad.third
    const fifth = triad.fifth

    const seventh = noteAdd(note, 11)

    return Tetrad([note, third, fifth, seventh])
}

// Xm7(b5) = X + 3m + 5dim + 7m
// Xm7(b5) = X + 3m + 3m + 3M
function halfDiminishedTetrad(note) {
    const triad = diminishedTriad(note)
    const third = triad.third
    const fifth = triad.fifth
    const seventh = noteAdd(note, 10)

    return Tetrad([note, third, fifth, seventh])
}

// Xdim = X + 3m + 3m + 3m
// Xdim = X + 3m + 5dim + 7dim
function diminishedTetrad(note) {
    const triad = diminishedTriad(note)
    const third = triad.third
    const fifth = triad.fifth
    const seventh = noteAdd(note, 9)

    return Tetrad([note, third, fifth, seventh])
}

// X7(b5) = X + 3M + 3dim + 3M
// TODO: figure whatś the english name for this note.
function sevenFlatFiveTetrad(note) {
    const third = noteAdd(note, 4)
    const fifth = noteAdd(third, 2)
    const seventh = noteAdd(fifth, 4)

    return Tetrad([note, third, fifth, seventh])
}

// X6 = X + 3M + 5J + 6M
function sixthTetrad(note) {
    const third = noteAdd(note, 4)
    const fifth = noteAdd(note, 7)
    const sixth = noteAdd(note, 9)

    // generate the triad and manually construct the tetrad since we are replacing the seventh with the sixth
    const chord = Triad([note, third, fifth])

    const expected = DegreeLookup(note, 6)
    if (sixth[0] !== expected) {
        chord.sixth = Enharmony(sixth, expected)
    } else {
        chord.sixth = sixth
    }

    return chord
}

// Xm6 = X + 3m + 5J + 6M
function minorSixthTetrad(note) {
    const third = noteAdd(note, 3)
    const fifth = noteAdd(note, 7)
    const sixth = noteAdd(note, 9)

    // generate the triad and manually construct the tetrad since we are replacing the seventh with the sixth
    const chord = Triad([note, third, fifth])

    const expected = DegreeLookup(note, 6)
    if (sixth[0] !== expected) {
        chord.sixth = Enharmony(sixth, expected)
    } else {
        chord.sixth = sixth
    }

    return chord
}

export const NoteAdd = noteAdd
const _Triad = Triad
export { _Triad as Triad }
const _Tetrad = Tetrad
export { _Tetrad as Tetrad }
export const MajorTriad = majorTriad
export const MinorTriad = minorTriad
export const AugmentedTriad = augmentedTriad
export const DiminishedTriad = diminishedTriad
export const SevenTetrad = sevenTetrad
export const SevenMajorTetrad = sevenMajorTetrad
const _minorSevenTetrad = minorSevenTetrad
export { _minorSevenTetrad as minorSevenTetrad }
export const MinorSevenMajorTetrad = minorSevenMajorTetrad
export const AugmentedSeventhTetrad = augmentedSeventhTetrad
export const AugmentedMajorSeventhTetrad = augmentedMajorSeventhTetrad
export const HalfDiminishedTetrad = halfDiminishedTetrad
export const DiminishedTetrad = diminishedTetrad
export const SevenFlatFiveTetrad = sevenFlatFiveTetrad
export const SixthTetrad = sixthTetrad
export const MinorSixthTetrad = minorSixthTetrad
