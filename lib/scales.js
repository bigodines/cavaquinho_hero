const dict = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
// these 3 arrays could be 1 really long one + a math formula but i'm here for the long term reddability
// so...  basic chromatic scale
const chromA = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#']
// synonyms
const chromB = ['Bbb', 'Cbb', 'Cb', 'Dbb', 'Db', 'Ebb', 'Fbb', 'Fb', 'Gbb', 'Gb', 'Abb', 'Ab']
const chromC = ['G##', 'Bb', 'A##', 'B#', 'B##', 'C##', 'Eb', 'D##', 'E#', 'E##', 'F##', 'G#']

const allScales = [chromA, chromB, chromC]

// noteAdd adds `semiTone` numbers of semi-tones to a `note` and return the result note
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

export const DegreeLookup = (note, degree) => {
    const firstPos = dict.indexOf(note[0])
    let expectedThirdIdx = firstPos + degree - 1
    if (expectedThirdIdx >= dict.length) {
        expectedThirdIdx = expectedThirdIdx - dict.length
    }

    return dict[expectedThirdIdx]
}

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

// Generates the major scale given a root note ()
export const Major = (root) => {
    return []
}
