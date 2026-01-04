import type { NextApiRequest, NextApiResponse } from 'next';
import * as chords from '../../lib/chords';

/**
 * Given a note, display all possible chords (triads and tetrads)
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const n = req.query.note;

  if (!n || typeof n !== 'string' || n.length < 1) {
    return res.status(400).json({ error: 'Enter a valid note!' });
  }

  const note = n[0].toUpperCase() + n.substring(1);

  const chordData = {
    '': chords.majorTriad(note),
    m: chords.minorTriad(note),
    '+': chords.augmentedTriad(note),
    '°': chords.diminishedTriad(note),
    7: chords.sevenTetrad(note),
    '7M': chords.sevenMajorTetrad(note),
    m7: chords.minorSevenTetrad(note),
    'm7+': chords.minorSevenMajorTetrad(note),
    '7(#5)': chords.augmentedSeventhTetrad(note),
    '7+(#5)': chords.augmentedMajorSeventhTetrad(note),
    Ø: chords.halfDiminishedTetrad(note),
    o: chords.diminishedTetrad(note),
    '7(b5)': chords.sevenFlatFiveTetrad(note),
    6: chords.sixthTetrad(note),
    m6: chords.minorSixthTetrad(note),
  };

  res.status(200).json(chordData);
}
