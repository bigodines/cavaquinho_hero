'use client';

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
import React, { useState, useEffect, ChangeEvent, useMemo } from 'react';
import * as chords from '../lib/chords';
import type { Triad, Tetrad, Sixth } from '../lib/chords';
import { isValidNote } from '../lib/scales';
import { useTranslations, useLocale } from 'next-intl';

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

const chordCategories = (t: ReturnType<typeof useTranslations>): Record<string, string[]> => ({
  [t('chordTable.categories.triads')]: ['', 'm', '+', '°'],
  [t('chordTable.categories.sevenths')]: ['7', '7M', 'm7', 'm7+', '7(#5)', '7+(#5)', 'Ø', 'o', '7(b5)'],
  [t('chordTable.categories.sixths')]: ['6', 'm6'],
});

export default function ChordTable() {
  const t = useTranslations();
  const locale = useLocale();
  const [note, setNote] = useState('');
  const [chordsData, setChordsData] = useState<ChordsCollection>({});
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from URL query parameter
  useEffect(() => {
    // Parse query string from pathname since we're using app router
    const searchParams = new URLSearchParams(window.location.search);
    const queryNote = searchParams.get('note');
    
    if (!isInitialized) {
      if (queryNote) {
        setNote(queryNote);
      }
      setIsInitialized(true);
    }
  }, [isInitialized]);

  const handleNoteChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trim();
    setNote(value);
    
    // Update URL without navigation using History API
    const url = new URL(window.location.href);
    if (value) {
      url.searchParams.set('note', value);
    } else {
      url.searchParams.delete('note');
    }
    window.history.replaceState({}, '', url.toString());
  };

  // Auto-generate chords when note changes
  useEffect(() => {
    if (note.length > 0) {
      const c = generateChords(note);
      if (Object.keys(c).length === 0) {
        setError(t('chordTable.error'));
        setChordsData({});
      } else {
        setError(null);
        setChordsData(c);
      }
    } else {
      setError(null);
      setChordsData({});
    }
  }, [note, t]);

  const hasChords = useMemo(() => Object.keys(chordsData).length > 0, [chordsData]);

  const renderChordRows = (keys: string[]) => {
    return keys.map((key) => {
      const chord = chordsData[key];
      if (!chord) return null;

      const notes = Object.values(chord).map(encodeURIComponent).join('-');
      const viz = `/${locale}/chord-viz?notes=${notes}`;
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
              {t('chordTable.table.viewOnFretboard')} →
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
          {t('chordTable.title')}
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3 }}>
          {t('chordTable.subtitle')}
        </Typography>
        <TextField
          placeholder={t('chordTable.placeholder')}
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
          {hasChords && Object.entries(chordCategories(t)).map(([category, keys]) => (
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
                      <TableCell sx={{ width: '25%' }}>{t('chordTable.table.chord')}</TableCell>
                      <TableCell sx={{ width: '50%' }}>{t('chordTable.table.notes')}</TableCell>
                      <TableCell align="right" sx={{ width: '25%' }}>{t('chordTable.table.visualize')}</TableCell>
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
            {t('chordTable.emptyState')}
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
