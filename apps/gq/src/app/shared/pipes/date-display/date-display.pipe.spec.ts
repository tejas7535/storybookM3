import { DateDisplayPipe } from './date-display.pipe';

describe('DateDisplayPipe', () => {
  test('create an instance', () => {
    const pipe = new DateDisplayPipe();
    expect(pipe).toBeTruthy();
  });
  test('should transform dateString', () => {
    const pipe = new DateDisplayPipe();
    const result = pipe.transform('2013-11-14 00:00:00.000');

    // German (dd.MM.yyyy) or American (MM/DD/YYYY), depending on the user settings
    expect(['14.11.2013', '11/14/2013', '14/11/2013']).toContainEqual(result);
  });
});
