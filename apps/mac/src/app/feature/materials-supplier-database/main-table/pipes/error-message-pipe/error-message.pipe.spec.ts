import { HashMap, TranslocoModule } from '@jsverse/transloco';
import { createPipeFactory, SpectatorPipe } from '@ngneat/spectator/jest';

import { ErrorMessagePipe } from './error-message.pipe';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@jsverse/transloco'),
  translate: jest.fn((string: string, params?: HashMap) =>
    params && Object.keys(params).length > 0
      ? `${string.split('.').pop()}${Object.values(params).join('')}`
      : string.split('.').pop()
  ),
}));

describe('MaterialEmissionClassificationColorPipe', () => {
  let spectator: SpectatorPipe<ErrorMessagePipe>;
  const createPipe = createPipeFactory(ErrorMessagePipe);

  it.each([
    ['{ required: true }', 'required'],
    ['{min: { min: 1234, current: 99 },}', 'min1234'],
    [
      '{scopeTotalLowerThanSingleScopes: { min: 6, current: 12 },}',
      'co2TooLowShort6',
    ],
    [
      '{scopeTotalHigherThanSingleScopes: { max: 12, current: 6 },}',
      'co2TooHighShort12',
    ],
    ['{ nothing: true }', 'generic'],
  ])('errorpipe with [%s] should return [%s]', (errorObj: any, expected) => {
    spectator = createPipe(`{{ ${errorObj} | errorMessage }}`);
    expect(spectator.element).toHaveText(expected);
  });
});
