import { DialogModule, DialogRef } from '@angular/cdk/dialog';
import { MatDialog } from '@angular/material/dialog';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { provideRouter } from '@angular/router';

import { DisclaimerService } from '@ea/core/services/disclaimer.service';
import { PDFReportService } from '@ea/core/services/pdf-report.service';
import { TrackingService } from '@ea/core/services/tracking-service/tracking.service';
import { AppStoreButtonsComponent } from '@ea/shared/app-store-buttons/app-store-buttons.component';
import { APP_STATE_MOCK } from '@ea/testing/mocks';
import { translate } from '@jsverse/transloco';
import { provideTranslocoLocale } from '@jsverse/transloco-locale';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';
import { MockComponent, MockModule } from 'ng-mocks';
import { NgxEchartsModule } from 'ngx-echarts';

import { sharedTranslocoLocaleConfig } from '@schaeffler/transloco';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CalculationResultReportEmissionComponent } from '../calculation-result-report-emission/calculation-result-report-emission.component';
import { CalculationResultReportSelectionComponent } from '../calculation-result-report-selection/calculation-result-report-selection.component';
import { CalculationResultReportComponent } from './calculation-result-report.component';

describe('CalculationResultReportComponent', () => {
  let component: CalculationResultReportComponent;
  let spectator: Spectator<CalculationResultReportComponent>;

  const dialogRefMock = {
    close: jest.fn(),
  };

  const createComponent = createComponentFactory({
    component: CalculationResultReportComponent,
    imports: [
      MatIconTestingModule,
      NgxEchartsModule,
      MockModule(DialogModule),
      provideTranslocoTestingModule({ en: {} }),
      MockComponent(CalculationResultReportEmissionComponent),
    ],
    providers: [
      provideMockStore({
        initialState: { ...APP_STATE_MOCK },
      }),
      provideTranslocoLocale(sharedTranslocoLocaleConfig),
      {
        provide: translate,
        useValue: jest.fn(),
      },
      { provide: DialogRef, useValue: dialogRefMock },
      mockProvider(PDFReportService),
      provideRouter([]),
      mockProvider(DisclaimerService),
    ],
    mocks: [TrackingService, MatDialog],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;

    spectator.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog', () => {
    component.closeDialog();
    expect(dialogRefMock.close).toHaveBeenCalled();
  });

  it('should open disclaimer', () => {
    component['openDisclaimer']();
    expect(component['disclaimerService'].openCO2Disclaimer).toHaveBeenCalled();
  });

  describe('when store button is clicked', () => {
    let buttonsComponent: AppStoreButtonsComponent;
    let trackingService: TrackingService;

    beforeEach(() => {
      buttonsComponent = spectator.query(AppStoreButtonsComponent);
      trackingService = spectator.inject(TrackingService);
    });

    it('should emit the store name', () => {
      const storeName = 'App Store';
      const appStoreClickSpy = jest.spyOn(
        buttonsComponent.appStoreClick,
        'emit'
      );

      buttonsComponent.onAppStoreClick(storeName);

      expect(appStoreClickSpy).toHaveBeenCalledWith(storeName);

      expect(trackingService.logAppStoreClick).toHaveBeenCalledWith(
        storeName,
        'result-report'
      );
    });
  });

  describe('should display calculation result report selection component', () => {
    let selectionComponent: CalculationResultReportSelectionComponent;
    beforeEach(() => {
      selectionComponent = spectator.query(
        CalculationResultReportSelectionComponent
      );
    });
    it('should display component', () => {
      expect(selectionComponent).toBeTruthy();
    });

    describe('when calculation type is clicked', () => {
      let scrollingSpy: any;
      const itemName = 'ratingLife';

      beforeEach(() => {
        scrollingSpy = {
          scrollIntoView: jest.fn(),
        } as unknown as any;

        jest
          .spyOn(document, 'querySelector')
          .mockImplementation(() => scrollingSpy);
      });

      it('should scroll to the correct section', () => {
        selectionComponent['calculationTypeClicked'].emit(itemName);

        expect(document.querySelector).toHaveBeenCalledWith(`#${itemName}`);
        expect(scrollingSpy.scrollIntoView).toHaveBeenCalledWith({
          behavior: 'smooth',
          block: 'start',
        });
      });
    });
  });
});
