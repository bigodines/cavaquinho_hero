import { major, isValidNote, harmonicMinor } from './scales';

describe('lib.Scales', () => {
  it('can generate the major scale', () => {
    // Remember major scale: whole, whole, half, whole, whole, whole, half
    let expected = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    let result = major('C');
    expect(result).toEqual(expected);

    expected = ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'];
    result = major('D');
    expect(result).toEqual(expected);

    expected = ['Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb', 'C'];
    result = major('Db');
    expect(result).toEqual(expected);
  });

  it('checks if a note is valid', () => {
    expect(isValidNote('A')).toBeTruthy();
    expect(isValidNote('C#')).toBeTruthy();
    expect(isValidNote('Fb')).toBeTruthy();

    expect(isValidNote('Z')).toBeFalsy();
    expect(isValidNote('CC')).toBeFalsy();
  });

  it('can generate the minor harmonic scale', () => {
    let expected = ['A', 'B', 'C', 'D', 'E', 'F', 'G#'];
    let result = harmonicMinor('A');
    expect(result).toEqual(expected);

    expected = ['D', 'E', 'F', 'G', 'A', 'Bb', 'C#'];
    result = harmonicMinor('D');
    expect(result).toEqual(expected);
  });
});
