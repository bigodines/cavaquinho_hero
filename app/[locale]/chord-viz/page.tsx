'use client';

export const dynamic = 'force-dynamic';

import Header from '../../../components/Header/Header';
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
import Chord from '../../../components/Chordz/Chord';
import Link from 'next/link';
import { fretboard, TUNINGS, ChordVoicing, MAX_FRET_SPAN } from '../../../lib/fretboard';
import { useLocale } from 'next-intl';

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
 */
function detectBarres(frets: number[]): number[] {
  const barres: number[] = [];
  const fretCounts: Record<number, number[]> = {};
  
  frets.forEach((fret, string) => {
    if (fret > 0) {
      if (!fretCounts[fret]) fretCounts[fret] = [];
      fretCounts[fret].push(string);
    }
  });
  
  for (const [fretStr, strings] of Object.entries(fretCounts)) {
    const fret = parseInt(fretStr);
    if (strings.length >= 2) {
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
 * Converts a ChordVoicing to ChordData format
 */
function voicingToChordData(voicing: ChordVoicing): ChordData {
  const baseFret = voicing.baseFret;
  
  const normalizedFrets = voicing.frets.map(f => {
    if (f === 0) return 0;
    if (baseFret === 1) return f;
    return f - baseFret + 1;
  });
  
  return {
    frets: normalizedFrets,
    barres: detectBarres(normalizedFrets),
    fingers: [],
    capo: false,
    baseFret: baseFret > 1 ? baseFret : undefined,
  };
}

export default function ChordVisualization() {
  const locale = useLocale();
  const tuning = TUNINGS.CAVAQUINHO;

  const [chords, setChords] = useState<ChordData[]>([]);
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
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Get notes from URL query parameter
    const searchParams = new URLSearchParams(window.location.search);
    const notesParam = searchParams.get('notes');
    
    if (!notesParam) {
      setError(locale === 'pt' 
        ? 'Nenhuma nota especificada.'
        : 'No notes specified.');
      setIsLoaded(true);
      return;
    }

    const notesList = notesParam.split('-');
    setNotesArray(notesList);
    
    if (notesList.length > 0) {
      setRootNote(notesList[0]);
    }
    setError('');

    const fb = fretboard(tuning);
    const voicings = fb.draw(notesList);
    
    if (voicings.length === 0) {
      setError(locale === 'pt' 
        ? 'Não foi possível encontrar posições tocáveis para estas notas.'
        : 'Could not find playable positions for these notes.');
      setChords([]);
      setIsLoaded(true);
      return;
    }

    let maxSpan = 0;
    for (const v of voicings) {
      const frettedPositions = v.frets.filter(f => f > 0);
      if (frettedPositions.length > 1) {
        const span = Math.max(...frettedPositions) - Math.min(...frettedPositions);
        maxSpan = Math.max(maxSpan, span);
      }
    }
    setFretsOnChord(Math.max(maxSpan + 2, MAX_FRET_SPAN + 1));

    const chordData = voicings.map(voicingToChordData);
    setChords(chordData);
    setIsLoaded(true);
  }, [tuning, locale]);

  const renderChords = () => {
    if (!isLoaded) {
      return (
        <Typography variant="body1" color="text.secondary">
          {locale === 'pt' ? 'Carregando...' : 'Loading...'}
        </Typography>
      );
    }

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
          {locale === 'pt' ? 'Nenhum acorde encontrado.' : 'No chords found.'}
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
              {chord.baseFret}ª {locale === 'pt' ? 'casa' : 'fret'}
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
        <Button
          component={Link}
          href={rootNote ? `/${locale}/chords?note=${encodeURIComponent(rootNote)}` : `/${locale}/chords`}
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 3, color: 'text.secondary' }}
        >
          {locale === 'pt' ? 'Voltar para acordes' : 'Back to chords'}
        </Button>

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
            {locale === 'pt' ? 'Visualização no Braço' : 'Fretboard Visualization'}
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

        <Grid container spacing={3}>
          {renderChords()}
        </Grid>

        {isLoaded && !error && chords.length > 0 && (
          <Box sx={{ mt: 4, p: 3, backgroundColor: '#fff', borderRadius: 2, boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)' }}>
            <Typography variant="body2" color="text.secondary">
              <strong>{locale === 'pt' ? 'Nota:' : 'Note:'}</strong> {locale === 'pt' 
                ? 'A visualização mostra possíveis posições para tocar estas notas no cavaquinho (afinação D-G-B-D). Diferentes inversões e posições podem ser exploradas.'
                : 'The visualization shows possible positions to play these notes on the cavaquinho (D-G-B-D tuning). Different inversions and positions can be explored.'}
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}
