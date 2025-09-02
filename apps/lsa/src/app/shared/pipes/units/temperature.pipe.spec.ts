import { createPipeFactory, SpectatorPipe } from '@ngneat/spectator/jest';

import { LsaTemperaturePipe } from './temperature.pipe';

describe('TemperaturePipe', () => {
  let spectator: SpectatorPipe<LsaTemperaturePipe>;

  const createPipe = createPipeFactory(LsaTemperaturePipe);

  it('should return the input when metric is set', () => {
    spectator = createPipe("{{ 1.8 | lsaTemperaturePipe: 'UNITSET_SI'}}");
    expect(spectator.element.innerHTML).toContain('1.8');
  });

  it('should convert to °F for celcius input', () => {
    spectator = createPipe("{{ 32 | lsaTemperaturePipe: 'UNITSET_FPS' }}");
    expect(spectator.element.innerHTML).toEqual('89.6');
  });
});
