'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Collapse,
  LinearProgress,
  Chip,
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { getNoteFrequency } from '../../lib/earTraining';
import { useAudio } from '../AudioProvider/AudioProvider';

interface PitchDetectorProps {
  targetNote?: string;
  targetOctave?: number;
  onPitchDetected?: (frequency: number, note: string, cents: number) => void;
  labels?: {
    title: string;
    start: string;
    stop: string;
    inTune: string;
    sharp: string;
    flat: string;
    permissionDenied: string;
    clickToStart: string;
    helpText: string;
    target: string;
  };
}

// Note names for pitch detection
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Convert frequency to note name and cents offset
function frequencyToNote(frequency: number): { note: string; octave: number; cents: number } {
  // A4 = 440Hz
  const A4 = 440;
  const C0 = A4 * Math.pow(2, -4.75); // C0 frequency
  
  if (frequency < 20 || frequency > 5000) {
    return { note: '-', octave: 0, cents: 0 };
  }
  
  const halfStepsFromC0 = 12 * Math.log2(frequency / C0);
  const roundedHalfSteps = Math.round(halfStepsFromC0);
  const cents = Math.round((halfStepsFromC0 - roundedHalfSteps) * 100);
  
  const octave = Math.floor(roundedHalfSteps / 12);
  const noteIndex = ((roundedHalfSteps % 12) + 12) % 12;
  
  return {
    note: NOTE_NAMES[noteIndex],
    octave,
    cents,
  };
}

// Autocorrelation pitch detection algorithm
function autoCorrelate(buffer: Float32Array, sampleRate: number): number {
  const SIZE = buffer.length;
  const MAX_SAMPLES = Math.floor(SIZE / 2);
  let bestOffset = -1;
  let bestCorrelation = 0;
  let rms = 0;
  let foundGoodCorrelation = false;
  const correlations = new Array(MAX_SAMPLES);

  // Calculate RMS
  for (let i = 0; i < SIZE; i++) {
    const val = buffer[i];
    rms += val * val;
  }
  rms = Math.sqrt(rms / SIZE);

  // Not enough signal
  if (rms < 0.01) {
    return -1;
  }

  let lastCorrelation = 1;
  for (let offset = 0; offset < MAX_SAMPLES; offset++) {
    let correlation = 0;

    for (let i = 0; i < MAX_SAMPLES; i++) {
      correlation += Math.abs(buffer[i] - buffer[i + offset]);
    }
    
    correlation = 1 - correlation / MAX_SAMPLES;
    correlations[offset] = correlation;

    if (correlation > 0.82 && correlation > lastCorrelation) {
      foundGoodCorrelation = true;
      if (correlation > bestCorrelation) {
        bestCorrelation = correlation;
        bestOffset = offset;
      }
    } else if (foundGoodCorrelation) {
      const shift = (correlations[bestOffset + 1] - correlations[bestOffset - 1]) / correlations[bestOffset];
      return sampleRate / (bestOffset + 8 * shift);
    }
    lastCorrelation = correlation;
  }

  if (bestCorrelation > 0.01) {
    return sampleRate / bestOffset;
  }

  return -1;
}

interface PitchHistoryEntry {
  frequency: number;
  note: string;
  octave: number;
  cents: number;
  timestamp: number;
}

export default function PitchDetector({ targetNote, targetOctave, onPitchDetected, labels }: PitchDetectorProps) {
  // Default labels (English)
  const t = labels || {
    title: 'Pitch Detector',
    start: 'Start',
    stop: 'Stop',
    inTune: 'In tune',
    sharp: 'sharp',
    flat: 'flat',
    permissionDenied: 'Microphone access denied. Please allow microphone access to use the pitch detector.',
    clickToStart: 'Click "Start" to begin pitch detection',
    helpText: 'Sing or play a note and watch your pitch in real-time. Green line shows the target pitch.',
    target: 'Target',
  };
  
  const [isListening, setIsListening] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [currentFrequency, setCurrentFrequency] = useState<number | null>(null);
  const [currentNote, setCurrentNote] = useState<string>('-');
  const [currentOctave, setCurrentOctave] = useState<number>(0);
  const [currentCents, setCurrentCents] = useState<number>(0);
  const [pitchHistory, setPitchHistory] = useState<PitchHistoryEntry[]>([]);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const centerFrequencyRef = useRef<number>(getNoteFrequency(targetNote || 'C', targetOctave || 3));

  const { isDronePlaying, droneFrequency, setDroneVolume } = useAudio();

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frequencyWindowRef = useRef<number[]>([]);
  const smoothedFrequencyRef = useRef<number | null>(null);
  const pendingJumpFrequencyRef = useRef<number | null>(null);
  const pendingJumpFramesRef = useRef(0);

  const targetFrequency = targetNote && targetOctave 
    ? getNoteFrequency(targetNote, targetOctave) 
    : null;

  const startListening = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: false,
          autoGainControl: false,
          channelCount: 1,
        },
      });
      mediaStreamRef.current = stream;

      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 4096;
      analyserRef.current.smoothingTimeConstant = 0.15;

      const source = audioContextRef.current.createMediaStreamSource(stream);
      const highPass = audioContextRef.current.createBiquadFilter();
      highPass.type = 'highpass';
      highPass.frequency.setValueAtTime(60, audioContextRef.current.currentTime);

      const lowPass = audioContextRef.current.createBiquadFilter();
      lowPass.type = 'lowpass';
      lowPass.frequency.setValueAtTime(1000, audioContextRef.current.currentTime);

      // Build input chain and notch-out active drone partials when drone is playing
      source.connect(highPass);
      highPass.connect(lowPass);

      let inputNode: AudioNode = lowPass;
      if (isDronePlaying && droneFrequency) {
        [droneFrequency, droneFrequency * 2].forEach((freq) => {
          if (freq > 45 && freq < 1600) {
            const notch = audioContextRef.current!.createBiquadFilter();
            notch.type = 'notch';
            notch.frequency.setValueAtTime(freq, audioContextRef.current!.currentTime);
            notch.Q.setValueAtTime(18, audioContextRef.current!.currentTime);
            inputNode.connect(notch);
            inputNode = notch;
          }
        });
      }

      inputNode.connect(analyserRef.current);

      setIsListening(true);
      setPermissionDenied(false);
      detectPitch();
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setPermissionDenied(true);
    }
  }, [droneFrequency, isDronePlaying]);

  const stopListening = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setIsListening(false);
    setCurrentFrequency(null);
    setCurrentNote('-');
    setCurrentCents(0);
    frequencyWindowRef.current = [];
    smoothedFrequencyRef.current = null;
    pendingJumpFrequencyRef.current = null;
    pendingJumpFramesRef.current = 0;
  }, []);

  useEffect(() => {
    if (isListening && isDronePlaying) {
      setDroneVolume(0.04);
      return;
    }
    setDroneVolume(0.2);
  }, [isListening, isDronePlaying, setDroneVolume]);

  const detectPitch = useCallback(() => {
    if (!analyserRef.current || !audioContextRef.current) return;

    const buffer = new Float32Array(analyserRef.current.fftSize);
    analyserRef.current.getFloatTimeDomainData(buffer);

    const frequency = autoCorrelate(buffer, audioContextRef.current.sampleRate);

    if (frequency > 0) {
      // Keep only a practical singing/instrument range to avoid unstable subharmonics/noise
      if (frequency < 60 || frequency > 1000) {
        animationFrameRef.current = requestAnimationFrame(detectPitch);
        return;
      }

      // Median filter (short window) to remove spikes
      frequencyWindowRef.current.push(frequency);
      if (frequencyWindowRef.current.length > 5) {
        frequencyWindowRef.current.shift();
      }

      const sorted = [...frequencyWindowRef.current].sort((a, b) => a - b);
      const medianFrequency = sorted[Math.floor(sorted.length / 2)];

      const previousSmoothed = smoothedFrequencyRef.current ?? medianFrequency;
      let candidateFrequency = medianFrequency;

      // Reject sudden octave-like jumps unless they persist for a few frames
      const jumpInSemitones = Math.abs(12 * Math.log2(medianFrequency / previousSmoothed));
      if (jumpInSemitones > 3.0) {
        const pending = pendingJumpFrequencyRef.current;
        if (!pending) {
          pendingJumpFrequencyRef.current = medianFrequency;
          pendingJumpFramesRef.current = 1;
          candidateFrequency = previousSmoothed;
        } else {
          const pendingJumpDiff = Math.abs(12 * Math.log2(medianFrequency / pending));
          if (pendingJumpDiff < 0.75) {
            pendingJumpFramesRef.current += 1;
            if (pendingJumpFramesRef.current >= 2) {
              candidateFrequency = medianFrequency;
              pendingJumpFrequencyRef.current = null;
              pendingJumpFramesRef.current = 0;
            } else {
              candidateFrequency = previousSmoothed;
            }
          } else {
            pendingJumpFrequencyRef.current = medianFrequency;
            pendingJumpFramesRef.current = 1;
            candidateFrequency = previousSmoothed;
          }
        }
      } else {
        pendingJumpFrequencyRef.current = null;
        pendingJumpFramesRef.current = 0;
      }

      // Exponential smoothing to make the indicator stable
      const smoothingFactor = 0.2;
      const smoothedFrequency = previousSmoothed + smoothingFactor * (candidateFrequency - previousSmoothed);
      smoothedFrequencyRef.current = smoothedFrequency;

      const { note, octave, cents } = frequencyToNote(smoothedFrequency);
      setCurrentFrequency(smoothedFrequency);
      setCurrentNote(note);
      setCurrentOctave(octave);
      setCurrentCents(cents);

      // Adapt graph center to voice pitch to avoid fixed-C view
      centerFrequencyRef.current = (centerFrequencyRef.current * 0.96) + (smoothedFrequency * 0.04);

      // Add to history
      const entry: PitchHistoryEntry = {
        frequency: smoothedFrequency,
        note,
        octave,
        cents,
        timestamp: Date.now(),
      };

      setPitchHistory(prev => {
        const now = Date.now();
        const timeWindow = 5000;
        // Filter out old entries and add new one
        const recentHistory = prev.filter(e => (now - e.timestamp) <= timeWindow);
        return [...recentHistory, entry];
      });

      if (onPitchDetected) {
        onPitchDetected(smoothedFrequency, note, cents);
      }
    }

    animationFrameRef.current = requestAnimationFrame(detectPitch);
  }, [onPitchDetected]);

  // Draw the pitch timeline
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;
      const leftMargin = 35; // Space for note labels

      // Clear canvas
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, width, height);

      // Dynamic Y-axis centered around current voice pitch (or target as fallback)
      const centerFreq = Math.max(
        80,
        Math.min(
          900,
          targetFrequency || centerFrequencyRef.current || getNoteFrequency('C', 3)
        )
      );
      const halfRangeSemitones = 7;
      const minFreq = centerFreq * Math.pow(2, -halfRangeSemitones / 12);
      const maxFreq = centerFreq * Math.pow(2, halfRangeSemitones / 12);
      const topMargin = 20; // Top margin for spacing
      const bottomMargin = 20; // Bottom margin for spacing
      const drawableHeight = height - topMargin - bottomMargin;
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '13px monospace';
      ctx.textAlign = 'right';
      
      // Build semitone grid dynamically in visible range
      const minMidi = Math.floor(69 + 12 * Math.log2(minFreq / 440)) - 1;
      const maxMidi = Math.ceil(69 + 12 * Math.log2(maxFreq / 440)) + 1;

      for (let midi = minMidi; midi <= maxMidi; midi++) {
        const noteIdx = ((midi % 12) + 12) % 12;
        const noteName = NOTE_NAMES[noteIdx];
        const noteOctave = Math.floor(midi / 12) - 1;
        const noteFreq = 440 * Math.pow(2, (midi - 69) / 12);

        if (noteFreq < minFreq || noteFreq > maxFreq) continue;

        const y = topMargin + (drawableHeight - ((Math.log2(noteFreq / minFreq) / Math.log2(maxFreq / minFreq)) * drawableHeight));
        const isNatural = !noteName.includes('#');
        const isC = noteName === 'C';

        ctx.fillStyle = isNatural ? 'rgba(255, 255, 255, 0.72)' : 'rgba(255, 255, 255, 0.55)';
        ctx.fillText(`${noteName}${noteOctave}`, leftMargin - 5, y + 4);

        ctx.strokeStyle = isC ? 'rgba(255, 255, 255, 0.22)' : isNatural ? 'rgba(255, 255, 255, 0.13)' : 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = isC ? 1.4 : 1;
        ctx.beginPath();
        ctx.moveTo(leftMargin, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw target line if we have a target
      if (targetFrequency) {
        const targetY = topMargin + (drawableHeight - ((Math.log2(targetFrequency / minFreq) / Math.log2(maxFreq / minFreq)) * drawableHeight));
        ctx.strokeStyle = 'rgba(76, 175, 80, 0.8)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(leftMargin, targetY);
        ctx.lineTo(width, targetY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw target note label
        ctx.fillStyle = '#4caf50';
        ctx.font = '12px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`Target: ${targetNote}${targetOctave}`, leftMargin + 5, targetY - 5);
      }

      // Draw pitch history
      if (pitchHistory.length > 1) {
        const now = Date.now();
        const timeWindow = 5000; // 5 seconds
        
        // Filter valid entries within time window
        const validEntries = pitchHistory.filter(entry => (now - entry.timestamp) <= timeWindow);
        
        if (validEntries.length > 1) {
          ctx.strokeStyle = '#e94560';
          ctx.lineWidth = 3;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          
          // Draw line segments, breaking on gaps
          let currentPath: typeof validEntries = [];
          
          validEntries.forEach((entry, i) => {
            // Check for gap (more than 200ms between detections)
            if (i > 0 && (entry.timestamp - validEntries[i - 1].timestamp) > 200) {
              // Draw the accumulated path
              if (currentPath.length > 1) {
                ctx.beginPath();
                currentPath.forEach((pathEntry, pathIdx) => {
                  const age = now - pathEntry.timestamp;
                  const x = (width - 24) - (age / timeWindow) * (width - leftMargin - 34);
                  const y = topMargin + (drawableHeight - ((Math.log2(pathEntry.frequency / minFreq) / Math.log2(maxFreq / minFreq)) * drawableHeight));
                  
                  if (pathIdx === 0) {
                    ctx.moveTo(x, y);
                  } else {
                    ctx.lineTo(x, y);
                  }
                });
                ctx.stroke();
              }
              // Start new path
              currentPath = [entry];
            } else {
              currentPath.push(entry);
            }
          });
          
          // Draw the final path
          if (currentPath.length > 1) {
            ctx.beginPath();
            currentPath.forEach((pathEntry, pathIdx) => {
              const age = now - pathEntry.timestamp;
              const x = (width - 24) - (age / timeWindow) * (width - leftMargin - 34);
              const y = topMargin + (drawableHeight - ((Math.log2(pathEntry.frequency / minFreq) / Math.log2(maxFreq / minFreq)) * drawableHeight));
              
              if (pathIdx === 0) {
                ctx.moveTo(x, y);
              } else {
                ctx.lineTo(x, y);
              }
            });
            ctx.stroke();
          }

          // Draw dots for each detection
          validEntries.forEach((entry) => {
            const age = now - entry.timestamp;
            const x = (width - 24) - (age / timeWindow) * (width - leftMargin - 34);
            const y = topMargin + (drawableHeight - ((Math.log2(entry.frequency / minFreq) / Math.log2(maxFreq / minFreq)) * drawableHeight));
            const alpha = Math.max(0.3, 1 - (age / timeWindow) * 0.7);

            ctx.fillStyle = `rgba(233, 69, 96, ${alpha})`;
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();
          });
        }
      }

      // Draw current pitch indicator
      if (currentFrequency && currentFrequency >= minFreq && currentFrequency <= maxFreq) {
        const y = topMargin + (drawableHeight - ((Math.log2(currentFrequency / minFreq) / Math.log2(maxFreq / minFreq)) * drawableHeight));
        
        // Draw at the right edge where newest data appears
        const x = width - 24;
        
        ctx.fillStyle = '#e94560';
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'white';
        ctx.font = 'bold 14px monospace';
        ctx.textAlign = 'right';
        ctx.fillText(`${currentNote}${currentOctave}`, x - 15, y + 5);
      }
    };

    // Use requestAnimationFrame for smoother updates
    let animationId: number;
    const animate = () => {
      draw();
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => cancelAnimationFrame(animationId);
  }, [pitchHistory, currentFrequency, currentNote, currentOctave, targetFrequency, targetNote, targetOctave]);

  // Clean up old history periodically
  useEffect(() => {
    if (!isListening) return;
    
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      const timeWindow = 5000;
      setPitchHistory(prev => prev.filter(entry => (now - entry.timestamp) <= timeWindow));
    }, 500); // Clean up every 500ms

    return () => clearInterval(cleanupInterval);
  }, [isListening]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopListening();
      setDroneVolume(0.2);
    };
  }, [stopListening, setDroneVolume]);

  // Calculate how close to target
  const getAccuracyColor = () => {
    if (!targetFrequency || !currentFrequency) return 'default';
    const centsDiff = Math.abs(1200 * Math.log2(currentFrequency / targetFrequency));
    if (centsDiff < 10) return 'success';
    if (centsDiff < 25) return 'warning';
    return 'error';
  };

  const getCentsDisplay = () => {
    if (currentCents === 0) return t.inTune;
    if (currentCents > 0) return `+${currentCents}¢ ${t.sharp}`;
    return `${currentCents}¢ ${t.flat}`;
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: isExpanded ? 2 : 0 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MicIcon /> {t.title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant={isListening ? 'contained' : 'outlined'}
              color={isListening ? 'error' : 'primary'}
              startIcon={isListening ? <MicOffIcon /> : <MicIcon />}
              onClick={isListening ? stopListening : startListening}
              size="small"
            >
              {isListening ? t.stop : t.start}
            </Button>
            <IconButton onClick={() => setIsExpanded(!isExpanded)} size="small">
              {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
        </Box>

        <Collapse in={isExpanded}>
          {permissionDenied && (
            <Box sx={{ mb: 2, p: 2, bgcolor: 'error.dark', borderRadius: 1 }}>
              <Typography variant="body2" color="white">
                {t.permissionDenied}
              </Typography>
            </Box>
          )}

          {/* Current pitch display */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: 3, 
            mb: 2,
            p: 2,
            bgcolor: 'rgba(0,0,0,0.2)',
            borderRadius: 2,
          }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h2" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                {currentNote}
                <Typography component="span" variant="h4" sx={{ opacity: 0.7 }}>
                  {currentNote !== '-' ? currentOctave : ''}
                </Typography>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {currentFrequency ? `${currentFrequency.toFixed(1)} Hz` : '-- Hz'}
              </Typography>
            </Box>

            <Box sx={{ textAlign: 'center', minWidth: 120 }}>
              <Chip 
                label={getCentsDisplay()}
                color={Math.abs(currentCents) < 10 ? 'success' : Math.abs(currentCents) < 25 ? 'warning' : 'default'}
                sx={{ mb: 1 }}
              />
              <LinearProgress
                variant="determinate"
                value={50 + (currentCents / 2)} // -50 to +50 cents mapped to 0-100
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  bgcolor: 'rgba(255,255,255,0.1)',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: Math.abs(currentCents) < 10 ? 'success.main' : 
                             Math.abs(currentCents) < 25 ? 'warning.main' : 'error.main',
                  }
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                <Typography variant="caption" color="text.secondary">♭</Typography>
                <Typography variant="caption" color="text.secondary">♯</Typography>
              </Box>
            </Box>
          </Box>

          {/* Pitch timeline canvas */}
          <Box sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden' }}>
            <canvas
              ref={canvasRef}
              width={600}
              height={350}
              style={{ 
                width: '100%', 
                height: 'auto',
                borderRadius: '8px',
              }}
            />
            {!isListening && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'rgba(0,0,0,0.5)',
                  borderRadius: 2,
                }}
              >
                <Typography variant="body1" color="white">
                  {t.clickToStart}
                </Typography>
              </Box>
            )}
          </Box>

          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, textAlign: 'center' }}>
            {t.helpText}
          </Typography>
        </Collapse>
      </CardContent>
    </Card>
  );
}
