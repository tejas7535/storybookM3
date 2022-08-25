import { createPipeFactory, SpectatorPipe } from '@ngneat/spectator/jest';

import { ENV, getEnv } from '@cdba/environments/environment.provider';

import { ScrambleMaterialNumberPipe } from './scramble-material-number.pipe';

describe('ScrambleMaterialNumberPipe', () => {
  let spectator: SpectatorPipe<ScrambleMaterialNumberPipe>;

  it('should create an instance', () => {
    const pipe: ScrambleMaterialNumberPipe = new ScrambleMaterialNumberPipe(
      getEnv()
    );

    expect(pipe).toBeInstanceOf(ScrambleMaterialNumberPipe);
  });

  describe('with deactivated environment variable', () => {
    const createPipe = createPipeFactory({
      pipe: ScrambleMaterialNumberPipe,
      providers: [
        { provide: ENV, useValue: { ...getEnv(), scrambleMaterialIds: false } },
      ],
    });

    it('should return value without changes', () => {
      spectator = createPipe(`{{ '050344579-0000' | scrambleMaterialNumber }}`);
      expect(spectator.element.textContent).toBe('050344579-0000');
    });
  });

  describe('with production environment variable', () => {
    const createPipe = createPipeFactory({
      pipe: ScrambleMaterialNumberPipe,
      providers: [
        { provide: ENV, useValue: { ...getEnv(), production: true } },
      ],
    });

    it('should return value without changes', () => {
      spectator = createPipe(`{{ '050344579-0000' | scrambleMaterialNumber }}`);
      expect(spectator.element.textContent).toBe('050344579-0000');
    });
  });

  describe('with activated environment variable', () => {
    const createPipe = createPipeFactory({
      pipe: ScrambleMaterialNumberPipe,
      providers: [
        { provide: ENV, useValue: { ...getEnv(), scrambleMaterialIds: true } },
      ],
    });

    it('should return a random value', () => {
      spectator = createPipe(`{{ '050344579-0000' | scrambleMaterialNumber }}`);
      expect(spectator.element.textContent).not.toBe('050344579-0000');
    });

    it('should return a value with first scramble pattern', () => {
      spectator = createPipe(
        `{{ '050344579-0000' | scrambleMaterialNumber: 0 }}`
      );
      expect(spectator.element.textContent).toContain('736234653');
    });

    it('should return a value with second scramble pattern', () => {
      spectator = createPipe(
        `{{ '050344579-0000' | scrambleMaterialNumber: 1 }}`
      );
      expect(spectator.element.textContent).toContain('945346672');
    });
  });
});
