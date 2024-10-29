import { SettingsFacade } from '@ea/core/store';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { AppStoreButtonsComponent } from './app-store-buttons.component';

describe('AppStoreButtonsComponent', () => {
  let spectator: Spectator<AppStoreButtonsComponent>;
  let component: AppStoreButtonsComponent;
  describe('when component is not native mobile platform', () => {
    const createComponent = createComponentFactory({
      component: AppStoreButtonsComponent,
      providers: [
        {
          provide: SettingsFacade,
          useValue: {
            isNativeMobile: false,
          },
        },
      ],
    });

    beforeEach(() => {
      spectator = createComponent();
      component = spectator.component;
    });

    it('should create the component', () => {
      expect(component).toBeTruthy();
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
        const appStoreClickSpy = jest.spyOn(component.appStoreClick, 'emit');
        component.onAppStoreClick(storeName);

        expect(appStoreClickSpy).toHaveBeenCalledWith(storeName);
      });
    });
  });

  describe('when platform is mobile native', () => {
    const createComponentWithNativePlatform = createComponentFactory({
      component: AppStoreButtonsComponent,
      providers: [
        {
          provide: SettingsFacade,
          useValue: {
            isNativeMobile: true,
          },
        },
      ],
    });

    beforeEach(() => {
      spectator = createComponentWithNativePlatform();
      spectator.setInput('title', 'some title value');

      spectator.detectChanges();
    });

    it('should not display component content', () => {
      const titleElement = spectator.query('p');
      const storeLinks = spectator.queryAll('a');

      expect(titleElement).not.toExist();
      expect(storeLinks).toHaveLength(0);
    });
  });
});
