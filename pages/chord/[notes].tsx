import Header from '../../components/Header/Header';
import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import Chord from '../../components/Chordz/Chord';

interface ChordData {
  frets: number[];
  barres: number[];
  fingers: number[];
  capo: boolean;
  baseFret?: number;
}

interface Instrument {
  strings: number;
  fretsOnChord: number;
  name: string;
  keys: string[];
  tunings: {
    standard: string[];
  };
}

export default function ChordVisualization() {
  const router = useRouter();

  const tuning = ['D', 'G', 'B', 'D'];

  const instrument: Instrument = {
    strings: tuning.length,
    fretsOnChord: 12,
    name: 'Cavaquinho',
    keys: [],
    tunings: {
      standard: tuning,
    },
  };

  const [chords, setChords] = useState<ChordData[]>([]);
  const [notesDisplay, setNotesDisplay] = useState<string>('');

  useEffect(() => {
    if (!router.isReady) return;
    const { notes } = router.query;

    if (typeof notes !== 'string') return;

    setNotesDisplay(notes.split('-').join(' - '));

    // For now, create a simple placeholder chord
    // The actual chord generation would need to be implemented in fretboard.ts
    const placeholderChord: ChordData = {
      frets: Array(tuning.length).fill(0),
      barres: [],
      fingers: [],
      capo: false,
      baseFret: 1,
    };

    setChords([placeholderChord]);
  }, [router.isReady, router.query, tuning.length]);

  const renderChords = () => {
    if (chords.length === 0) {
      return (
        <Typography variant="body1">
          Chord visualization coming soon...
        </Typography>
      );
    }

    return chords.map((chord, i) => (
      <Grid item xs={6} sm={4} md={3} key={i}>
        <Chord chord={chord} instrument={instrument} />
      </Grid>
    ));
  };

  return (
    <>
      <Header />
      <Container maxWidth="lg" className="container">
        <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
          Notes: {notesDisplay}
        </Typography>
        <Grid container spacing={4}>
          {renderChords()}
        </Grid>
      </Container>
    </>
  );
}
