const dict = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
// these 3 arrays could be 1 really long one + a math formula but i'm here for the long term reddability
// so...  basic chromatic scale
const chromA = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#']
// synonyms
const chromB = ['Bbb', 'Cbb', 'Cb', 'Dbb', 'Db', 'Ebb', 'Fbb', 'Fb', 'Gbb', 'Gb', 'Abb', 'Ab']
const chromC = ['G##', 'Bb', 'A##', 'B#', 'B##', 'C##', 'Eb', 'D##', 'E#', 'E##', 'F##', 'G#']

const allScales = [chromA, chromB, chromC]

// IsValidNote checks if a note is valid or not
export const IsValidNote = (note) => {
    for (let i = 0; i < allScales.length; i++) {
        if (allScales[i].indexOf(note) >= 0) return true
    }
    return false
}

// NoteAdd adds `semiTone` numbers of semi-tones to a `note` and return the result note
export const NoteAdd = (note, semiTone) => {
    let noteIdx = -1
    for (let i = 0; i < allScales.length; i++) {
        noteIdx = allScales[i].indexOf(note)
        if (noteIdx >= 0) break
    }

    let pos = noteIdx + semiTone
    if (pos >= chromA.length) {
        pos = pos - chromA.length
    }
    return chromA[pos]
}

// DegreeLookup finds what is the expected note for a given degree given a root note.
// Example: (C, 3) = E
// Example2: (Eb, 7) = D
export const DegreeLookup = (note, degree) => {
    const firstPos = dict.indexOf(note[0])
    let normalizedIdx = firstPos + degree - 1
    // cycles thru the notes allowing us to start in a non-0 idx and get a degree > remaining of array
    if (normalizedIdx >= dict.length) {
        normalizedIdx = normalizedIdx - dict.length
    }

    return dict[normalizedIdx]
}

// Enharmony finds the proper enharmonic scale to use to get the right note name
export const Enharmony = (from, to) => {
    let noteIdx = -1
    for (let i = 0; i < allScales.length; i++) {
        noteIdx = allScales[i].indexOf(from)
        if (noteIdx >= 0) break
    }

    // sanity check
    if (noteIdx === -1) {
        console.error('note does not exist: ', from)
    }

    for (let i = 0; i < allScales.length; i++) {
        if (allScales[i][noteIdx][0] === to) {
            return allScales[i][noteIdx]
        }
    }

    // [hopefully] unreachable code
    return from
}

/*
----------------------- Scales ----------------
 */

// Returns the major scale given a root note (W W H W W W H)
export const Major = (root) => {
    // (W W H W W W H) , except that we stop at the 7th degree
    const scaleSteps = [2, 2, 1, 2, 2, 2]

    return scaleGenerator(root, scaleSteps)
}

// HarmonicMinor return the minor harmonic scale given a root note (W H W W H W1⁄2 H)
export const HarmonicMinor = (root) => {
    const scaleSteps = [2, 1, 2, 2, 1, 3]

    return scaleGenerator(root, scaleSteps)
}

const scaleGenerator = (root, scaleSteps) => {
    if (!IsValidNote(root)) {
        return [root]
    }
    const resultScale = [root]
    let degree = 2
    let lastAddedNote = root
    for (let i = 0; i < scaleSteps.length; i++) {
        let target = NoteAdd(lastAddedNote, scaleSteps[i])
        const expected = DegreeLookup(root, degree)
        if (target[0] !== expected) {
            target = Enharmony(target, expected)
        }
        resultScale.push(target)
        lastAddedNote = target
        degree++
    }

    return resultScale
}
