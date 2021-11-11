import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';

import {
  createDirectiveFactory,
  mockProvider,
  SpectatorDirective,
} from '@ngneat/spectator/jest';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import { ShareButtonDirective } from './share-button.directive';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn((key: string) => key),
  replace: jest.fn(),
}));

describe('ShareButtonDirective', () => {
  let spectator: SpectatorDirective<ShareButtonDirective>;
  let instance: ShareButtonDirective;

  const createDirective = createDirectiveFactory({
    directive: ShareButtonDirective,
    imports: [RouterTestingModule],
    providers: [
      mockProvider(MatSnackBar),
      mockProvider(TranslocoService),
      mockProvider(ApplicationInsightsService),
      mockProvider(Clipboard),
    ],
  });

  beforeEach(() => {
    spectator = createDirective(
      `<div schaefflerShareButton>Testing Share Button</div>`
    );

    instance = spectator.directive;
  });

  it('should get the instance', () => {
    expect(instance).toBeDefined();
  });

  describe('shareUrl', () => {
    it('should copy url to clipboard', () => {
      const address = 'https://www.example.com/';
      const spy = jest.spyOn(spectator.directive['clipboard'], 'copy');
      // eslint-disable-next-line no-global-assign
      window = Object.create(window);
      Object.defineProperty(window, 'location', {
        value: {
          href: address,
        },
      });

      spectator.dispatchMouseEvent(spectator.element, 'click');

      expect(spy).toHaveBeenCalledWith(address);
    });

    it('should show toast message', () => {
      spectator.dispatchMouseEvent(spectator.element, 'click');

      expect(spectator.directive['snackbar'].open).toHaveBeenCalledWith(
        'successMessage',
        'dismissMessage',
        { duration: 5000 }
      );
    });

    it('should log event to ai', () => {
      spectator.dispatchMouseEvent(spectator.element, 'click');

      expect(
        spectator.directive['applicationInsights'].logEvent
      ).toHaveBeenCalledWith('Share URL', { params: {} });
    });
  });
});
