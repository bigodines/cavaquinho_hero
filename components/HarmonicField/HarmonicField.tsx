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
  harmonicMinorDiatonicScale,
  naturalMinorDiatonicScale,
  melodicMinorDiatonicScale,
} from '../../lib/tonality';

type ScaleMode = 'major' | 'minor';

interface MinorScales {
  natural: string[];
  harmonic: string[];
  melodic: string[];
}

export default function HarmonicField() {
  const [note, setNote] = useState('');
  const [mode, setMode] = useState<ScaleMode>('major');
  const [majorChords, setMajorChords] = useState<string[]>([]);
  const [minorScales, setMinorScales] = useState<MinorScales>({
    natural: [],
    harmonic: [],
    melodic: [],
  });

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
      setMajorChords([]);
      setMinorScales({ natural: [], harmonic: [], melodic: [] });
      return;
    }

    // Capitalize the note
    const capitalizedNote = note[0].toUpperCase() + note.substring(1);

    if (mode === 'minor') {
      const natural = naturalMinorDiatonicScale(capitalizedNote);
      const harmonic = harmonicMinorDiatonicScale(capitalizedNote);
      const melodic = melodicMinorDiatonicScale(capitalizedNote);
      
      setMinorScales({
        natural: natural?.length === 7 ? natural : [],
        harmonic: harmonic?.length === 7 ? harmonic : [],
        melodic: melodic?.length === 7 ? melodic : [],
      });
      setMajorChords([]);
    } else {
      const major = majorDiatonicScale(capitalizedNote);
      if (major?.length === 7) {
        setMajorChords(major);
      }
      setMinorScales({ natural: [], harmonic: [], melodic: [] });
    }
  }, [note, mode]);

  const degrees = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
  const hasMajorChords = majorChords.length === 7;
  const hasMinorChords = minorScales.natural.length === 7;
  const hasChords = hasMajorChords || hasMinorChords;
  const displayNote = note ? note[0].toUpperCase() + note.substring(1) : '';

  const renderHarmonicRow = (
    chords: string[],
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

  const getChordColor = (chord: string) => {
    if (chord.includes('dim')) return '#fff3e0'; // orange tint for diminished
    if (chord.includes('m7b5')) return '#ffebee'; // red tint for half-dim
    if (chord.includes('7M#5') || chord.includes('+')) return '#f3e5f5'; // purple tint for augmented
    if (chord.includes('m7M')) return '#e8eaf6'; // indigo tint for minor-major
    if (chord.includes('m')) return '#e3f2fd'; // blue tint for minor
    return '#e8f5e9'; // green tint for major/dominant
  };

  const renderScaleTable = (
    chords: string[], 
    title: string, 
    subtitle: string,
    showSecondaryDominants = true
  ) => (
    <Paper sx={{ overflow: 'hidden', mb: 3 }}>
      <Box sx={{ 
        px: 3, 
        py: 2, 
        backgroundColor: '#1a1a2e',
        color: 'white',
      }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.7 }}>
          {subtitle}
        </Typography>
      </Box>
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
            {renderHarmonicRow(chords, 'Acordes Diatônicos', (chord) => (
              <Chip 
                label={chord} 
                size="small" 
                sx={{ 
                  fontWeight: 600,
                  backgroundColor: getChordColor(chord),
                }} 
              />
            ), true)}
            
            {showSecondaryDominants && (
              <>
                {renderHarmonicRow(chords, 'Dominantes (V7)', (chord) => (
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {dominantChord(chord)}
                  </Typography>
                ))}
                
                {renderHarmonicRow(chords, 'II Cadencial', (chord) => (
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {iiChord(chord)}
                  </Typography>
                ))}
                
                {renderHarmonicRow(chords, 'SubV', (chord) => (
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {subV(chord)}
                  </Typography>
                ))}
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
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
          {/* Major Scale */}
          {hasMajorChords && (
            <>
              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {displayNote} Maior
                </Typography>
                <Chip 
                  label="Campo Maior"
                  size="small"
                  color="primary"
                />
              </Box>
              {renderScaleTable(
                majorChords,
                `${displayNote} Maior`,
                'I7M - IIm7 - IIIm7 - IV7M - V7 - VIm7 - VIIm7(b5)',
                true
              )}
            </>
          )}

          {/* Minor Scales */}
          {hasMinorChords && (
            <>
              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {displayNote} Menor
                </Typography>
                <Chip 
                  label="3 Escalas Menores"
                  size="small"
                  color="secondary"
                />
              </Box>

              {renderScaleTable(
                minorScales.natural,
                `${displayNote} Menor Natural (Eólio)`,
                'Im7 - IIm7(b5) - III7M - IVm7 - Vm7 - VI7M - VII7',
                true
              )}

              {renderScaleTable(
                minorScales.harmonic,
                `${displayNote} Menor Harmônica`,
                'Im7M - IIm7(b5) - III7M(#5) - IVm7 - V7 - VI7M - VIIdim7',
                true
              )}

              {renderScaleTable(
                minorScales.melodic,
                `${displayNote} Menor Melódica`,
                'Im7M - IIm7 - III7M(#5) - IV7 - V7 - VIm7(b5) - VIIm7(b5)',
                true
              )}
            </>
          )}

          <Box sx={{ mt: 3, p: 2, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Dica:</strong> Use os dominantes secundários para criar tensão harmônica 
              antes de resolver em qualquer acorde do campo. O SubV é o substituto tritonal 
              do dominante e pode ser usado para adicionar cor às suas progressões.
            </Typography>
          </Box>
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
