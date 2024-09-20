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

    it('can draw more than once', () => {
        const fb = new Fretboard(['D', 'G', 'B', 'D'])

        const G7 = ['G', 'B', 'D', 'F']
        let actual = fb.Draw(G7)

        for (let c = 0; c < actual.length; c++) {
            const chord = actual[c]
            expect(validateChord(fb, chord, G7)).toBeTruthy()
        }
        // TODO: add a manual and predictable configuration for each of these chords

        const Am7 = ['A', 'C', 'E', 'G']
        actual = fb.Draw(Am7)

        for (let c = 0; c < actual.length; c++) {
            const chord = actual[c]
            expect(validateChord(fb, chord, Am7)).toBeTruthy()
        }

        const Bb7 = ['A#', 'D', 'F', 'G#'] // normalized to their enharmonic
        actual = fb.Draw(Bb7)
        for (let c = 0; c < actual.length; c++) {
            const chord = actual[c]
            expect(validateChord(fb, chord, Bb7)).toBeTruthy()
        }
    })

    it('can draw tricky triads', () => {
        const fb = Fretboard(['D', 'G', 'B', 'D'])

        const Amaj = ['A', 'C#', 'E']

        const actual = fb.Draw(Amaj)

        for (let c = 0; c < actual.length; c++) {
            const chord = actual[c]
            expect(validateChord(fb, chord, Amaj)).toBeTruthy()
        }
    })
})

// helper method to validate that a chord contains expected notes and nothing more
function validateChord(fb, chord, originalNotes) {
    const notes = [...originalNotes]
    if (chord.length < notes.length) {
        return false
    }

    for (let string = 0; string < chord.length; string++) {
        const chordNote = fb.GetNote(string, chord[string])

        if (notes.indexOf(chordNote) < 0) {
            console.debug(`It looks like ${chordNote} is not in ${notes}`)
            return false
        }
    }

    for (let i = 0; i < chord.length; i++) {
        const chordNote = fb.GetNote(i, chord[i])
        notes.splice(notes.indexOf(chordNote), 1)
    }
    if (notes.length !== 0) {
        return false
    }

    return true
}
