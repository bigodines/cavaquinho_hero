export interface ChordData {
  frets: number[];
  barres: number[];
  fingers: number[];
  capo: boolean;
  baseFret?: number;
}

export interface Instrument {
  strings: number;
  fretsOnChord: number;
  name: string;
  keys: string[];
  tunings: {
    standard: string[];
  };
}
