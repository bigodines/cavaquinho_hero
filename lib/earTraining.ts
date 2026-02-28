/**
 * Ear Training module
 * Provides utilities for generating ear training exercises and tracking progress
 */

// Note frequencies (A4 = 440Hz standard tuning)
const NOTE_FREQUENCIES: Record<string, number> = {
  'C2': 65.41, 'C#2': 69.30, 'D2': 73.42, 'D#2': 77.78, 'E2': 82.41, 'F2': 87.31,
  'F#2': 92.50, 'G2': 98.00, 'G#2': 103.83, 'A2': 110.00, 'A#2': 116.54, 'B2': 123.47,
  'C3': 130.81, 'C#3': 138.59, 'D3': 146.83, 'D#3': 155.56, 'E3': 164.81, 'F3': 174.61,
  'F#3': 185.00, 'G3': 196.00, 'G#3': 207.65, 'A3': 220.00, 'A#3': 233.08, 'B3': 246.94,
  'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63, 'F4': 349.23,
  'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88,
  'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'E5': 659.25, 'F5': 698.46,
  'F#5': 739.99, 'G5': 783.99, 'G#5': 830.61, 'A5': 880.00, 'A#5': 932.33, 'B5': 987.77,
};

// Flat note equivalents
const FLAT_EQUIVALENTS: Record<string, string> = {
  'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#',
};

export type WaveformType = 'sine' | 'triangle' | 'square' | 'sawtooth';

export interface ExerciseConfig {
  type: 'pitch-matching' | 'single-note' | 'tonic-anchoring' | 'ear-training';
  key: string;
  octave: number;
  degrees: number[];
  waveform: WaveformType;
  droneEnabled: boolean;
}

export interface WeeklyPlan {
  week: number;
  focus: string;
  blocks: BlockPlan[];
  tips: string[];
}

export interface BlockPlan {
  name: string;
  duration: number; // in minutes
  description: string;
  exercises: string[];
}

export interface DailyProgress {
  date: string;
  completed: boolean;
  blocksCompleted: number[];
  notes: string;
  duration: number; // actual minutes practiced
}

export interface UserProgress {
  currentWeek: number;
  startDate: string;
  dailyLogs: DailyProgress[];
  settings: {
    preferredKey: string;
    vocalRange: { low: string; high: string };
  };
}

/**
 * Get frequency for a note
 */
export const getNoteFrequency = (note: string, octave: number): number => {
  // Handle flats
  const normalizedNote = note.length > 1 && note[1] === 'b' 
    ? FLAT_EQUIVALENTS[note] || note 
    : note;
  
  const key = `${normalizedNote}${octave}`;
  return NOTE_FREQUENCIES[key] || 261.63; // Default to C4
};

/**
 * Get scale degree frequency relative to a root
 */
export const getDegreeFrequency = (root: string, octave: number, degree: number): number => {
  const semitones: Record<number, number> = {
    1: 0,   // Unison
    2: 2,   // Major 2nd
    3: 4,   // Major 3rd
    4: 5,   // Perfect 4th
    5: 7,   // Perfect 5th
    6: 9,   // Major 6th
    7: 11,  // Major 7th
    8: 12,  // Octave
  };

  const rootFreq = getNoteFrequency(root, octave);
  const semitonesUp = semitones[degree] || 0;
  
  // Frequency formula: f * 2^(n/12)
  return rootFreq * Math.pow(2, semitonesUp / 12);
};

/**
 * Get minor 3rd frequency (for major/minor comparison)
 */
export const getMinorThirdFrequency = (root: string, octave: number): number => {
  const rootFreq = getNoteFrequency(root, octave);
  return rootFreq * Math.pow(2, 3 / 12); // 3 semitones up
};

/**
 * Generate Strudel pattern for a note
 */
export const toStrudelNote = (note: string, octave: number): string => {
  return `${note.toLowerCase()}${octave}`;
};

/**
 * Generate Strudel pattern for drone
 */
export const generateDronePattern = (note: string, octave: number): string => {
  return `note("${toStrudelNote(note, octave)}").sound("triangle").sustain(4).gain(0.3)`;
};

/**
 * Generate Strudel pattern for scale degrees exercise
 */
export const generateDegreesPattern = (root: string, octave: number, degrees: number[]): string => {
  const notes = degrees.map(d => {
    const semitones: Record<number, number> = { 1: 0, 2: 2, 3: 4, 4: 5, 5: 7, 6: 9, 7: 11 };
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const rootIndex = noteNames.indexOf(root);
    const targetIndex = (rootIndex + (semitones[d] || 0)) % 12;
    return toStrudelNote(noteNames[targetIndex], octave);
  });
  
  return `note("${notes.join(' ')}").sound("piano").slow(2)`;
};

/**
 * 12-Week Ear Training Program
 */
export const TWELVE_WEEK_PROGRAM: WeeklyPlan[] = [
  // Weeks 1-2: Pitch Control
  {
    week: 1,
    focus: 'Pitch Control Foundation',
    blocks: [
      {
        name: 'Vocal Calibration',
        duration: 5,
        description: 'Teach your voice where pitch is through sliding exercises',
        exercises: [
          'Play C3 drone (sine or triangle)',
          'Hum softly with mouth closed',
          'Start below the pitch and slide up slowly until it locks',
          'Hold for 3 seconds, then reset',
          'Complete 10 reps'
        ]
      },
      {
        name: 'Single-Note Accuracy',
        duration: 5,
        description: 'Sing a pitch correctly without sliding',
        exercises: [
          'Play degree 1 (do), stop sound, sing it, check',
          'Play degree 3 (mi), stop sound, sing it, check',
          'Play degree 5 (sol), stop sound, sing it, check',
          'Goal: 7/10 attempts correct'
        ]
      },
      {
        name: 'Tonic Anchoring',
        duration: 5,
        description: 'Internalize "home" (the tonic)',
        exercises: [
          'Keep drone on',
          'Sing: do → re → do',
          'Sing: do → mi → do',
          'Sing: do → sol → do',
          'Focus on accurate return to do'
        ]
      },
      {
        name: 'Ear Training',
        duration: 10,
        description: 'Identify same vs different notes',
        exercises: [
          'Listen to two notes',
          'Identify if they are the same or different',
          'Not intervals yet - just same/different',
          'Practice with various note pairs'
        ]
      }
    ],
    tips: [
      'No guessing - sliding is mandatory to prevent random jumping',
      'Stay in C major only this week',
      'If pitch drifts, stop and re-calibrate'
    ]
  },
  {
    week: 2,
    focus: 'Pitch Control Refinement',
    blocks: [
      {
        name: 'Vocal Calibration',
        duration: 5,
        description: 'Continue pitch matching with glide',
        exercises: [
          'Play C3 drone',
          'Hum and slide to match',
          'Try starting from above and sliding down',
          'Complete 10 reps each direction'
        ]
      },
      {
        name: 'Single-Note Accuracy',
        duration: 5,
        description: 'Improve accuracy without reference',
        exercises: [
          'Play degree 1, wait 2 seconds, sing',
          'Play degree 3, wait 2 seconds, sing',
          'Play degree 5, wait 2 seconds, sing',
          'Increase wait time as accuracy improves'
        ]
      },
      {
        name: 'Tonic Anchoring',
        duration: 5,
        description: 'Strengthen tonic awareness',
        exercises: [
          'Sing away and back patterns faster',
          'Try: do → fa → do',
          'Try: do → la → do',
          'Always return accurately to do'
        ]
      },
      {
        name: 'Ear Training',
        duration: 10,
        description: 'Continue same/different recognition',
        exercises: [
          'Increase speed of note pairs',
          'Use wider intervals',
          'Track your accuracy percentage'
        ]
      }
    ],
    tips: [
      'If pitch doesn\'t improve by now, spend extra time on Block 1',
      'Record yourself to check accuracy',
      'Practice when not tired'
    ]
  },
  // Weeks 3-4: Stable Scale Degrees
  {
    week: 3,
    focus: 'Stable Scale Degrees',
    blocks: [
      {
        name: 'Vocal Calibration',
        duration: 5,
        description: 'Quick warm-up with drone',
        exercises: [
          'Play drone, match quickly',
          '5 reps only - should be faster now',
          'Focus on immediate lock-in'
        ]
      },
      {
        name: 'Single-Note Accuracy',
        duration: 5,
        description: 'Add scale degree 4 (fa)',
        exercises: [
          'Review: do, mi, sol',
          'Add: fa (degree 4)',
          'Practice random order',
          'Goal: consistent accuracy'
        ]
      },
      {
        name: 'Tonic Anchoring',
        duration: 5,
        description: 'Longer patterns',
        exercises: [
          'Sing: do → re → mi → do',
          'Sing: do → mi → sol → do',
          'Never lose home'
        ]
      },
      {
        name: 'Ear Training',
        duration: 10,
        description: 'Introduce major chord recognition',
        exercises: [
          'Listen to major triad with drone',
          'Identify the bright, happy quality',
          'Compare to single root note'
        ]
      }
    ],
    tips: [
      'You should stop feeling "lost" vocally by now',
      'Still one key (C major)',
      'Simple up/down fragments only'
    ]
  },
  {
    week: 4,
    focus: 'Scale Degree Consolidation',
    blocks: [
      {
        name: 'Vocal Calibration',
        duration: 5,
        description: 'Maintenance warm-up',
        exercises: [
          'Quick drone matching',
          'Should be automatic now'
        ]
      },
      {
        name: 'Single-Note Accuracy',
        duration: 5,
        description: 'All basic degrees',
        exercises: [
          'Practice: 1, 2, 3, 4, 5',
          'Random order',
          'Immediate response'
        ]
      },
      {
        name: 'Tonic Anchoring',
        duration: 5,
        description: 'More complex patterns',
        exercises: [
          'Sing: do → mi → re → do',
          'Sing: do → sol → mi → do',
          'Experiment with your own patterns'
        ]
      },
      {
        name: 'Ear Training',
        duration: 10,
        description: 'Major vs minor introduction',
        exercises: [
          'Listen to major triad over drone',
          'Listen to minor triad over drone',
          'Note the difference in 3rd'
        ]
      }
    ],
    tips: [
      'Prepare for major/minor perception next',
      'Your foundation should be solid'
    ]
  },
  // Weeks 5-6: Major/Minor Perception
  {
    week: 5,
    focus: 'Major/Minor Perception',
    blocks: [
      {
        name: 'Vocal Calibration',
        duration: 5,
        description: 'Include major and minor 3rd',
        exercises: [
          'Match drone',
          'Sing major 3rd (mi)',
          'Sing minor 3rd (me/mi♭)',
          'Feel the difference physically'
        ]
      },
      {
        name: 'Single-Note Accuracy',
        duration: 5,
        description: 'Major vs minor 3rd',
        exercises: [
          'Sing major 3rd, then minor 3rd',
          'Play each to check',
          'Internalize the half-step difference'
        ]
      },
      {
        name: 'Tonic Anchoring',
        duration: 5,
        description: 'Major and minor patterns',
        exercises: [
          'Sing: do → mi → do (major)',
          'Sing: do → me → do (minor)',
          'Alternate between them'
        ]
      },
      {
        name: 'Ear Training',
        duration: 10,
        description: 'Major vs minor chord identification',
        exercises: [
          'Tonic drone only',
          'One chord per attempt',
          'Say answer out loud',
          'Check immediately'
        ]
      }
    ],
    tips: [
      'This is the breakthrough week!',
      'If this clicks, your ear is officially "online"',
      'Focus on the feeling of major vs minor'
    ]
  },
  {
    week: 6,
    focus: 'Major/Minor Mastery',
    blocks: [
      {
        name: 'Vocal Calibration',
        duration: 5,
        description: 'Quick review',
        exercises: [
          'Major and minor 3rd singing',
          'Should be confident now'
        ]
      },
      {
        name: 'Single-Note Accuracy',
        duration: 5,
        description: 'Degrees 1-5 plus minor 3rd',
        exercises: [
          'Random degree recognition',
          'Include both major and minor 3rd'
        ]
      },
      {
        name: 'Tonic Anchoring',
        duration: 5,
        description: 'Complex major/minor patterns',
        exercises: [
          'Create your own patterns',
          'Mix major and minor 3rds',
          'Always return to tonic'
        ]
      },
      {
        name: 'Ear Training',
        duration: 10,
        description: 'Rapid major/minor identification',
        exercises: [
          'Faster chord presentations',
          'Track accuracy rate',
          'Goal: 80%+ accuracy'
        ]
      }
    ],
    tips: [
      'Consolidate your major/minor skills',
      'Prepare for simple melodies'
    ]
  },
  // Weeks 7-8: Simple Melodies
  {
    week: 7,
    focus: 'Simple Melodies',
    blocks: [
      {
        name: 'Vocal Calibration',
        duration: 5,
        description: 'Melodic warm-up',
        exercises: [
          'Sing scale ascending: do-re-mi-fa-sol',
          'Sing scale descending: sol-fa-mi-re-do',
          'Keep it smooth and connected'
        ]
      },
      {
        name: 'Single-Note Accuracy',
        duration: 5,
        description: 'All 7 degrees',
        exercises: [
          'Add degrees 6 (la) and 7 (ti)',
          'Practice full scale degrees',
          'Random order recognition'
        ]
      },
      {
        name: 'Tonic Anchoring',
        duration: 5,
        description: 'Short melodic phrases',
        exercises: [
          'Sing: do-re-mi-re-do',
          'Sing: sol-la-sol-fa-mi',
          'Create 5-note patterns'
        ]
      },
      {
        name: 'Ear Training',
        duration: 10,
        description: 'Children\'s songs and folk tunes',
        exercises: [
          'Learn "Mary Had a Little Lamb"',
          'Learn "Twinkle Twinkle"',
          '5-note range maximum',
          'Sing first, then play'
        ]
      }
    ],
    tips: [
      'Focus on simple melodies only',
      'Sing first, instrument second',
      'Keep range limited to 5 notes'
    ]
  },
  {
    week: 8,
    focus: 'Melody Building',
    blocks: [
      {
        name: 'Vocal Calibration',
        duration: 5,
        description: 'Extended range warm-up',
        exercises: [
          'Full scale ascending and descending',
          'Try arpeggio: do-mi-sol-do'
        ]
      },
      {
        name: 'Single-Note Accuracy',
        duration: 5,
        description: 'Octave awareness',
        exercises: [
          'Recognize high do vs low do',
          'Practice degree recognition in higher octave'
        ]
      },
      {
        name: 'Tonic Anchoring',
        duration: 5,
        description: 'Longer phrases',
        exercises: [
          'Create 8-note phrases',
          'Always resolve to tonic',
          'Experiment with rhythm'
        ]
      },
      {
        name: 'Ear Training',
        duration: 10,
        description: 'More folk songs',
        exercises: [
          'Learn 2-3 new simple songs',
          'Try to figure out melodies by ear',
          'Use voice first, then verify'
        ]
      }
    ],
    tips: [
      'Expand your melody vocabulary',
      'Start thinking about rhythm'
    ]
  },
  // Weeks 9-12: Playing by Ear
  {
    week: 9,
    focus: 'Playing by Ear - Introduction',
    blocks: [
      {
        name: 'Vocal Calibration',
        duration: 5,
        description: 'Connect voice to instrument',
        exercises: [
          'Sing a note, then find it on cavaquinho',
          'Slow and deliberate process',
          'Match pitch exactly'
        ]
      },
      {
        name: 'Single-Note Accuracy',
        duration: 5,
        description: 'Voice-to-instrument matching',
        exercises: [
          'Sing degree 1, play on cavaquinho',
          'Sing degree 3, play on cavaquinho',
          'Sing degree 5, play on cavaquinho'
        ]
      },
      {
        name: 'Tonic Anchoring',
        duration: 5,
        description: 'Patterns on instrument',
        exercises: [
          'Sing pattern, then play it',
          'Start with 3-note patterns',
          'Verify accuracy with voice'
        ]
      },
      {
        name: 'Ear Training',
        duration: 10,
        description: 'Simple melody transcription',
        exercises: [
          'Listen to a simple melody',
          'Pause after each note',
          'Find it on your instrument',
          'No chord guessing yet'
        ]
      }
    ],
    tips: [
      'This is where it all comes together!',
      'Slow melodies only',
      'Pause after each note to find it'
    ]
  },
  {
    week: 10,
    focus: 'Playing by Ear - Development',
    blocks: [
      {
        name: 'Vocal Calibration',
        duration: 5,
        description: 'Quick voice-instrument connection',
        exercises: [
          'Random notes: sing then play',
          'Speed up the process',
          'Trust your ear more'
        ]
      },
      {
        name: 'Single-Note Accuracy',
        duration: 5,
        description: 'Faster recognition',
        exercises: [
          'Degree recognition on instrument',
          'Reduce time between hearing and playing'
        ]
      },
      {
        name: 'Tonic Anchoring',
        duration: 5,
        description: '5-note patterns',
        exercises: [
          'Longer patterns on instrument',
          'Maintain tonic awareness',
          'Mix ascending and descending'
        ]
      },
      {
        name: 'Ear Training',
        duration: 10,
        description: 'Longer melody sections',
        exercises: [
          'Learn 4-bar phrases',
          'Combine voice and instrument',
          'Start playing along with recordings'
        ]
      }
    ],
    tips: [
      'Build confidence',
      'Speed will come naturally',
      'Don\'t rush the process'
    ]
  },
  {
    week: 11,
    focus: 'Playing by Ear - Consolidation',
    blocks: [
      {
        name: 'Vocal Calibration',
        duration: 5,
        description: 'Warm-up with song',
        exercises: [
          'Sing a song you know',
          'Match each note on instrument'
        ]
      },
      {
        name: 'Single-Note Accuracy',
        duration: 5,
        description: 'Real music context',
        exercises: [
          'Identify degrees in real songs',
          'Write down what you hear'
        ]
      },
      {
        name: 'Tonic Anchoring',
        duration: 5,
        description: 'Key center awareness',
        exercises: [
          'Find the tonic of a song',
          'Sing the scale of that key',
          'Play along maintaining key'
        ]
      },
      {
        name: 'Ear Training',
        duration: 10,
        description: 'Full song sections',
        exercises: [
          'Learn entire verses of simple songs',
          'Brazilian folk songs recommended',
          'Chorinho themes are excellent'
        ]
      }
    ],
    tips: [
      'Apply skills to real music',
      'Start with familiar songs',
      'Cavaquinho-specific repertoire is great'
    ]
  },
  {
    week: 12,
    focus: 'Playing by Ear - Independence',
    blocks: [
      {
        name: 'Vocal Calibration',
        duration: 5,
        description: 'Final calibration',
        exercises: [
          'Should be automatic',
          'Quick warm-up only needed'
        ]
      },
      {
        name: 'Single-Note Accuracy',
        duration: 5,
        description: 'Advanced recognition',
        exercises: [
          'Chromatic notes awareness',
          'Identify accidentals by ear'
        ]
      },
      {
        name: 'Tonic Anchoring',
        duration: 5,
        description: 'Key changes',
        exercises: [
          'Practice finding new tonic',
          'Modulation awareness'
        ]
      },
      {
        name: 'Ear Training',
        duration: 10,
        description: 'Independent learning',
        exercises: [
          'Choose your own songs to learn',
          'Create practice routine',
          'Set future goals'
        ]
      }
    ],
    tips: [
      'Congratulations! You\'ve built a foundation',
      'Continue daily practice',
      'Chord recognition can come next'
    ]
  }
];

/**
 * Initialize user progress
 */
export const initializeProgress = (): UserProgress => ({
  currentWeek: 1,
  startDate: new Date().toISOString().split('T')[0],
  dailyLogs: [],
  settings: {
    preferredKey: 'C',
    vocalRange: { low: 'C3', high: 'C5' }
  }
});

/**
 * Load progress from localStorage
 */
export const loadProgress = (): UserProgress | null => {
  if (typeof window === 'undefined') return null;
  const saved = localStorage.getItem('earTrainingProgress');
  return saved ? JSON.parse(saved) : null;
};

/**
 * Save progress to localStorage
 */
export const saveProgress = (progress: UserProgress): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('earTrainingProgress', JSON.stringify(progress));
};

/**
 * Get current week based on start date
 */
export const getCurrentWeekNumber = (startDate: string): number => {
  const start = new Date(startDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.min(Math.ceil(diffDays / 7), 12);
};

/**
 * Check if today's practice is complete
 */
export const isTodayComplete = (progress: UserProgress): boolean => {
  const today = new Date().toISOString().split('T')[0];
  return progress.dailyLogs.some(log => log.date === today && log.completed);
};

/**
 * Get practice streak
 */
export const getPracticeStreak = (progress: UserProgress): number => {
  const sortedLogs = [...progress.dailyLogs]
    .filter(log => log.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  if (sortedLogs.length === 0) return 0;
  
  let streak = 0;
  let currentDate = new Date();
  
  for (const log of sortedLogs) {
    const logDate = new Date(log.date);
    const diffDays = Math.floor((currentDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) {
      streak++;
      currentDate = logDate;
    } else {
      break;
    }
  }
  
  return streak;
};

/**
 * Get total practice time
 */
export const getTotalPracticeTime = (progress: UserProgress): number => {
  return progress.dailyLogs.reduce((total, log) => total + log.duration, 0);
};
