import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { BannerModule } from '@schaeffler/banner';

import { provideTranslocoTestingModule } from '../../../../../../../libs/shared/utils/transloco/testing/src';
import { SystemMessage } from '../../../shared/models/system-message';
import { openIABanner } from '../../store/actions/user.action';
import { SystemMessageBannerComponent } from './system-message-banner.component';

describe('SystemMessageBannerComponent', () => {
  let component: SystemMessageBannerComponent;
  let spectator: Spectator<SystemMessageBannerComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: SystemMessageBannerComponent,
    detectChanges: false,
    imports: [
      BannerModule,
      StoreModule.forRoot({}),
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [provideMockStore({})],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;

    store = spectator.inject(MockStore);
    store.dispatch = jest.fn();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('set systemMessage', () => {
    test('should open banner when setting the system message', () => {
      const systemMessage: SystemMessage = {
        id: 1,
        message: 'some message',
        type: 'info',
      };
      component.openBanner = jest.fn();

      component.systemMessage = systemMessage;

      expect(component.systemMessage).toEqual(systemMessage);
      expect(component.openBanner).toHaveBeenCalledWith(systemMessage);
    });
  });

  describe('openBanner', () => {
    test('should open banner', () => {
      const systemMessage: SystemMessage = {
        id: 1,
        message: 'some message',
        type: 'info',
      };

      component.openBanner(systemMessage);

      expect(store.dispatch).toHaveBeenCalledWith(
        openIABanner({ systemMessage })
      );
    });
  });
});
