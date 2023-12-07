import { DialogModule, DialogRef } from '@angular/cdk/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { MatTooltipModule } from '@angular/material/tooltip';

import { APP_STATE_MOCK } from '@ea/testing/mocks';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { translate } from '@ngneat/transloco';
import { provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';
import { NgxEchartsModule } from 'ngx-echarts';
import resize_observer_polyfill from 'resize-observer-polyfill';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CalculationResultReportSelectionComponent } from '../calculation-result-report-selection/calculation-result-report-selection.component';
import { CalculationResultReportComponent } from './calculation-result-report.component';

window.ResizeObserver = resize_observer_polyfill;

describe('CalculationResultReportComponent', () => {
  let component: CalculationResultReportComponent;
  let spectator: Spectator<CalculationResultReportComponent>;

  const dialogRefMock = {
    close: jest.fn(),
  };

  const createComponent = createComponentFactory({
    component: CalculationResultReportComponent,
    imports: [
      MockModule(MatButtonModule),
      MatIconTestingModule,
      MockModule(MatTooltipModule),
      MockModule(DialogModule),
      NgxEchartsModule.forRoot({
        echarts: async () => import('echarts'),
      }),

      provideTranslocoTestingModule({ en: {} }),
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
