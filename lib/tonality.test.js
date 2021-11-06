import { MajorDiatonicScale } from './tonality'

describe('tonality lib', () => {
    it('generates the major diatonic scales', () => {
        let result = MajorDiatonicScale('C')
        expect(result).toEqual(['C', 'Dm', 'Em', 'F', 'G7', 'Am', 'Bm7b5'])

        result = MajorDiatonicScale('A', true)
        expect(result).toEqual(['A7+', 'Bm7', 'C#m7', 'D7+', 'E7', 'F#m7', 'G#m7b5'])
    })
})
