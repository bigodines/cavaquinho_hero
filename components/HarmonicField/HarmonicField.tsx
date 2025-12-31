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
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import React, { useEffect, useState, ChangeEvent } from 'react';

import {
  majorDiatonicScale,
  dominantChord,
  iiChord,
  subV,
  prepDim,
  harmonicMinorDiatonicScale,
} from '../../lib/tonality';

type ScaleMode = 'major' | 'minor';

export default function HarmonicField() {
  const [note, setNote] = useState('');
  const [mode, setMode] = useState<ScaleMode>('major');
  const [chords, setChords] = useState<string[]>([]);

  const handleNoteChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNote(event.target.value.trim());
  };

  const handleModeChange = (_: React.MouseEvent<HTMLElement>, newMode: ScaleMode | null) => {
    if (newMode) {
      setMode(newMode);
    }
  };

  useEffect(() => {
    if (!note) {
      setChords([]);
      return;
    }

    // Capitalize the note
    const capitalizedNote = note[0].toUpperCase() + note.substring(1);

    if (mode === 'minor') {
      const harmonicMinor = harmonicMinorDiatonicScale(capitalizedNote + 'm');
      if (harmonicMinor?.length === 7) {
        setChords(harmonicMinor);
      }
    } else {
      const major = majorDiatonicScale(capitalizedNote);
      if (major?.length === 7) {
        setChords(major);
      }
    }
  }, [note, mode]);

  const degrees = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
  const hasChords = chords.length === 7;
  const displayNote = note ? note[0].toUpperCase() + note.substring(1) : '';

  const renderHarmonicRow = (
    label: string, 
    renderCell: (chord: string, index: number) => React.ReactNode,
    showEmpty = false
  ) => (
    <TableRow>
      <TableCell 
        sx={{ 
          fontWeight: 600, 
          backgroundColor: '#f8f9fa',
          position: 'sticky',
          left: 0,
          zIndex: 1,
          minWidth: 140,
        }}
      >
        {label}
      </TableCell>
      {chords.map((chord, index) => (
        <TableCell 
          key={`${label}-${index}`} 
          align="center"
          sx={{ minWidth: 80 }}
        >
          {chord.includes('m7b5') && !showEmpty ? null : renderCell(chord, index)}
        </TableCell>
      ))}
    </TableRow>
  );

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
          Campo Harmônico
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3 }}>
          Explore as progressões harmônicas de qualquer tonalidade
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2, 
          justifyContent: 'center',
          alignItems: 'center',
        }}>
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
              width: { xs: '100%', sm: 200 },
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
          
          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={handleModeChange}
            sx={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: 2,
              '& .MuiToggleButton-root': {
                color: 'rgba(255,255,255,0.7)',
                border: 'none',
                px: 3,
                '&.Mui-selected': {
                  backgroundColor: 'white',
                  color: '#1a1a2e',
                  '&:hover': {
                    backgroundColor: 'white',
                  },
                },
              },
            }}
          >
            <ToggleButton value="major">Maior</ToggleButton>
            <ToggleButton value="minor">Menor</ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Paper>

      {/* Results */}
      <Fade in={hasChords} timeout={300}>
        <Box>
          {hasChords && (
            <>
              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {displayNote} {mode === 'major' ? 'Maior' : 'Menor Harmônica'}
                </Typography>
                <Chip 
                  label={mode === 'major' ? 'Campo Maior' : 'Campo Menor'}
                  size="small"
                  color={mode === 'major' ? 'primary' : 'secondary'}
                />
              </Box>

              <Paper sx={{ overflow: 'hidden' }}>
                <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto' }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell 
                          sx={{ 
                            fontWeight: 600,
                            position: 'sticky',
                            left: 0,
                            backgroundColor: '#f8f9fa',
                            zIndex: 2,
                          }}
                        >
                          Função
                        </TableCell>
                        {degrees.map((degree) => (
                          <TableCell 
                            key={degree} 
                            align="center"
                            sx={{ fontWeight: 600, minWidth: 80 }}
                          >
                            {degree}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {renderHarmonicRow('Acordes Diatônicos', (chord) => (
                        <Chip 
                          label={chord} 
                          size="small" 
                          sx={{ 
                            fontWeight: 600,
                            backgroundColor: chord.includes('m7b5') ? '#ffebee' : 
                                           chord.includes('m') ? '#e3f2fd' : '#e8f5e9',
                          }} 
                        />
                      ), true)}
                      
                      {renderHarmonicRow('Dominantes (V7)', (chord) => (
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {dominantChord(chord)}
                        </Typography>
                      ))}
                      
                      {renderHarmonicRow('II Cadencial', (chord) => (
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {iiChord(chord)}
                        </Typography>
                      ))}
                      
                      {renderHarmonicRow('Dim. Preparatório', (chord) => (
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {prepDim(chord)}
                        </Typography>
                      ))}
                      
                      {renderHarmonicRow('SubV', (chord) => (
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {subV(chord)}
                        </Typography>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>

              <Box sx={{ mt: 3, p: 2, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Dica:</strong> Use os dominantes secundários para criar tensão harmônica 
                  antes de resolver em qualquer acorde do campo. O SubV é o substituto tritonal 
                  do dominante e pode ser usado para adicionar cor às suas progressões.
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </Fade>

      {/* Empty State */}
      {!hasChords && (
        <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
          <MusicNoteIcon sx={{ fontSize: 64, opacity: 0.3, mb: 2 }} />
          <Typography variant="body1">
            Digite uma nota acima para explorar o campo harmônico
          </Typography>
        </Box>
      )}
    </Box>
  );
}
