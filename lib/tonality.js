import { Major } from './scales'
/**
 * Tonality and harmonic fields methods
 */

// const chords = require('./chords')
/**
 * MajorDiatonicScale generates the basic harmonic field of a given root note
 * @param {string} root note
 * @param {boolean} tetrads should we include the 7ths in the resulting scale?
 * @returns {Array} of diatonic chords
 */
export const MajorDiatonicScale = (root, tetrads = false) => {
    const scale = Major(root)
    if (!scale || scale.length !== 7) {
        console.log('wtf')
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
