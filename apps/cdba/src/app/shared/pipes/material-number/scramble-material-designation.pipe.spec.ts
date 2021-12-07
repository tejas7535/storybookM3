import { ENV, getEnv } from '@cdba/environments/environment.provider';
import { createPipeFactory, SpectatorPipe } from '@ngneat/spectator/jest';

import { ScrambleMaterialDesignationPipe } from './scramble-material-designation.pipe';

describe('ScrambleMaterialDesignationPipe', () => {
  let spectator: SpectatorPipe<ScrambleMaterialDesignationPipe>;

  it('should create an instance', () => {
    const pipe: ScrambleMaterialDesignationPipe =
      new ScrambleMaterialDesignationPipe(getEnv());

    expect(pipe).toBeInstanceOf(ScrambleMaterialDesignationPipe);
  });

  describe('with deactivated environment variable', () => {
    const createPipe = createPipeFactory({
      pipe: ScrambleMaterialDesignationPipe,
      providers: [
        { provide: ENV, useValue: { ...getEnv(), scrambleMaterialIds: false } },
      ],
    });

    it('should return value without changes', () => {
      spectator = createPipe(
        `{{ 'F-234795.02-0030.IBBU' | scrambleMaterialDesignation }}`
      );
      expect(spectator.element.textContent).toBe('F-234795.02-0030.IBBU');
    });
  });

  describe('with production environment variable', () => {
    const createPipe = createPipeFactory({
      pipe: ScrambleMaterialDesignationPipe,
      providers: [
        { provide: ENV, useValue: { ...getEnv(), production: true } },
      ],
    });

    it('should return value without changes', () => {
      spectator = createPipe(
        `{{ 'F-234795.02-0030.IBBU' | scrambleMaterialDesignation }}`
      );
      expect(spectator.element.textContent).toBe('F-234795.02-0030.IBBU');
    });
  });

  describe('with activated environment variable', () => {
    const createPipe = createPipeFactory({
      pipe: ScrambleMaterialDesignationPipe,
      providers: [
        { provide: ENV, useValue: { ...getEnv(), scrambleMaterialIds: true } },
      ],
    });

    it('should return a random value', () => {
      spectator = createPipe(
        `{{ 'F-234795.02-0030.IBBU' | scrambleMaterialDesignation }}`
      );
      expect(spectator.element.textContent).not.toBe('F-234795.02-0030.IBBU');
    });

    it('should return a value with first scramble pattern', () => {
      spectator = createPipe(
        `{{ 'F-234795.02-0030.IBBU' | scrambleMaterialDesignation: 0 }}`
      );
      expect(spectator.element.textContent).toContain('363453');
    });

    it('should return a value with second scramble pattern', () => {
      spectator = createPipe(
        `{{ 'F-234795.02-0030.IBBU' | scrambleMaterialDesignation: 1 }}`
      );
      expect(spectator.element.textContent).toContain('454672');
    });

    describe('with a non standard value', () => {
      it('should return value without changes', () => {
        spectator = createPipe(
          `{{ 'F34795.020030.IBBU' | scrambleMaterialDesignation }}`
        );
        expect(spectator.element.textContent).toBe('F34795.020030.IBBU');
      });

      it('should return the value without changes', () => {
        spectator = createPipe(
          `{{ 'F-34795020030IBBU' | scrambleMaterialDesignation }}`
        );
        expect(spectator.element.textContent).toBe('F-34795020030IBBU');
      });
    });
  });
});
