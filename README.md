# Cavaquinho Hero

A music theory toolkit for learning and practicing chords, scales, and harmonic fields. Built with Next.js 15 and TypeScript.

## Features

- **Chord Generator**: Generate triads and tetrads (7th chords) for any note
- **Harmonic Field Explorer**: Explore major and minor harmonic fields with diatonic chords, dominants, ii-V-I progressions, and substitutions
- **Chord Visualization**: View chord shapes on a fretboard (beta)

## Tech Stack

- Next.js 15
- React 18
- TypeScript 5
- Material UI 6
- Jest for testing
- Sass for styling

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
# Run development server
make run
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Available Commands

```bash
make help         # Show all available commands
make run          # Run development server
make build        # Build for production
make test         # Run tests
make lint         # Run linter
make type-check   # Run TypeScript type check (via npm run type-check)
```

### Testing

```bash
npm test          # Run tests once
npm test -- --watch  # Run tests in watch mode
```

## Project Structure

```
├── components/     # React components
│   ├── Header/     # Navigation header
│   ├── ChordTable/ # Chord display table
│   ├── HarmonicField/ # Harmonic field explorer
│   └── Chordz/     # Chord visualization SVG components
├── lib/            # Core music theory modules
│   ├── scales.ts   # Scale generation (major, harmonic minor)
│   ├── chords.ts   # Chord construction (triads, tetrads)
│   ├── tonality.ts # Harmonic fields and progressions
│   └── fretboard.ts # Fretboard representation
├── pages/          # Next.js pages
│   ├── index.tsx   # Home page
│   ├── chords.tsx  # Chord generator
│   ├── harmonic_field.tsx # Harmonic field explorer
│   └── about.tsx   # About page
└── styles/         # Global styles
```

## Music Theory Modules

### Scales (`lib/scales.ts`)
- `major(root)` - Generate major scale
- `harmonicMinor(root)` - Generate harmonic minor scale
- `isValidNote(note)` - Validate note
- `noteAdd(note, semitones)` - Transpose a note
- `enharmony(from, to)` - Find enharmonic equivalent

### Chords (`lib/chords.ts`)
- Triads: `majorTriad`, `minorTriad`, `augmentedTriad`, `diminishedTriad`
- Tetrads: `sevenTetrad`, `sevenMajorTetrad`, `minorSevenTetrad`, etc.
- Sixth chords: `sixthTetrad`, `minorSixthTetrad`

### Tonality (`lib/tonality.ts`)
- `majorDiatonicScale(root)` - Major harmonic field
- `harmonicMinorDiatonicScale(root)` - Minor harmonic field
- `dominantChord(chord)` - Find V chord
- `iiChord(chord)` - Find ii chord for ii-V-I
- `subV(chord)` - Find tritone substitution

## License

MIT

