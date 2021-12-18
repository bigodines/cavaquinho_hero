import { Major, HarmonicMinor, NoteAdd, DegreeLookup, Enharmony } from './scales'
/**
 * Tonality and harmonic fields methods
 */

/**
 * MajorDiatonicScale generates the basic harmonic field of a given root note
 * @param {string} root note
 * @param {boolean} tetrads should we include the 7ths in the resulting scale?
 * @returns {Array} of diatonic chords
 */
export const MajorDiatonicScale = (root, tetrads = false) => {
    const scale = Major(root)
    if (!scale || scale.length !== 7) {
        console.error('invalid note')
        return []
    }

    for (let i = 0; i < scale.length; i++) {
        const degree = i + 1
        if ((degree === 1 || degree === 4) && tetrads) {
            scale[i] = scale[i] + '7+'
            continue
        }
        if (degree === 2 || degree === 3 || degree === 6) {
            const m = tetrads ? 'm7' : 'm'
            scale[i] = scale[i] + m
            continue
        }
        if (degree === 5) {
            scale[i] = scale[i] + '7'
            continue
        }
        if (degree === 7) {
            scale[i] = scale[i] + 'm7b5'
            continue
        }
    }

    return scale
}

// TODO: implement
export const HarmonicMinorDiatonicScale = (root, tetrads = false) => {
    const scale = HarmonicMinor(root)

    return scale
}

/**
 * DominantChord finds the dominant (V) chord to a given chord
 * @param {string} chord - The chord we want to find the dominant for (E.g.: Am, C, etc)
 * @returns {string} the V degree in the major scale for that chord (aka. the dominant chord)
 */
export const DominantChord = (chord) => {
    const root = extractRootFromChord(chord)
    const scale = Major(root)
    // 5th degree 7th
    return scale[4] + '7'
}

/**
 * IIChord assists in building the II-V-I progression by figuring your which chord is the II for any given chord
 * @param {string} chord - The chord we want to find the II for (E.g: G, Bbm, etc)
 * @returns {string} the II degree for the given `chord` so that we can build II-V-I progression
 */
export const IIChord = (chord) => {
    let minor = false
    if (chord?.indexOf('m') > 0) {
        minor = true
    }

    const root = extractRootFromChord(chord)
    const scale = Major(root)
    if (minor) {
        return scale[1] + 'm7b5'
    } else {
        return scale[1] + 'm'
    }
}

/**
 * SubV returns the alternative dominant chord that can be used to prepare any given chord
 * @param {string} chord
 * @returns {string} the SubV dominant chord that can be used instead of the V degree to prepare for the tonic
 */
export const SubV = (chord) => {
    const root = extractRootFromChord(chord)

    let target = NoteAdd(root, 1)
    const expected = DegreeLookup(root, 2)
    if (target[0] !== expected) {
        target = Enharmony(target, expected)
    }

    return target + '7'
}

/**
 * Returns the root note of a given chord
 * @param {string} chord
 * @returns {char} root note of the chord
 */
const extractRootFromChord = (chord) => {
    return chord.replace('m', '').replace('7', '').replace('+', '').replace('b5', '')
}
