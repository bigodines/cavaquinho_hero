'use client';

import React, { createContext, useContext, useRef, useCallback, useState } from 'react';
import { getNoteFrequency, getDegreeFrequency, getMinorThirdFrequency, WaveformType } from '../../lib/earTraining';

interface AudioContextValue {
  playNote: (note: string, octave: number, duration?: number, waveform?: WaveformType) => void;
  playDegree: (root: string, octave: number, degree: number, duration?: number, waveform?: WaveformType) => void;
  playChord: (notes: { note: string; octave: number }[], duration?: number, waveform?: WaveformType) => void;
  playMajorTriad: (root: string, octave: number, duration?: number) => void;
  playMinorTriad: (root: string, octave: number, duration?: number) => void;
  startDrone: (note: string, octave: number, waveform?: WaveformType) => void;
  stopDrone: () => void;
  setDroneVolume: (volume: number) => void;
  isDronePlaying: boolean;
  droneFrequency: number | null;
  stopAll: () => void;
}

const AudioContext = createContext<AudioContextValue | null>(null);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

interface AudioProviderProps {
  children: React.ReactNode;
}

export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
  const audioContextRef = useRef<globalThis.AudioContext | null>(null);
  const droneOscillatorRef = useRef<OscillatorNode | null>(null);
  const droneGainRef = useRef<GainNode | null>(null);
  const droneVolumeRef = useRef(0.2);
  const activeOscillatorsRef = useRef<OscillatorNode[]>([]);
  const [isDronePlaying, setIsDronePlaying] = useState(false);
  const [droneFrequency, setDroneFrequency] = useState<number | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new window.AudioContext();
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    return audioContextRef.current;
  }, []);

  const createOscillator = useCallback((
    frequency: number,
    waveform: WaveformType = 'sine',
    gainValue: number = 0.3
  ) => {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = waveform;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    gainNode.gain.setValueAtTime(gainValue, ctx.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    return { oscillator, gainNode };
  }, [getAudioContext]);

  const playNote = useCallback((
    note: string,
    octave: number,
    duration: number = 1,
    waveform: WaveformType = 'sine'
  ) => {
    const frequency = getNoteFrequency(note, octave);
    const ctx = getAudioContext();
    const { oscillator, gainNode } = createOscillator(frequency, waveform);

    oscillator.start();
    activeOscillatorsRef.current.push(oscillator);

    // Fade out
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    oscillator.stop(ctx.currentTime + duration);

    oscillator.onended = () => {
      const index = activeOscillatorsRef.current.indexOf(oscillator);
      if (index > -1) {
        activeOscillatorsRef.current.splice(index, 1);
      }
    };
  }, [getAudioContext, createOscillator]);

  const playDegree = useCallback((
    root: string,
    octave: number,
    degree: number,
    duration: number = 1,
    waveform: WaveformType = 'sine'
  ) => {
    const frequency = getDegreeFrequency(root, octave, degree);
    const ctx = getAudioContext();
    const { oscillator, gainNode } = createOscillator(frequency, waveform);

    oscillator.start();
    activeOscillatorsRef.current.push(oscillator);

    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    oscillator.stop(ctx.currentTime + duration);

    oscillator.onended = () => {
      const index = activeOscillatorsRef.current.indexOf(oscillator);
      if (index > -1) {
        activeOscillatorsRef.current.splice(index, 1);
      }
    };
  }, [getAudioContext, createOscillator]);

  const playChord = useCallback((
    notes: { note: string; octave: number }[],
    duration: number = 1.5,
    waveform: WaveformType = 'triangle'
  ) => {
    notes.forEach(({ note, octave }) => {
      playNote(note, octave, duration, waveform);
    });
  }, [playNote]);

  const playMajorTriad = useCallback((
    root: string,
    octave: number,
    duration: number = 1.5
  ) => {
    const ctx = getAudioContext();
    const rootFreq = getNoteFrequency(root, octave);
    const thirdFreq = rootFreq * Math.pow(2, 4 / 12); // Major 3rd
    const fifthFreq = rootFreq * Math.pow(2, 7 / 12); // Perfect 5th

    [rootFreq, thirdFreq, fifthFreq].forEach(freq => {
      const { oscillator, gainNode } = createOscillator(freq, 'triangle', 0.2);
      oscillator.start();
      activeOscillatorsRef.current.push(oscillator);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      oscillator.stop(ctx.currentTime + duration);
    });
  }, [getAudioContext, createOscillator]);

  const playMinorTriad = useCallback((
    root: string,
    octave: number,
    duration: number = 1.5
  ) => {
    const ctx = getAudioContext();
    const rootFreq = getNoteFrequency(root, octave);
    const thirdFreq = rootFreq * Math.pow(2, 3 / 12); // Minor 3rd
    const fifthFreq = rootFreq * Math.pow(2, 7 / 12); // Perfect 5th

    [rootFreq, thirdFreq, fifthFreq].forEach(freq => {
      const { oscillator, gainNode } = createOscillator(freq, 'triangle', 0.2);
      oscillator.start();
      activeOscillatorsRef.current.push(oscillator);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      oscillator.stop(ctx.currentTime + duration);
    });
  }, [getAudioContext, createOscillator]);

  const startDrone = useCallback((
    note: string,
    octave: number,
    waveform: WaveformType = 'triangle'
  ) => {
    // Stop existing drone first
    if (droneOscillatorRef.current) {
      droneOscillatorRef.current.stop();
      droneOscillatorRef.current = null;
    }

    const frequency = getNoteFrequency(note, octave);
    const ctx = getAudioContext();
    
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = waveform;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(droneVolumeRef.current, ctx.currentTime + 0.5); // Fade in

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start();
    droneOscillatorRef.current = oscillator;
    droneGainRef.current = gainNode;
    setDroneFrequency(frequency);
    setIsDronePlaying(true);
  }, [getAudioContext]);

  const setDroneVolume = useCallback((volume: number) => {
    const clamped = Math.max(0, Math.min(1, volume));
    droneVolumeRef.current = clamped;

    if (droneGainRef.current) {
      const ctx = getAudioContext();
      droneGainRef.current.gain.linearRampToValueAtTime(clamped, ctx.currentTime + 0.08);
    }
  }, [getAudioContext]);

  const stopDrone = useCallback(() => {
    if (droneOscillatorRef.current && droneGainRef.current) {
      const ctx = getAudioContext();
      droneGainRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
      setTimeout(() => {
        if (droneOscillatorRef.current) {
          droneOscillatorRef.current.stop();
          droneOscillatorRef.current = null;
          droneGainRef.current = null;
        }
      }, 500);
    }
    setDroneFrequency(null);
    setIsDronePlaying(false);
  }, [getAudioContext]);

  const stopAll = useCallback(() => {
    stopDrone();
    activeOscillatorsRef.current.forEach(osc => {
      try {
        osc.stop();
      } catch {
        // Oscillator already stopped
      }
    });
    activeOscillatorsRef.current = [];
  }, [stopDrone]);

  const value: AudioContextValue = {
    playNote,
    playDegree,
    playChord,
    playMajorTriad,
    playMinorTriad,
    startDrone,
    stopDrone,
    setDroneVolume,
    isDronePlaying,
    droneFrequency,
    stopAll,
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
};

export default AudioProvider;
