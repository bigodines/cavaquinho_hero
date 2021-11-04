const scales = require('./scales')

describe('lib.Scales', () => {
    it('can generate the major scale', () => {
        // Remember major scale: whole, whole, half, whole, whole, whole, half
        const expected = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
        const result = scales.Major('C')
        expect(result).toBe(expected)
    })
})
