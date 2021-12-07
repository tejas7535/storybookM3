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
  getAttritionOverTimeOrgChartData,
  getIsLoadingAttritionOverTimeOrgChart,
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it(
      'should set series data',
      marbles((m) => {
        const result = 'a' as any;
        store.overrideSelector(getAttritionOverTimeOrgChartData, result);

        component.ngOnInit();

        m.expect(component.data$).toBeObservable(
          m.cold('a', {
            a: result,
          })
        );
      })
    );

    it(
      'should set attritionQuotaLoading',
      marbles((m) => {
        const result = true as any;
        store.overrideSelector(getIsLoadingAttritionOverTimeOrgChart, result);

        component.ngOnInit();

        m.expect(component.attritionQuotaLoading$).toBeObservable(
          m.cold('a', {
            a: result,
          })
        );
      })
    );
  });
});
