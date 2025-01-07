import { DialogModule, DialogRef } from '@angular/cdk/dialog';
import { MatDialog } from '@angular/material/dialog';

import { CO2EmissionResult } from '@ea/core/store/selectors/calculation-result/calculation-result-report.selector';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ECharts } from 'echarts';
import { MockComponent, MockModule } from 'ng-mocks';
import { NgxEchartsModule } from 'ngx-echarts';
import resize_observer_polyfill from 'resize-observer-polyfill';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CalculationDisclaimerComponent } from '../calculation-disclaimer/calculation-disclaimer.component';
import { CalculationDownstreamEmissionComponent } from '../calculation-downstream-emission/calculation-downstream-emission.component';
import { CalculationResultReportEmissionComponent } from './calculation-result-report-emission.component';

window.ResizeObserver = resize_observer_polyfill;

describe('CalculationResultReportEmissionComponent', () => {
  let spectator: Spectator<CalculationResultReportEmissionComponent>;
  let component: CalculationResultReportEmissionComponent;

  const dialogRefMock = {
    close: jest.fn(),
  };

  const createComponent = createComponentFactory({
    component: CalculationResultReportEmissionComponent,
    imports: [
      NgxEchartsModule.forRoot({
        echarts: async () => import('echarts'),
      }),
      provideTranslocoTestingModule({ en: {} }),
      MockModule(DialogModule),
      MockComponent(CalculationDownstreamEmissionComponent),
    ],
    providers: [{ provide: DialogRef, useValue: dialogRefMock }],
    mocks: [MatDialog],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('when deselect all items is called', () => {
    it('should dispatch unselect action', () => {
      const mock = {
        on: jest.fn(),
        dispatchAction: jest.fn(),
      } as Partial<ECharts> as ECharts;
      component['chartInstance'] = mock;

      const dispatchActionSpy = jest.spyOn(
        spectator.component as any,
        'dispatchAction'
      );

      spectator.component.deselectAllItems();

      expect(dispatchActionSpy).toHaveBeenCalledWith('unselect', undefined);
    });
  });

  it('should call dispatchAction with correct parameters when selectItem is called', () => {
    const mock = {
      on: jest.fn(),
      dispatchAction: jest.fn(),
    } as Partial<ECharts> as ECharts;
    component['chartInstance'] = mock;

    const dispatchActionSpy = jest.spyOn(
      spectator.component as any,
      'dispatchAction'
    );
    const index = 1;

    spectator.component.selectItem(index);

    expect(dispatchActionSpy).toHaveBeenCalledWith('select', index);
  });

  describe('when setting coEmission result', () => {
    const result: CO2EmissionResult = {
      co2_upstream: 0.472,
      co2_upstreamEmissionPercentage: 4.693,
      co2_downstream: {
        emission: 9.594,
        emissionPercentage: 95.306,
        loadcases: [
          {
            id: 'Loadcase 1',
            emission: 2.84,
            unit: 'kg',
            emissionPercentage: 28.293,
            operatingTimeInHours: 3506,
          },
          {
            id: 'Loadcase 2',
            emission: 6.745,
            unit: 'kg',
            emissionPercentage: 67.008,
            operatingTimeInHours: 5260,
          },
        ],
      },
      totalEmission: 10.066,
    };

    it('should set result', () => {
      const getCo2ResultItemSpy = jest.spyOn(
        spectator.component as any,
        'getCo2ResultItem'
      );
      const getChartDataSpy = jest.spyOn(
        spectator.component as any,
        'getChartData'
      );
      const setChartOptionsSpy = jest.spyOn(
        spectator.component as any,
        'setChartOptions'
      );

      spectator.setInput('co2Emission', result);

      expect(spectator.component.co2Emission).toEqual(result);
      expect(getCo2ResultItemSpy).toHaveBeenCalledWith(result);
      expect(getChartDataSpy).toHaveBeenCalledWith(result);
      expect(setChartOptionsSpy).toHaveBeenCalledWith(result);
    });

    describe('onChartInit', () => {
      beforeEach(() => {
        spectator.setInput('co2Emission', result);
      });

      it('should register instance and listeners', () => {
        const mock = {
          on: jest.fn(),
          setOption: jest.fn(),
        } as Partial<ECharts> as ECharts;

        component.onChartInit(mock);

        expect(mock.on).toHaveBeenCalledTimes(1);

        const selectChangedHandler = (mock.on as jest.Mock).mock.calls.find(
          (call) => call[0] === 'selectchanged'
        )[1];

        const paramsWithSelectFormAction = {
          fromActionPayload: { dataIndexInside: 1 },
          fromAction: spectator.component['selectFormAction'],
        };

        const paramsWithUnselectFormAction = {
          fromActionPayload: { dataIndexInside: 1 },
          fromAction: 'unselect',
        };

        const updateChartDataOpacitySpy = jest.spyOn(
          spectator.component as any,
          'updateChartDataOpacity'
        );
        const updateOptionsDataSpy = jest.spyOn(
          spectator.component as any,
          'updateOptionsData'
        );

        selectChangedHandler(paramsWithSelectFormAction);
        expect(updateChartDataOpacitySpy).toHaveBeenCalledWith(
          1,
          1,
          spectator.component['lowEmphasisOpacity']
        );
        expect(spectator.component.selectedIndex).toBe(1);
        expect(updateOptionsDataSpy).toHaveBeenCalled();

        selectChangedHandler(paramsWithUnselectFormAction);

        expect(updateChartDataOpacitySpy).toHaveBeenCalledWith(
          -1,
          1,
          spectator.component['highEmphasisOpacity']
        );
        expect(spectator.component.selectedIndex).toBe(undefined);
        expect(updateOptionsDataSpy).toHaveBeenCalled();
      });
    });
  });

  describe('when dialog is closed', () => {
    it('should close dialog ref', () => {
      component.closeDialog();

      expect(dialogRefMock.close).toBeCalled();
    });
  });

  it('should open the CalculationDisclaimerComponent dialog', () => {
    const dialog = spectator.inject(MatDialog);
    const openSpy = jest.spyOn(dialog, 'open');

    spectator.component.showCalculationDisclaimerDialog();

    expect(openSpy).toHaveBeenCalledWith(CalculationDisclaimerComponent, {
      hasBackdrop: true,
      autoFocus: true,
      maxWidth: '750px',
    });
  });
});
