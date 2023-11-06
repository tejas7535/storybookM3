import { translate } from '@ngneat/transloco';
import { when } from 'jest-when';

import { DeltaDisplayPipe } from './delta-display.pipe';

describe('DeltaDisplayPipe', () => {
  test('create an instance', () => {
    const pipe = new DeltaDisplayPipe();
    expect(pipe).toBeTruthy();
  });

  test("should return '' if delta is undefined", () => {
    const pipe = new DeltaDisplayPipe();
    expect(pipe.transform(undefined as any)).toBe('');
  });

  test("should return 'differentString' if delta.absolute or delta.relative is undefined", () => {
    const pipe = new DeltaDisplayPipe();

    when(translate)
      .calledWith(`${pipe['TRANSLATE_PREFIX']}.differentString`)
      .mockReturnValue('differentString');

    expect(pipe.transform({ isDelta: true })).toBe('differentString');
  });

  test("should return 'positiveDelta' if delta.absolute is greater than or equal to 0", () => {
    const pipe = new DeltaDisplayPipe();
    when(translate)
      .calledWith(`${pipe['TRANSLATE_PREFIX']}.positiveDelta`, {
        absolute: 1,
        relative: 1,
      })
      .mockReturnValue('positiveDelta');
    expect(pipe.transform({ isDelta: true, absolute: 1, relative: 1 })).toBe(
      'positiveDelta'
    );
  });

  test("should return 'negativeDelta' if delta.absolute is less than 0", () => {
    const pipe = new DeltaDisplayPipe();
    when(translate)
      .calledWith(`${pipe['TRANSLATE_PREFIX']}.negativeDelta`, {
        absolute: -1,
        relative: -1,
      })
      .mockReturnValue('negativeDelta');
    expect(pipe.transform({ isDelta: true, absolute: -1, relative: -1 })).toBe(
      'negativeDelta'
    );
  });
});
