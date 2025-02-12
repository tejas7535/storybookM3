import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { TranslocoService } from '@jsverse/transloco';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockModule, MockPipe } from 'ng-mocks';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { getBomExportFeatureStatus } from '@cdba/core/store/selectors/user-interaction/user-interaction.selector';
import { UndefinedAttributeFallbackModule } from '@cdba/shared/pipes';
import { USER_INTERACTION_STATE_MOCK } from '@cdba/testing/mocks';

import {
  BomExportProgress,
  BomExportStatus,
} from '../model/feature/bom-export';
import { UserInteractionDialogComponent } from './user-interaction-dialog.component';

describe('DialogComponent', () => {
  let spectator: Spectator<UserInteractionDialogComponent>;
  let component: UserInteractionDialogComponent;
  let store: MockStore;
  let transloco: TranslocoService;

  const createComponent = createComponentFactory({
    component: UserInteractionDialogComponent,
    imports: [
      MockModule(MatIconModule),
      MockModule(MatButtonModule),
      MockModule(MatTooltipModule),
      MockModule(MatProgressBarModule),
      MockModule(SharedTranslocoModule),
      MockPipe(PushPipe),
      MockPipe(DatePipe),
      MockModule(UndefinedAttributeFallbackModule),
    ],
    providers: [
      {
        provide: MatDialogRef,
        useValue: {
          close: jest.fn(),
        },
      },
      {
        provide: TranslocoService,
        useValue: {
          translate: jest.fn(),
        },
      },
      provideMockStore({ initialState: USER_INTERACTION_STATE_MOCK }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    store = spectator.inject(MockStore);
    transloco = spectator.inject(TranslocoService);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('onClose', () => {
    it('should close dialog when onClose is called', () => {
      const closeSpy = jest
        .spyOn(component['dialogRef'], 'close')
        .mockImplementation();
      component.onClose();
      expect(closeSpy).toHaveBeenCalled();
    });
  });

  describe('onDownload', () => {
    it('should open download URL when onDownload is called', () => {
      const openSpy = jest.spyOn(window, 'open').mockImplementation();
      component.onDownload();
      expect(openSpy).toHaveBeenCalledWith('http://example.com', '_blank');
    });
  });

  describe('isDownloadBtnDisabled', () => {
    it('should return true when export failed', () => {
      component.status = {
        ...component.status,
        progress: BomExportProgress.FAILED,
      };

      const result = component.isDownloadBtnDisabled();

      expect(result).toBeTruthy();
    });
    it('should return true when export link expired', () => {
      component.status = {
        ...component.status,
        downloadUrlExpiry: '2022-12-12T00:00:00',
      };

      const result = component.isDownloadBtnDisabled();

      expect(result).toBe(true);
    });
    it('should return false when export finished successfuly', () => {
      component.status = {
        ...component.status,
        progress: BomExportProgress.FINISHED,
      };

      const result = component.isDownloadBtnDisabled();

      expect(result).toBe(false);
    });
  });

  describe('refreshProgress', () => {
    it('should dispatch actions to refresh progress', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      component.refreshProgress();
      expect(dispatchSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('ngOnInit', () => {
    it('should enable refresh button on failed progress', () => {
      expect(component.refreshStatusBtnDisabled).toBe(true);

      store.overrideSelector(getBomExportFeatureStatus, {
        ...USER_INTERACTION_STATE_MOCK['user-interaction'].feature.bomExport
          .status,
        progress: BomExportProgress.FAILED,
      });
      component.ngOnInit();

      expect(component.refreshStatusBtnDisabled).toBe(false);
    });

    it('should subscribe to bomExportStatus$ on init', () => {
      const subscribeSpy = jest.spyOn(
        component['bomExportStatus$'],
        'subscribe'
      );
      component.ngOnInit();
      expect(subscribeSpy).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from bomExportStatus$ on destroy', () => {
      const unsubscribeSpy = jest.spyOn(
        component['bomExportStatusSubscription'],
        'unsubscribe'
      );
      component.ngOnDestroy();
      expect(unsubscribeSpy).toHaveBeenCalled();
    });
  });

  describe('updateTranslations', () => {
    it('should update translations correctly for "in progress" status', () => {
      const translateSpy = jest
        .spyOn(transloco, 'translate')
        .mockReturnValue('translated');
      component['updateTranslations']({
        progress: BomExportProgress.IN_PROGRESS_3,
      } as BomExportStatus);
      expect(component.userFriendlyProgress).toBe('translated');
      expect(translateSpy).toHaveBeenCalledWith(
        'userInteraction.dialog.progress.inProgress'
      );
    });

    it('should update translations correctly for "failed" status', () => {
      const translateSpy = jest
        .spyOn(transloco, 'translate')
        .mockReturnValueOnce('translated')
        .mockReturnValueOnce('translatedTooltip');
      component['updateTranslations']({
        progress: BomExportProgress.FAILED,
      } as BomExportStatus);
      expect(component.userFriendlyProgress).toBe('translated');
      expect(translateSpy).toHaveBeenCalledWith(
        'userInteraction.dialog.progress.failed'
      );
      expect(component.downloadBtnTooltip).toBe('translatedTooltip');
      expect(translateSpy).toHaveBeenCalledWith(
        'userInteraction.dialog.tooltip.exportFailed'
      );
    });

    it('should update translations correctly for "finished" status and valid link', () => {
      const translateSpy = jest
        .spyOn(transloco, 'translate')
        .mockReturnValue('translated');
      const nextYear = new Date().getFullYear() + 1;
      component['updateTranslations']({
        progress: BomExportProgress.FINISHED,
        downloadUrlExpiry: new Date(`${nextYear}-12-12T00:00:00`).toString(),
      } as BomExportStatus);
      expect(component.userFriendlyProgress).toBe('translated');
      expect(translateSpy).toHaveBeenCalledWith(
        'userInteraction.dialog.progress.finished'
      );
    });

    it('should update translations correctly for "finished" status and expired link', () => {
      const translateSpy = jest
        .spyOn(transloco, 'translate')
        .mockReturnValueOnce('translated')
        .mockReturnValueOnce('translatedTooltip');
      const prevYear = new Date().getFullYear() - 1;
      component['updateTranslations']({
        progress: BomExportProgress.FINISHED,
        downloadUrlExpiry: new Date(`${prevYear}-12-12T00:00:00`).toString(),
      } as BomExportStatus);
      expect(component.userFriendlyProgress).toBe('translated');
      expect(translateSpy).toHaveBeenCalledWith(
        'userInteraction.dialog.progress.finished'
      );
      expect(component.downloadBtnTooltip).toBe('translatedTooltip');
      expect(translateSpy).toHaveBeenCalledWith(
        'userInteraction.dialog.tooltip.downloadExpired'
      );
    });
  });

  describe('updateProgress', () => {
    it('should set progressBarValue to 0 when progress is STARTED', () => {
      component['updateProgress']({
        progress: BomExportProgress.STARTED,
      } as BomExportStatus);
      expect(component.progressBarValue).toBe(0);
    });

    it('should set progressBarValue to 10 when progress is IN_PROGRESS_1', () => {
      component['updateProgress']({
        progress: BomExportProgress.IN_PROGRESS_1,
      } as BomExportStatus);
      expect(component.progressBarValue).toBe(10);
    });

    it('should set progressBarValue to 20 when progress is IN_PROGRESS_2', () => {
      component['updateProgress']({
        progress: BomExportProgress.IN_PROGRESS_2,
      } as BomExportStatus);
      expect(component.progressBarValue).toBe(20);
    });

    it('should set progressBarValue to 30 when progress is IN_PROGRESS_3', () => {
      component['updateProgress']({
        progress: BomExportProgress.IN_PROGRESS_3,
      } as BomExportStatus);
      expect(component.progressBarValue).toBe(30);
    });

    it('should set progressBarValue to 40 when progress is IN_PROGRESS_4', () => {
      component['updateProgress']({
        progress: BomExportProgress.IN_PROGRESS_4,
      } as BomExportStatus);
      expect(component.progressBarValue).toBe(40);
    });

    it('should set progressBarValue to 50 when progress is IN_PROGRESS_5', () => {
      component['updateProgress']({
        progress: BomExportProgress.IN_PROGRESS_5,
      } as BomExportStatus);
      expect(component.progressBarValue).toBe(50);
    });

    it('should set progressBarValue to 60 when progress is IN_PROGRESS_6', () => {
      component['updateProgress']({
        progress: BomExportProgress.IN_PROGRESS_6,
      } as BomExportStatus);
      expect(component.progressBarValue).toBe(60);
    });

    it('should set progressBarValue to 80 when progress is IN_PROGRESS_7', () => {
      component['updateProgress']({
        progress: BomExportProgress.IN_PROGRESS_7,
      } as BomExportStatus);
      expect(component.progressBarValue).toBe(80);
    });

    it('should set progressBarValue to 90 when progress is IN_PROGRESS_8', () => {
      component['updateProgress']({
        progress: BomExportProgress.IN_PROGRESS_8,
      } as BomExportStatus);
      expect(component.progressBarValue).toBe(90);
    });

    it('should set progressBarValue to 100 when progress is FINISHED', () => {
      component['updateProgress']({
        progress: BomExportProgress.FINISHED,
      } as BomExportStatus);
      expect(component.progressBarValue).toBe(100);
    });

    it('should set progressBarValue to 100 when progress is FAILED', () => {
      component['updateProgress']({
        progress: BomExportProgress.FAILED,
      } as BomExportStatus);
      expect(component.progressBarValue).toBe(100);
    });
  });
});
