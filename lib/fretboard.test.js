import { Fretboard } from './fretboard'

describe('lib.Fretboard', () => {
    it('can create a valid fretboard', () => {
        // 1 string instrument
    let fb = new Fretboard(['C'])

    let actual = fb.fretboard

    expect(actual[0][0]).toBe('C') 
    expect(actual[0][12]).toBe('C')
    expect(actual[0][2]).toBe('D') 

    // 2 strings
    fb = new Fretboard(['A', 'D'])

    actual = fb.fretboard
    expect(actual[0][4]).toBe('C#')
    expect(actual[1][3]).toBe('F') 
    })
})
