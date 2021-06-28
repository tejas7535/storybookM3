import { RouterTestingModule } from '@angular/router/testing';

import {
  createDirectiveFactory,
  mockProvider,
  SpectatorDirective,
} from '@ngneat/spectator/jest';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { SnackBarService } from '@schaeffler/snackbar';

import { ShareButtonDirective } from './share-button.directive';

describe('ShareButtonDirective', () => {
  let spectator: SpectatorDirective<ShareButtonDirective>;
  let instance: ShareButtonDirective;

  const createDirective = createDirectiveFactory({
    directive: ShareButtonDirective,
    imports: [RouterTestingModule],
    providers: [
      mockProvider(SnackBarService),
      mockProvider(ApplicationInsightsService),
    ],
  });

  beforeEach(() => {
    spectator = createDirective(
      `<div cdbaShareButton>Testing Share Button</div>`
    );

    instance = spectator.directive;
  });

  it('should get the instance', () => {
    expect(instance).toBeDefined();
  });

  describe('shareUrl', () => {
    it('should copy url to clipboard', () => {
      delete window.location;
      const mockLocation = new URL(
        'https://www.example.com/'
      ) as unknown as Location;
      window.location = mockLocation;

      spectator.directive['clipboard'].copy = jest.fn();

      spectator.dispatchMouseEvent(spectator.element, 'click');

      expect(spectator.directive['clipboard'].copy).toHaveBeenCalledWith(
        'https://www.example.com/'
      );
    });

    it('should show toast message', () => {
      spectator.dispatchMouseEvent(spectator.element, 'click');

      expect(
        spectator.directive['snackbarService'].showSuccessMessage
      ).toHaveBeenCalledWith(
        'shared.shareUrl.toastSuccessMessage',
        'shared.shareUrl.toastConfirmMessage'
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
