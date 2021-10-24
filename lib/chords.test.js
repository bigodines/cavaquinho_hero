/* eslint-disable no-undef */
const chords = require('./chords')

/**
 * @jest-environment jsdom
 */
describe('lib.Chords', () => {
    it('can run tests', () => {
        expect(true).toBe(true)
    })

    it('Uses enharmonic notes contained in the scale for tetrads', () => {
        // in the D scale, the seventh is Cb and not B
        // (even tho they sound the same)
        let actual = chords.DiminishedTetrad('D')
        expect(actual.first).toBe('D')
        expect(actual.third).toBe('F')
        expect(actual.fifth).toBe('Ab')
        expect(actual.seventh).toBe('Cb')

        actual = chords.MinorSevenMajorTetrad('G')
        expect(actual.first).toBe('G')
        expect(actual.third).toBe('Bb')
        expect(actual.fifth).toBe('D')
        expect(actual.seventh).toBe('F#')
    })
})
