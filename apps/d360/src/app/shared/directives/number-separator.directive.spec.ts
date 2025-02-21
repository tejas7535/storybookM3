import { NgControl } from '@angular/forms';

import {
  createDirectiveFactory,
  mockProvider,
  SpectatorDirective,
} from '@ngneat/spectator/jest';

import { NumberSeparatorDirective } from './number-separator.directive';

describe('NumberSeparatorDirective', () => {
  let spectator: SpectatorDirective<NumberSeparatorDirective>;

  const createDirective = createDirectiveFactory({
    directive: NumberSeparatorDirective,
    providers: [
      mockProvider(NgControl, {
        control: { patchValue: jest.fn() },
      }),
    ],
    detectChanges: false,
  });

  describe('when allowDecimalPlaces and allowNegativeNumbers are false', () => {
    beforeEach(() => {
      spectator = createDirective(
        `<input d360NumberSeparator [allowDecimalPlaces]="allowDecimalPlaces" [allowNegativeNumbers]="allowNegativeNumbers">`,
        {
          hostProps: {
            allowDecimalPlaces: false,
            allowNegativeNumbers: false,
          },
        }
      );
    });

    it('should set input type to "text" on init', () => {
      spectator.detectChanges();
      expect((spectator.element as HTMLInputElement).type).toBe('text');
    });

    it('should format number input correctly (US format)', () => {
      const mockControl = spectator.inject(NgControl);

      spectator.typeInElement('1234567', spectator.element);

      spectator.detectChanges();

      expect(mockControl.control.patchValue).toHaveBeenCalledWith('1,234,567', {
        emitEvent: false,
        onlySelf: true,
      });
    });
  });

  describe('when allowDecimalPlaces and allowNegativeNumbers are true', () => {
    beforeEach(() => {
      spectator = createDirective(
        `<input d360NumberSeparator [allowDecimalPlaces]="allowDecimalPlaces" [allowNegativeNumbers]="allowNegativeNumbers">`,
        {
          hostProps: {
            allowDecimalPlaces: true,
            allowNegativeNumbers: true,
          },
        }
      );
    });

    it('should allow decimal places', () => {
      const mockControl = spectator.inject(NgControl);

      spectator.typeInElement('1234.56', spectator.element);
      spectator.detectChanges();

      expect(mockControl.control.patchValue).toHaveBeenCalledWith('1,234.56', {
        emitEvent: false,
        onlySelf: true,
      });
    });

    it('should allow negative numbers', () => {
      const mockControl = spectator.inject(NgControl);

      spectator.typeInElement('-1234567', spectator.element);
      spectator.detectChanges();

      expect(mockControl.control.patchValue).toHaveBeenCalledWith(
        '-1,234,567',
        {
          emitEvent: false,
          onlySelf: true,
        }
      );
    });

    it('should allow both negative numbers and decimal places', () => {
      const mockControl = spectator.inject(NgControl);

      spectator.typeInElement('-1234.56', spectator.element);
      spectator.detectChanges();

      expect(mockControl.control.patchValue).toHaveBeenCalledWith('-1,234.56', {
        emitEvent: false,
        onlySelf: true,
      });
    });
  });
});
