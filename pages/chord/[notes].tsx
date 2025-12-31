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
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/router';
import Chord from '../../components/Chordz/Chord';
import Link from 'next/link';
import { fretboard, TUNINGS, ChordVoicing, MAX_FRET_SPAN } from '../../lib/fretboard';

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

/**
 * Detects potential barre chords in a fingering
 * A barre is when the same fret is used on consecutive strings
 */
function detectBarres(frets: number[]): number[] {
  const barres: number[] = [];
  const fretCounts: Record<number, number[]> = {};
  
  // Group strings by fret (excluding open strings)
  frets.forEach((fret, string) => {
    if (fret > 0) {
      if (!fretCounts[fret]) fretCounts[fret] = [];
      fretCounts[fret].push(string);
    }
  });
  
  // A barre is when a fret appears on 2+ consecutive strings
  for (const [fretStr, strings] of Object.entries(fretCounts)) {
    const fret = parseInt(fretStr);
    if (strings.length >= 2) {
      // Check if strings are consecutive
      strings.sort((a, b) => a - b);
      let consecutive = true;
      for (let i = 1; i < strings.length; i++) {
        if (strings[i] - strings[i-1] !== 1) {
          consecutive = false;
          break;
        }
      }
      if (consecutive) {
        barres.push(fret);
      }
    }
  }
  
  return barres;
}

/**
 * Converts a ChordVoicing to the ChordData format expected by the Chord component
 */
function voicingToChordData(voicing: ChordVoicing): ChordData {
  const baseFret = voicing.baseFret;
  
  // Normalize frets relative to baseFret for display (unless baseFret is 1)
  // The Chord component expects frets relative to baseFret
  const normalizedFrets = voicing.frets.map(f => {
    if (f === 0) return 0; // Open string stays 0
    if (baseFret === 1) return f; // No adjustment needed at first position
    return f - baseFret + 1; // Adjust relative to baseFret
  });
  
  return {
    frets: normalizedFrets,
    barres: detectBarres(normalizedFrets),
    fingers: [], // Could be computed but left empty for now
    capo: false,
    baseFret: baseFret > 1 ? baseFret : undefined,
  };
}

export default function ChordVisualization() {
  const router = useRouter();

  const tuning = TUNINGS.CAVAQUINHO;

  const [chords, setChords] = useState<ChordData[]>([]);
  // Dynamic fretsOnChord based on MAX_FRET_SPAN + 1 for padding
  const [fretsOnChord, setFretsOnChord] = useState(MAX_FRET_SPAN + 1);

  const instrument: Instrument = {
    strings: tuning.length,
    fretsOnChord,
    name: 'Cavaquinho',
    keys: [],
    tunings: {
      standard: tuning,
    },
  };
  const [notesArray, setNotesArray] = useState<string[]>([]);
  const [rootNote, setRootNote] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!router.isReady) return;
    const { notes } = router.query;

    if (typeof notes !== 'string') return;

    const notesList = notes.split('-');
    setNotesArray(notesList);
    // Extract the root note (first note) for the back link
    if (notesList.length > 0) {
      setRootNote(notesList[0]);
    }
    setError('');

    // Use the fretboard module to generate chord voicings
    const fb = fretboard(tuning);
    const voicings = fb.draw(notesList);
    
    if (voicings.length === 0) {
      setError('Não foi possível encontrar posições tocáveis para estas notas.');
      setChords([]);
      return;
    }

    // Calculate the max span across all voicings to set fretsOnChord
    let maxSpan = 0;
    for (const v of voicings) {
      const frettedPositions = v.frets.filter(f => f > 0);
      if (frettedPositions.length > 1) {
        const span = Math.max(...frettedPositions) - Math.min(...frettedPositions);
        maxSpan = Math.max(maxSpan, span);
      }
    }
    // Set fretsOnChord to accommodate the largest span + 1 for padding
    setFretsOnChord(Math.max(maxSpan + 2, MAX_FRET_SPAN + 1));

    // Convert voicings to the format expected by the Chord component
    const chordData = voicings.map(voicingToChordData);
    
    // Debug logging
    console.log('=== CHORD PAGE DEBUG ===');
    console.log('Input notes:', notesList);
    console.log('Voicings from fretboard:', voicings.length);
    voicings.forEach((v, i) => {
      console.log(`  ${i + 1}. frets=${JSON.stringify(v.frets)} baseFret=${v.baseFret}`);
    });
    console.log('Converted ChordData:', chordData.length);
    chordData.forEach((c, i) => {
      console.log(`  ${i + 1}. frets=${JSON.stringify(c.frets)} baseFret=${c.baseFret}`);
    });
    
    setChords(chordData);
  }, [router.isReady, router.query, tuning]);

  const renderChords = () => {
    if (error) {
      return (
        <Grid item xs={12}>
          <Alert severity="warning">{error}</Alert>
        </Grid>
      );
    }

    if (chords.length === 0) {
      return (
        <Typography variant="body1" color="text.secondary">
          Carregando...
        </Typography>
      );
    }

    return chords.map((chord, i) => (
      <Grid item xs={6} sm={4} md={3} key={i}>
        <Paper 
          sx={{ 
            p: 2, 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 24px rgba(0, 0, 0, 0.12)',
            },
          }}
        >
          <Chord chord={chord} instrument={instrument} />
          {chord.baseFret && chord.baseFret > 1 && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              {chord.baseFret}ª casa
            </Typography>
          )}
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
          href={rootNote ? `/chords?note=${encodeURIComponent(rootNote)}` : '/chords'}
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
