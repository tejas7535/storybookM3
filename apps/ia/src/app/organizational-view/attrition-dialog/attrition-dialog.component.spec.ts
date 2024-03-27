import { MatButtonModule } from '@angular/material/button';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { EChartsOption } from 'echarts';
import { MockComponent } from 'ng-mocks';
import { marbles } from 'rxjs-marbles/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { getDefaultFluctuationChartConfig } from '../../overview/store/selectors/overview.selector';
import { LineChartComponent } from '../../shared/charts/line-chart/line-chart.component';
import { SharedModule } from '../../shared/shared.module';
import { SeriesType } from '../models';
import { changeAttritionOverTimeSeries } from '../store/actions/organizational-view.action';
import {
  getChildAttritionOverTimeOrgChartSeries,
  getChildIsLoadingAttritionOverTimeOrgChart,
  getParentAttritionOverTimeOrgChartData,
  getParentIsLoadingAttritionOverTimeOrgChart,
} from '../store/selectors/organizational-view.selector';
import { AttritionDialogComponent } from './attrition-dialog.component';
import { AttritionDialogMetaComponent } from './attrition-dialog-meta/attrition-dialog-meta.component';

describe('AttritionDialogComponent', () => {
  let component: AttritionDialogComponent;
  let spectator: Spectator<AttritionDialogComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: AttritionDialogComponent,
    declarations: [
      MockComponent(LineChartComponent),
      AttritionDialogMetaComponent,
    ],
    imports: [
      MatDialogModule,
      MatButtonModule,
      MatIconModule,
      MatDividerModule,
      provideTranslocoTestingModule({ en: {} }),
      SharedModule,
    ],
    detectChanges: false,
    providers: [
      { provide: MAT_DIALOG_DATA, useValue: {} },
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
      provideMockStore({}),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = spectator.inject(MockStore);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test(
      'fluctuationChartConfig',
      marbles((m) => {
        const result = {} as EChartsOption;
        store.overrideSelector(getDefaultFluctuationChartConfig, result);

        component.ngOnInit();

        m.expect(component.fluctuationChartConfig$).toBeObservable(
          m.cold('a', {
            a: result,
          })
        );
      })
    );

    test(
      'should set parent fluctuation over time data',
      marbles((m) => {
        const result = 'a' as any;
        store.overrideSelector(getParentAttritionOverTimeOrgChartData, result);

        component.ngOnInit();

        m.expect(component.parentFluctuationOverTimeData$).toBeObservable(
          m.cold('a', {
            a: result,
          })
        );
      })
    );

    test(
      'should set parentFluctuationOverTimeDataLoading',
      marbles((m) => {
        const result = true as any;
        store.overrideSelector(
          getParentIsLoadingAttritionOverTimeOrgChart,
          result
        );

        component.ngOnInit();

        m.expect(
          component.parentFluctuationOverTimeDataLoading$
        ).toBeObservable(
          m.cold('a', {
            a: result,
          })
        );
      })
    );

    test(
      'should set child fluctuation over time data',
      marbles((m) => {
        const result = 'a' as any;
        store.overrideSelector(getChildAttritionOverTimeOrgChartSeries, result);

        component.ngOnInit();

        m.expect(component.parentFluctuationOverTimeData$).toBeObservable(
          m.cold('a', {
            a: result,
          })
        );
      })
    );

    test(
      'should set childFluctuationOverTimeDataLoading',
      marbles((m) => {
        const result = true as any;
        store.overrideSelector(
          getChildIsLoadingAttritionOverTimeOrgChart,
          result
        );

        component.ngOnInit();

        m.expect(
          component.parentFluctuationOverTimeDataLoading$
        ).toBeObservable(
          m.cold('a', {
            a: result,
          })
        );
      })
    );
  });

  describe('AttritionDialogComponent', () => {
    describe('onSeriesTypeChange', () => {
      test('should dispatch changeAttritionOverTimeSeries action', () => {
        const serie = SeriesType.UNFORCED_FLUCTUATION;
        const dispatchSpy = (store.dispatch = jest.fn());

        component.onSeriesTypeChange(serie);

        expect(dispatchSpy).toHaveBeenCalledWith(
          changeAttritionOverTimeSeries({ serie })
        );
      });

      test('should update mergeOptions yAxis for UNFORCED_FLUCTUATION series type', () => {
        const serie = SeriesType.UNFORCED_FLUCTUATION;

        component.onSeriesTypeChange(serie);

        expect(component.mergeOptions).toEqual({
          yAxis: {
            type: 'value',
            axisLabel: {
              formatter: '{value}%',
            },
            minInterval: undefined,
          },
        });
      });

      test('should update mergeOptions yAxis for other series types', () => {
        const serie = SeriesType.UNFORCED_LEAVERS;

        component.onSeriesTypeChange(serie);

        expect(component.mergeOptions).toEqual({
          yAxis: {
            type: 'value',
            axisLabel: {
              formatter: undefined,
            },
            minInterval: 1,
          },
        });
      });
    });
  });
});
