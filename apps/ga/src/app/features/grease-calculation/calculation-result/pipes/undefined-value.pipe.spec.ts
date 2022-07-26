import { createPipeFactory, SpectatorPipe } from '@ngneat/spectator/jest';
import { TranslocoService } from '@ngneat/transloco';

import { UndefinedValuePipe } from './undefined-value.pipe';

describe('UndefinedValuePipe', () => {
  let spectator: SpectatorPipe<UndefinedValuePipe>;

  const createPipe = createPipeFactory({
    pipe: UndefinedValuePipe,
    providers: [
      {
        provide: TranslocoService,
        useValue: {
          translate: jest.fn(() => 'n.a.'),
        },
      },
    ],
  });

  it('should keep the value as is', () => {
    spectator = createPipe(`{{ 'abcd' | undefinedValue }}`);
    expect(spectator.element.textContent).toBe('abcd');
  });

  it('should transform the undefined value', () => {
    spectator = createPipe(`{{ undefined | undefinedValue }}`);
    expect(spectator.element.textContent).toBe('n.a.');
  });
});
