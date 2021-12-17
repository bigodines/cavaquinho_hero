const scales = require('./scales')

describe('lib.Scales', () => {
    it('can generate the major scale', () => {
        // Remember major scale: whole, whole, half, whole, whole, whole, half
        let expected = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
        let result = scales.Major('C')
        expect(result).toEqual(expected)

        expected = ['D', 'E', 'F#', 'G', 'A', 'B', 'C#']
        result = scales.Major('D')
        expect(result).toEqual(expected)

        expected = ['Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb', 'C']
        result = scales.Major('Db')
        expect(result).toEqual(expected)
    })

    it('checks if a note is valid', () => {
        expect(scales.IsValidNote('A')).toBeTruthy()
        expect(scales.IsValidNote('C#')).toBeTruthy()
        expect(scales.IsValidNote('Fb')).toBeTruthy()

        expect(scales.IsValidNote('Z')).toBeFalsy()
        expect(scales.IsValidNote('CC')).toBeFalsy()
    })

    it('can generate the minor harmonic scale', () => {
        let expected = ['A', 'B', 'C', 'D', 'E', 'F', 'G#']
        let result = scales.MinorHarmonic('A')
        expect(result).toEqual(expected)

        expected = ['D', 'E', 'F', 'G', 'A', 'Bb', 'C#']
        result = scales.MinorHarmonic('D')
        expect(result).toEqual(expected)
    })
})
