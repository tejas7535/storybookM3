import { Approver } from '@gq/shared/models';

import { UserInitialLettersPipe } from './user-initial-letters.pipe';

describe('UserInitialLettersPipe', () => {
  const pipe = new UserInitialLettersPipe();

  test('should return empty string if approver is undefined', () => {
    const result = pipe.transform(undefined as Approver);
    expect(result).toBe('');
  });
  test('should return initials for first and lastNAme', () => {
    const result = pipe.transform({
      firstName: 'First',
      lastName: 'Last',
    } as Approver);
    expect(result).toBe('FL');
  });
  test('should return character for lastName', () => {
    const result = pipe.transform({ lastName: 'Last' } as Approver);
    expect(result).toBe('L');
  });
  test('should return character for firstName', () => {
    const result = pipe.transform({ firstName: 'First' } as Approver);
    expect(result).toBe('F');
  });
});
