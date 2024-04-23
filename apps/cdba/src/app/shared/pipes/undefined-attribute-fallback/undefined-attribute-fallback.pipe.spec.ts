import { TranslocoService } from '@jsverse/transloco';
import { createPipeFactory, SpectatorPipe } from '@ngneat/spectator/jest';

import { UndefinedAttributeFallbackPipe } from './undefined-attribute-fallback.pipe';

describe('UndefinedAttributeFallbackPipe', () => {
  let spectator: SpectatorPipe<UndefinedAttributeFallbackPipe>;

  const createPipe = createPipeFactory({
    pipe: UndefinedAttributeFallbackPipe,
    providers: [
      {
        provide: TranslocoService,
        useValue: {
          translate: jest.fn(() => 'n.a.'),
        },
      },
    ],
  });

  it('should not transform the initial value in case the value is defined', () => {
    spectator = createPipe(`{{ '09132-82' | undefinedAttributeFallback }}`);
    expect(spectator.element.textContent).toBe('09132-82');
  });

  it('should transform undefined values to the internationalized not available string', () => {
    spectator = createPipe(`{{ undefined | undefinedAttributeFallback }}`);
    expect(spectator.element.textContent).toBe('n.a.');
  });
});
