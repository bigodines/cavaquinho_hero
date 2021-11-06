import { MajorDiatonicScale } from './tonality'

describe('tonality lib', () => {
    it('generates the major diatonic scales', () => {
        const result = MajorDiatonicScale('C')
        expect(result).toEqual(['C', 'Dm', 'Em', 'F', 'G7', 'Am', 'Bm7b5'])
    })
})
