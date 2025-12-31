import Header from '../../components/Header/Header';
import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Grid, 
  Typography, 
  Box, 
  Paper, 
  Chip,
  Button,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/router';
import Chord from '../../components/Chordz/Chord';
import Link from 'next/link';

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
  const [notesArray, setNotesArray] = useState<string[]>([]);

  useEffect(() => {
    if (!router.isReady) return;
    const { notes } = router.query;

    if (typeof notes !== 'string') return;

    setNotesArray(notes.split('-'));

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
        <Typography variant="body1" color="text.secondary">
          Carregando...
        </Typography>
      );
    }

    return chords.map((chord, i) => (
      <Grid item xs={12} sm={6} md={4} key={i}>
        <Paper 
          sx={{ 
            p: 3, 
            display: 'flex', 
            justifyContent: 'center',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 24px rgba(0, 0, 0, 0.12)',
            },
          }}
        >
          <Chord chord={chord} instrument={instrument} />
        </Paper>
      </Grid>
    ));
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Header />
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        {/* Back Button */}
        <Button
          component={Link}
          href="/chords"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 3, color: 'text.secondary' }}
        >
          Voltar para acordes
        </Button>

        {/* Header */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: { xs: 3, md: 4 }, 
            mb: 4,
            background: 'linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%)',
            borderRadius: 3,
            color: 'white',
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            Visualização no Braço
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {notesArray.map((note, index) => (
              <Chip 
                key={index}
                label={note}
                sx={{ 
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '1rem',
                }}
              />
            ))}
          </Box>
        </Paper>

        {/* Chord Diagrams */}
        <Grid container spacing={3}>
          {renderChords()}
        </Grid>

        {/* Info Box */}
        <Box sx={{ mt: 4, p: 3, backgroundColor: '#fff', borderRadius: 2, boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)' }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Nota:</strong> A visualização mostra possíveis posições para tocar 
            estas notas no cavaquinho (afinação D-G-B-D). Diferentes inversões e 
            posições podem ser exploradas.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
