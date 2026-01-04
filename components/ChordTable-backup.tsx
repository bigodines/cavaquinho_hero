import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Paper,
  TableContainer,
  TextField,
  Box,
  Typography,
  Chip,
  InputAdornment,
  Fade,
} from '@mui/material';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState, useEffect, ChangeEvent, useMemo } from 'react';
import * as chords from '../lib/chords';
import type { Triad, Tetrad, Sixth } from '../lib/chords';
import { isValidNote } from '../lib/scales';

type ChordResult = Triad | Tetrad | Sixth | null;

interface ChordsCollection {
  [key: string]: ChordResult;
}

/**
 * Normalizes user input to a valid note format
 * Handles case-insensitivity and common variations
 */
function normalizeNote(input: string): string | null {
  if (!input || input.length < 1 || input.length > 2) {
    return null;
  }
  
  // Capitalize first letter, lowercase the rest (for # or b)
  const normalized = input[0].toUpperCase() + input.substring(1).toLowerCase();
  
  // Validate the note
  if (!isValidNote(normalized)) {
    return null;
  }
  
  return normalized;
}

function generateChords(n: string): ChordsCollection {
  const note = normalizeNote(n);
  if (!note) {
    return {};
  }

  return {
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
}

const chordCategories: Record<string, string[]> = {
  'Tríades': ['', 'm', '+', '°'],
  'Tétrades (7ª)': ['7', '7M', 'm7', 'm7+', '7(#5)', '7+(#5)', 'Ø', 'o', '7(b5)'],
  'Acordes com 6ª': ['6', 'm6'],
};

export default function ChordTable() {
  const router = useRouter();
  const [note, setNote] = useState('');
  const [chordsData, setChordsData] = useState<ChordsCollection>({});
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from URL query parameter
  useEffect(() => {
    if (router.isReady && !isInitialized) {
      const queryNote = router.query.note;
      if (typeof queryNote === 'string' && queryNote.length > 0) {
        setNote(queryNote);
      }
      setIsInitialized(true);
    }
  }, [router.isReady, router.query.note, isInitialized]);

  const handleNoteChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trim();
    setNote(value);
    
    // Update URL without navigation (shallow update)
    if (value) {
      router.replace({ query: { note: value } }, undefined, { shallow: true });
    } else {
      router.replace({ query: {} }, undefined, { shallow: true });
    }
  };

  // Auto-generate chords when note changes
  useEffect(() => {
    if (note.length > 0) {
      const c = generateChords(note);
      if (Object.keys(c).length === 0) {
        setError('Nota inválida. Use: C, D, E, F, G, A, B (com # ou b)');
        setChordsData({});
      } else {
        setError(null);
        setChordsData(c);
      }
    } else {
      setError(null);
      setChordsData({});
    }
  }, [note]);

  const hasChords = useMemo(() => Object.keys(chordsData).length > 0, [chordsData]);

  const renderChordRows = (keys: string[]) => {
    return keys.map((key) => {
      const chord = chordsData[key];
      if (!chord) return null;

      const notes = Object.values(chord).map(encodeURIComponent).join('-');
      const viz = `/chord/${notes}`;
      const displayNote = note[0].toUpperCase() + note.substring(1);

      return (
        <TableRow key={key}>
          <TableCell>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip 
                label={displayNote + key} 
                size="small" 
                color="secondary"
                sx={{ fontWeight: 600, minWidth: 60 }}
              />
            </Box>
          </TableCell>
          <TableCell>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', letterSpacing: 1 }}>
              {Object.values(chord).join(' - ')}
            </Typography>
          </TableCell>
          <TableCell align="right">
            <Link href={viz} style={{ 
              color: '#e94560', 
              fontWeight: 500,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}>
              Ver no braço →
            </Link>
          </TableCell>
        </TableRow>
      );
    });
  };

  return (
    <Box>
      {/* Search Input */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          mb: 4, 
          textAlign: 'center',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%)',
          borderRadius: 3,
        }}
      >
        <Typography variant="h5" sx={{ color: 'white', mb: 1, fontWeight: 600 }}>
          Gerador de Acordes
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3 }}>
          Digite uma nota para ver todos os acordes possíveis
        </Typography>
        <TextField
          placeholder="Ex: C, Eb, F#..."
          variant="outlined"
          name="rootNote"
          value={note}
          onChange={handleNoteChange}
          autoComplete="off"
          error={!!error}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MusicNoteIcon sx={{ color: error ? 'error.main' : 'rgba(0,0,0,0.4)' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            backgroundColor: 'white',
            borderRadius: 2,
            width: { xs: '100%', sm: 300 },
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            },
          }}
        />
      </Paper>

      {/* Results */}
      <Fade in={hasChords} timeout={300}>
        <Box>
          {hasChords && Object.entries(chordCategories).map(([category, keys]) => (
            <Paper key={category} sx={{ mb: 3, overflow: 'hidden' }}>
              <Box sx={{ 
                px: 3, 
                py: 2, 
                backgroundColor: '#f8f9fa',
                borderBottom: '1px solid rgba(0,0,0,0.06)',
              }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {category}
                </Typography>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: '25%' }}>Acorde</TableCell>
                      <TableCell sx={{ width: '50%' }}>Notas</TableCell>
                      <TableCell align="right" sx={{ width: '25%' }}>Visualizar</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {renderChordRows(keys)}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          ))}
        </Box>
      </Fade>

      {/* Empty State */}
      {!hasChords && !error && (
        <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
          <MusicNoteIcon sx={{ fontSize: 64, opacity: 0.3, mb: 2 }} />
          <Typography variant="body1">
            Digite uma nota acima para começar
          </Typography>
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Box sx={{ textAlign: 'center', py: 8, color: 'error.main' }}>
          <MusicNoteIcon sx={{ fontSize: 64, opacity: 0.3, mb: 2 }} />
          <Typography variant="body1">
            {error}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
