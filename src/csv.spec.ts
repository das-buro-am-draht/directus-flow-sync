import { getArrayFromCsv } from './csv';

describe('getArrayFromCsv', () => {
  it('should return array for valid csv', () => {
    const actual = getArrayFromCsv('a,b,c');
    expect(actual).toEqual(['a', 'b', 'c']);
  });

  it('should return array for valid csv with trailing spaces', () => {
    const actual = getArrayFromCsv('a, b, c' );
    expect(actual).toEqual(['a', 'b', 'c']);
  });

  it('should return array for valid csv with leading spaces', () => {
    const actual = getArrayFromCsv('a ,b ,c' );
    expect(actual).toEqual(['a', 'b', 'c']);
  });

  it('should return array for valid csv with leading and trailing spaces', () => {
    const actual = getArrayFromCsv('a , b , c' );
    expect(actual).toEqual(['a', 'b', 'c']);
  });

  it('should return array for valid csv with leading and trailing spaces and empty values', () => {
    const actual = getArrayFromCsv('a , , c' );
    expect(actual).toEqual(['a', 'c']);
  });

  it('should return array for valid csv with trailing empty value', () => {
    const actual = getArrayFromCsv('a,b,' );
    expect(actual).toEqual(['a', 'b']);
  });

  it('should return empty array for empty string', () => {
    const actual = getArrayFromCsv('' );
    expect(actual).toEqual([]);
  });

  it('should return array for single value', () => {
    const actual = getArrayFromCsv('a' as string);
    expect(actual).toEqual(['a']);
  });
});
