import { DialogModule, DialogRef } from '@angular/cdk/dialog';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { PDFReportService } from '@ea/core/services/pdf-report.service';
import { APP_STATE_MOCK } from '@ea/testing/mocks';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { translate } from '@ngneat/transloco';
import { provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

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
      MockModule(DialogModule),
      provideTranslocoTestingModule({ en: {} }),
      RouterTestingModule,
    ],
    providers: [
      provideMockStore({
        initialState: { ...APP_STATE_MOCK },
      }),
      {
        provide: translate,
        useValue: jest.fn(),
      },
      { provide: DialogRef, useValue: dialogRefMock },
      mockProvider(PDFReportService),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;

    spectator.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog', () => {
    component.closeDialog();
    expect(dialogRefMock.close).toHaveBeenCalled();
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

        expect(document.querySelector).toBeCalledWith(`#${itemName}`);
        expect(scrollingSpy.scrollIntoView).toBeCalledWith({
          behavior: 'smooth',
          block: 'start',
        });
      });
    });
  });
});
