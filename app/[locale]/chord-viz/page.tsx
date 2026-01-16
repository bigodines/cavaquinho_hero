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
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Chord from '../../../components/Chordz/Chord';
import Link from 'next/link';
import { fretboard, TUNINGS, ChordVoicing, MAX_FRET_SPAN, INSTRUMENTS, InstrumentKey } from '../../../lib/fretboard';
import { useLocale, useTranslations } from 'next-intl';

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
  const t = useTranslations();

  const [instrumentKey, setInstrumentKey] = useState<InstrumentKey>('cavaquinho');
  const [tuning, setTuning] = useState<string[]>(INSTRUMENTS.cavaquinho.tuning);
  const [chords, setChords] = useState<ChordData[]>([]);
  const [fretsOnChord, setFretsOnChord] = useState(MAX_FRET_SPAN + 1);

  const instrument: Instrument = {
    strings: tuning.length,
    fretsOnChord,
    name: t(`chordTable.instrument.${instrumentKey}`),
    keys: [],
    tunings: {
      standard: tuning,
    },
  };
  
  const [notesArray, setNotesArray] = useState<string[]>([]);
  const [rootNote, setRootNote] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);

  // Function to calculate chord voicings for a given tuning
  const calculateChords = (notes: string[], currentTuning: string[]) => {
    const fb = fretboard(currentTuning);
    const voicings = fb.draw(notes);
    
    if (voicings.length === 0) {
      setError(locale === 'pt' 
        ? 'Não foi possível encontrar posições tocáveis para estas notas.'
        : 'Could not find playable positions for these notes.');
      setChords([]);
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
    setError('');
  };

  // Handle instrument change from dropdown
  const handleInstrumentChange = (event: SelectChangeEvent<InstrumentKey>) => {
    const newInstrumentKey = event.target.value as InstrumentKey;
    const newTuning = INSTRUMENTS[newInstrumentKey].tuning;
    
    setInstrumentKey(newInstrumentKey);
    setTuning(newTuning);
    
    // Update URL without navigation
    const url = new URL(window.location.href);
    url.searchParams.set('instrument', newInstrumentKey);
    window.history.replaceState({}, '', url.toString());
    
    // Recalculate chords with new tuning
    if (notesArray.length > 0) {
      calculateChords(notesArray, newTuning);
    }
  };

  useEffect(() => {
    // Get notes and instrument from URL query parameters
    const searchParams = new URLSearchParams(window.location.search);
    const notesParam = searchParams.get('notes');
    const instrumentParam = searchParams.get('instrument') as InstrumentKey | null;
    
    // Set instrument and tuning from URL parameter
    let currentTuning = INSTRUMENTS.cavaquinho.tuning;
    let currentInstrumentKey: InstrumentKey = 'cavaquinho';
    if (instrumentParam && instrumentParam in INSTRUMENTS) {
      currentInstrumentKey = instrumentParam;
      currentTuning = INSTRUMENTS[instrumentParam].tuning;
      setInstrumentKey(currentInstrumentKey);
      setTuning(currentTuning);
    }
    
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

    calculateChords(notesList, currentTuning);
    setIsLoaded(true);
  }, [locale]);

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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {locale === 'pt' ? 'Visualização no Braço' : 'Fretboard Visualization'}
            </Typography>
            <FormControl 
              size="small"
              sx={{
                minWidth: 200,
                backgroundColor: 'rgba(255,255,255,0.95)',
                borderRadius: 2,
              }}
            >
              <Select
                value={instrumentKey}
                onChange={handleInstrumentChange}
                sx={{
                  borderRadius: 2,
                  '& .MuiSelect-select': {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  },
                }}
                renderValue={(value) => (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>{t(`chordTable.instrument.${value}`)}</span>
                    <Typography 
                      component="span" 
                      sx={{ 
                        color: 'text.secondary', 
                        fontSize: '0.85em',
                        fontFamily: 'monospace',
                      }}
                    >
                      ({INSTRUMENTS[value].tuningDisplay})
                    </Typography>
                  </Box>
                )}
              >
                {(Object.keys(INSTRUMENTS) as InstrumentKey[]).map((key) => (
                  <MenuItem key={key} value={key}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span>{t(`chordTable.instrument.${key}`)}</span>
                      <Typography 
                        component="span" 
                        sx={{ 
                          color: 'text.secondary', 
                          fontSize: '0.85em',
                          fontFamily: 'monospace',
                        }}
                      >
                        ({INSTRUMENTS[key].tuningDisplay})
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
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
                ? `A visualização mostra possíveis posições para tocar estas notas no ${t(`chordTable.instrument.${instrumentKey}`)} (afinação ${INSTRUMENTS[instrumentKey].tuningDisplay}). Diferentes inversões e posições podem ser exploradas.`
                : `The visualization shows possible positions to play these notes on the ${t(`chordTable.instrument.${instrumentKey}`)} (${INSTRUMENTS[instrumentKey].tuningDisplay} tuning). Different inversions and positions can be explored.`}
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}
