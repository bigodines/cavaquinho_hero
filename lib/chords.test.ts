import {
  diminishedTetrad,
  minorSevenMajorTetrad,
  halfDiminishedTetrad,
  Tetrad,
} from './chords';

describe('lib.Chords', () => {
  it('can run tests', () => {
    expect(true).toBe(true);
  });

  it('Uses enharmonic notes contained in the scale for tetrads', () => {
    // in the D scale, the seventh is Cb and not B
    // (even tho they sound the same)
    let actual = diminishedTetrad('D');
    expect(actual?.first).toBe('D');
    expect(actual?.third).toBe('F');
    expect(actual?.fifth).toBe('Ab');
    expect(actual?.seventh).toBe('Cb');

    actual = minorSevenMajorTetrad('G');
    expect(actual?.first).toBe('G');
    expect(actual?.third).toBe('Bb');
    expect(actual?.fifth).toBe('D');
    expect(actual?.seventh).toBe('F#');
  });

  it('Generates valid Xm7b5 tetrads', () => {
    let actual = halfDiminishedTetrad('G');
    let expected = Tetrad(['G', 'Bb', 'Db', 'F']);

    expect(actual?.first).toBe(expected?.first);
    expect(actual?.third).toBe(expected?.third);
    expect(actual?.fifth).toBe(expected?.fifth);
    expect(actual?.seventh).toBe(expected?.seventh);

    actual = halfDiminishedTetrad('Eb');
    expected = Tetrad(['Eb', 'Gb', 'Bbb', 'Db']);

    expect(actual?.first).toBe(expected?.first);
    expect(actual?.third).toBe(expected?.third);
    expect(actual?.fifth).toBe(expected?.fifth);
    expect(actual?.seventh).toBe(expected?.seventh);
  });
});
