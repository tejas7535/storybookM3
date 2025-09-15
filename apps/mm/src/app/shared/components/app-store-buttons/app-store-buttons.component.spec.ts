import { signal } from '@angular/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockProvider } from 'ng-mocks';

import { EaDeliveryService } from '@schaeffler/engineering-apps-behaviors/utils';

import { AppStoreButtonsComponent } from './app-store-buttons.component';

describe('AppStoreButtonsComponent', () => {
  let spectator: Spectator<AppStoreButtonsComponent>;
  const createComponent = createComponentFactory({
    component: AppStoreButtonsComponent,
    providers: [
      MockProvider(EaDeliveryService, {
        assetsPath: signal('/base/assets/'),
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create the component', () => {
    expect(spectator.component).toBeTruthy();
  });

  describe('when the title is set', () => {
    it('should display the title', () => {
      const title = 'Download the app title';
      spectator.setInput('title', title);
      spectator.detectChanges();
      const titleElement = spectator.query('p');

      expect(titleElement).toHaveText(title);
    });
  });

  describe('when the title is not set', () => {
    it('should not display the title', () => {
      const titleElement = spectator.query('p');

      expect(titleElement).not.toExist();
    });
  });

  describe('when the app store button is clicked', () => {
    it('should emit the app store name', () => {
      const storeName = 'App Store';
      const appStoreClickSpy = jest.spyOn(
        spectator.component.appStoreClick,
        'emit'
      );
      spectator.component.onAppStoreClick(storeName);

      expect(appStoreClickSpy).toHaveBeenCalledWith(storeName);
    });
  });
});
