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

const chordCategories: Record<string, string[]> = {
  'Tríades': ['', 'm', '+', '°'],
  'Tétrades (7ª)': ['7', '7M', 'm7', 'm7+', '7(#5)', '7+(#5)', 'Ø', 'o', '7(b5)'],
  'Acordes com 6ª': ['6', 'm6'],
};

export default function ChordTable() {
  const [note, setNote] = useState('');
  const [chordsData, setChordsData] = useState<ChordsCollection>({});

  const handleNoteChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trim();
    setNote(value);
  };

  // Auto-generate chords when note changes
  useEffect(() => {
    if (note.length > 0) {
      const c = generateChords(note);
      setChordsData(c);
    } else {
      setChordsData({});
    }
  }, [note]);

  const hasChords = useMemo(() => Object.keys(chordsData).length > 0, [chordsData]);

  const renderChordRows = (keys: string[]) => {
    return keys.map((key) => {
      const chord = chordsData[key];
      if (!chord) return null;

      const notes = Object.values(chord).join('-');
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
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MusicNoteIcon sx={{ color: 'rgba(0,0,0,0.4)' }} />
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
      {!hasChords && (
        <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
          <MusicNoteIcon sx={{ fontSize: 64, opacity: 0.3, mb: 2 }} />
          <Typography variant="body1">
            Digite uma nota acima para começar
          </Typography>
        </Box>
      )}
    </Box>
  );
}
