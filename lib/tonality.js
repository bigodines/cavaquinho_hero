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

export const DominantChord = (target) => {
    target = target.replace('m', '').replace('7', '').replace('+', '').replace('b5', '')
    const scale = Major(target)
    // 5th degree 7th
    return scale[4] + '7'
}

export const IIChord = (root) => {
    let minor = false
    if (root?.indexOf('m') > 0) {
        minor = true
    }
    root = root.replace('m', '').replace('7', '').replace('+', '').replace('b5', '')
    const scale = Major(root)
    if (minor) {
        return scale[1] + 'm7b5'
    } else {
        return scale[1] + 'm'
    }
}

export const SubV = (root) => {
    root = root.replace('m', '').replace('7', '').replace('+', '').replace('b5', '')

    let target = NoteAdd(root, 1)
    const expected = DegreeLookup(root, 2)
    if (target[0] !== expected) {
        target = Enharmony(target, expected)
    }

    return target + '7'
}
