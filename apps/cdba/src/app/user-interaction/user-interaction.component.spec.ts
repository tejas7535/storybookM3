import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { fetchEventSource } from '@microsoft/fetch-event-source';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';

import { getAccessToken } from '@schaeffler/azure-auth';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import {
  getBomExportFeature,
  trackBomExportStatusFailure,
  trackBomExportStatusSuccess,
  updateBomExportStatus,
} from '@cdba/core/store';
import { USER_INTERACTION_STATE_MOCK } from '@cdba/testing/mocks';

import { UserInteractionDialogComponent } from './dialog/user-interaction-dialog.component';
import { BomExportProgress, BomExportStatus } from './model/feature/bom-export';
import { UserInteractionComponent } from './user-interaction.component';

jest.mock('@microsoft/fetch-event-source', () => ({
  fetchEventSource: jest.fn(),
}));

describe('UserInteractionComponent', () => {
  let spectator: Spectator<UserInteractionComponent>;
  let component: UserInteractionComponent;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: UserInteractionComponent,
    imports: [
      MockModule(MatIconModule),
      MockModule(MatButtonModule),
      MockModule(MatTooltipModule),
      MockModule(MatProgressBarModule),
      MockModule(SharedTranslocoModule),
    ],
    providers: [
      {
        provide: MatDialog,
        useValue: {
          open: jest.fn(),
        },
      },
      provideMockStore({
        initialState: {},
        selectors: [
          { selector: getAccessToken, value: 'test-token' },
          {
            selector: getBomExportFeature,
            value: USER_INTERACTION_STATE_MOCK.userInteraction.feature,
          },
        ],
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    store = spectator.inject(MockStore);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should subscribe to authToken$ and bomExportFeature$ on init', () => {
      const authTokenSpy = jest.spyOn(component['authToken$'], 'subscribe');
      const bomExportFeatureSpy = jest.spyOn(
        component['bomExportFeature$'],
        'subscribe'
      );

      component.ngOnInit();

      expect(authTokenSpy).toHaveBeenCalled();
      expect(bomExportFeatureSpy).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from subscriptions on destroy', () => {
      component['authTokenSubscription'] = { unsubscribe: jest.fn() } as any;
      component['bomExportFeatureSubscription'] = {
        unsubscribe: jest.fn(),
      } as any;

      component.ngOnDestroy();

      expect(component['authTokenSubscription'].unsubscribe).toHaveBeenCalled();
      expect(
        component['bomExportFeatureSubscription'].unsubscribe
      ).toHaveBeenCalled();
    });
  });

  describe('openDialog', () => {
    it('should open the dialog when openDialog is called', () => {
      const dialogSpy = jest.spyOn(spectator.inject(MatDialog), 'open');

      component.openDialog();

      expect(dialogSpy).toHaveBeenCalledWith(UserInteractionDialogComponent);
    });
  });

  describe('trackBomExportStatus', () => {
    it('should dispatch upateBomExportStatus on receiving a message', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      const message = {
        data: JSON.stringify({ progress: BomExportProgress.STARTED }),
      };

      component['token'] = 'test-token';
      component.trackBomExportStatus();

      const eventSource = (fetchEventSource as jest.Mock).mock.calls[0][1] as {
        onmessage: (message: any) => void;
      };

      eventSource.onmessage(message);

      expect(dispatchSpy).toHaveBeenCalledWith(
        updateBomExportStatus({
          currentStatus: {
            progress: BomExportProgress.STARTED,
          } as BomExportStatus,
        })
      );
    });

    it('should dispatch trackBomExportStatusSuccess on close if progress is FINISHED', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component['token'] = 'test-token';
      component.trackBomExportStatus();

      const eventSource = (fetchEventSource as jest.Mock).mock.calls[0][1] as {
        onclose: () => void;
        onmessage: (message: any) => void;
      };

      eventSource.onmessage({
        data: JSON.stringify({ progress: BomExportProgress.FINISHED }),
      });

      eventSource.onclose();

      expect(dispatchSpy).toHaveBeenCalledWith(trackBomExportStatusSuccess());
    });

    it('should dispatch trackBomExportStatusFailure on close if progress is not FINISHED', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component['token'] = 'test-token';
      component.trackBomExportStatus();

      const eventSource = (fetchEventSource as jest.Mock).mock.calls[0][1] as {
        onclose: () => void;
        onmessage: (message: any) => void;
      };

      eventSource.onmessage({
        data: JSON.stringify({ progress: BomExportProgress.STARTED }),
      });

      eventSource.onclose();

      expect(dispatchSpy).toHaveBeenCalledWith(
        trackBomExportStatusFailure({
          errorMessage: 'Wrong progress when closing listener',
        })
      );
    });

    it('should dispatch trackBomExportStatusFailure on error', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component['token'] = 'test-token';
      component.trackBomExportStatus();

      const eventSource = (fetchEventSource as jest.Mock).mock.calls[0][1] as {
        onerror: (error: any) => void;
      };

      const error = new Error('Test error');
      expect(() => eventSource.onerror(error)).toThrow(
        'Error during bom export status tracking'
      );

      expect(dispatchSpy).toHaveBeenCalledWith(
        trackBomExportStatusFailure({ errorMessage: error.message })
      );
    });
  });
});
