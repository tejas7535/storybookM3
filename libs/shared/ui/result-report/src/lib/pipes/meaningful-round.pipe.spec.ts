import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import {
  createPipeFactory,
  mockProvider,
  SpectatorPipe,
} from '@ngneat/spectator/jest';

import { MeaningfulRoundPipe } from './meaningful-round.pipe';

describe('MeaningfulRoundPipe', () => {
  const localizeNumber = jest.fn((numberValue) => `${numberValue}`);
  let spectator: SpectatorPipe<MeaningfulRoundPipe>;

  const createPipe = createPipeFactory({
    pipe: MeaningfulRoundPipe,
    providers: [mockProvider(TranslocoLocaleService, { localizeNumber })],
  });

  afterEach(() => {
    localizeNumber.mockClear();
  });

  it('should return empty text in case of undefined', () => {
    const number = undefined;

    spectator = createPipe(`{{ ${number} | meaningfulRound }}`);

    expect(spectator.element).toHaveText('');
    expect(localizeNumber).not.toHaveBeenCalled();
  });

  it('should return empty text in case of null', () => {
    // eslint-disable-next-line unicorn/no-null
    const number = null;

    spectator = createPipe(`{{ ${number} | meaningfulRound }}`);

    expect(spectator.element).toHaveText('');
    expect(localizeNumber).not.toHaveBeenCalled();
  });

  it('should return empty text for empty strings', () => {
    const number = '';

    spectator = createPipe(`{{ '${number}' | meaningfulRound }}`);

    expect(spectator.element).toHaveText('');
    expect(localizeNumber).not.toHaveBeenCalled();
  });

  it('should round and localize negative numbers', () => {
    const number = -123.446;

    spectator = createPipe(`{{ ${number} | meaningfulRound }}`);

    expect(spectator.element).toHaveText('-123');
    expect(localizeNumber).toHaveBeenCalledWith('-123', 'decimal');
  });

  it('should round and localize number with prefixes', () => {
    const number = '> 10000000';

    spectator = createPipe(`{{ '${number}' | meaningfulRound }}`);

    expect(spectator.element).toHaveText('> 10000000');
    expect(localizeNumber).toHaveBeenCalledWith('10000000', 'decimal');
  });

  it('should return original value in case of non-numeric value', () => {
    const number = 'some string value that cannot be localized';

    spectator = createPipe(`{{ '${number}' | meaningfulRound }}`);

    expect(spectator.element).toHaveText(number);
    expect(localizeNumber).not.toHaveBeenCalled();
  });
});
