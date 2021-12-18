import { DominantChord, IIChord, MajorDiatonicScale, SubV } from './tonality'

describe('tonality lib', () => {
    it('generates the major diatonic scales', () => {
        let result = MajorDiatonicScale('C')
        expect(result).toEqual(['C', 'Dm', 'Em', 'F', 'G7', 'Am', 'Bm7b5'])

        result = MajorDiatonicScale('A', true)
        expect(result).toEqual(['A7+', 'Bm7', 'C#m7', 'D7+', 'E7', 'F#m7', 'G#m7b5'])
    })

    it('generates dominant chords', () => {
        let result = DominantChord('D')
        expect(result).toEqual('A7')

        result = DominantChord('Eb')
        expect(result).toEqual('Bb7')

        result = DominantChord('C#')
        expect(result).toEqual('G#7')
    })

    it('generates II chords', () => {
        expect(IIChord('D')).toEqual('Em')
        expect(IIChord('Cb')).toEqual('Dbm')
        expect(IIChord('Am')).toEqual('Bm7b5')
        expect(IIChord('Em')).toEqual('F#m7b5')
    })

    it('generates SubV chords', () => {
        expect(SubV('F')).toEqual('Gb7')
        expect(SubV('Am')).toEqual('Bb7')
    })
})
