import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Paper,
  TableContainer,
  Button,
  TextField,
} from '@mui/material';
import Link from 'next/link';
import React, { useState, FormEvent, ChangeEvent } from 'react';
import * as chords from '../lib/chords';
import type { Triad, Tetrad, Sixth } from '../lib/chords';

type ChordResult = Triad | Tetrad | Sixth | null;

interface ChordsCollection {
  [key: string]: ChordResult;
}

function generateChords(n: string): ChordsCollection {
  if (!n || n.length < 1) {
    return {};
  }

  // Capitalize first letter
  const note = n[0].toUpperCase() + n.substring(1);

  const ret: ChordsCollection = {
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

  return ret;
}

export default function ChordTable() {
  const [note, setNote] = useState('');
  const [showTable, setShowTable] = useState(false);
  const [chordsData, setChordsData] = useState<ChordsCollection>({});

  const handleNoteChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNote(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const c = generateChords(note);

    setChordsData(c);
    setShowTable(true);
  };

  const renderChords = () => {
    const rows = Object.keys(chordsData).map((key) => {
      const chord = chordsData[key];
      if (!chord) return null;

      const notes = Object.values(chord).join('-');
      const viz = `/chord/${notes}`;

      return (
        <TableRow key={key}>
          <TableCell component="th" scope="row">
            {note + key}
          </TableCell>
          <TableCell align="right">{Object.values(chord).join(', ')}</TableCell>
          <TableCell align="right">
            <Link href={viz}>Visualizar (beta)</Link>
          </TableCell>
        </TableRow>
      );
    });

    return <TableBody>{rows}</TableBody>;
  };

  return (
    <div>
      <form
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
        style={{ textAlign: 'center', marginBottom: '2rem' }}
      >
        <TextField
          id="outlined-basic"
          label="Fundamental"
          variant="standard"
          name="rootNote"
          onChange={handleNoteChange}
          style={{ marginRight: '1rem' }}
        />
        <Button type="submit" variant="contained">
          OK
        </Button>
      </form>
      {showTable && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650, width: 1200 }} aria-label="chord table">
            <TableHead>
              <TableRow>
                <TableCell>Acorde</TableCell>
                <TableCell align="right">Notas</TableCell>
                <TableCell align="right">Extras</TableCell>
              </TableRow>
            </TableHead>
            {renderChords()}
          </Table>
        </TableContainer>
      )}
    </div>
  );
}
