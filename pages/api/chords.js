/*
* Given a note, display all possible chords (only triads and tetrads, 6 and 7s)
*/
export default (req, res) => {
    let n = req.query.note

    if (!n || n.length < 1) {
        return res.status(400).send('Enter a valid note!');
    }

    n = n[0].toUpperCase() + n.substring(1)

    const chord = {
        '': chords.MajorTriad(n),
        m: chords.MinorTriad(n),
        '+': chords.AugmentedTriad(n),
        '°': chords.DiminishedTriad(n),
        7: chords.SevenTetrad(n),
        '7M': chords.SevenMajorTetrad(n),
        m7: chords.minorSevenTetrad(n),
        'm7+': chords.MinorSevenMajorTetrad(n),
        '7(#5)': chords.AugmentedSeventhTetrad(n),
        '7+(#5)': chords.AugmentedMajorSeventhTetrad(n),
        Ø: chords.HalfDiminishedTetrad(n),
        o: chords.DiminishedTetrad(n),
        '7(b5)': chords.SevenFlatFiveTetrad(n),
        6: chords.SixthTetrad(n),
        m6: chords.MinorSixthTetrad(n)
    }

    res.status(200).json(chord);
}