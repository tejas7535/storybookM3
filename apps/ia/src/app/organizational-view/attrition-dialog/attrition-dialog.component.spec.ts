import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

import { marbles } from 'rxjs-marbles/jest';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { IconsModule } from '@schaeffler/icons';
import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { LineChartModule } from '../../shared/line-chart/line-chart.module';
import { SharedModule } from '../../shared/shared.module';
import {
  getAttritionOverTimeOrgChartData,
  getIsLoadingAttritionOverTimeOrgChart,
} from '../store/selectors/organizational-view.selector';
import { AttritionDialogMetaComponent } from './attrition-dialog-meta/attrition-dialog-meta.component';
import { AttritionDialogComponent } from './attrition-dialog.component';

describe('AttritionDialogComponent', () => {
  let component: AttritionDialogComponent;
  let spectator: Spectator<AttritionDialogComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: AttritionDialogComponent,
    declarations: [AttritionDialogMetaComponent],
    imports: [
      MatDialogModule,
      MatButtonModule,
      IconsModule,
      MatIconModule,
      MatDividerModule,
      LineChartModule,
      provideTranslocoTestingModule({ en: {} }),
      SharedModule,
    ],
    detectChanges: false,
    providers: [
      {
        provide: MAT_DIALOG_DATA,
        useValue: {},
      },
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
