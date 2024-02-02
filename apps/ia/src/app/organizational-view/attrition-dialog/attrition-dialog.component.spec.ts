import { MatButtonModule } from '@angular/material/button';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockComponent } from 'ng-mocks';
import { marbles } from 'rxjs-marbles/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { LineChartComponent } from '../../shared/charts/line-chart/line-chart.component';
import { SharedModule } from '../../shared/shared.module';
import {
  getChildDimensionName,
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
      'should set fluctuation over time data',
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
      'should set fluctuationOverTimeDataLoading',
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
      'should set child dimension name',
      marbles((m) => {
        const result = 'child';
        store.overrideSelector(getChildDimensionName, result);

        component.ngOnInit();

        m.expect(component.childDimensionName$).toBeObservable(
          m.cold('a', {
            a: result,
          })
        );
      })
    );
  });
});
