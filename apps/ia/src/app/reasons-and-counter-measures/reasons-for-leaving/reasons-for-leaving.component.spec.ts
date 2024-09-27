import { MatCardModule } from '@angular/material/card';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ReasonForLeavingTab } from '../models';
import { selectReasonsForLeavingTab } from '../store/actions/reasons-and-counter-measures.actions';
import {
  getComparedConductedInterviewsInfo,
  getComparedReasonsChartData,
  getComparedReasonsTableData,
  getConductedInterviewsInfo,
  getCurrentTab,
  getReasonsChartData,
  getReasonsChildren,
  getReasonsTableData,
} from '../store/selectors/reasons-and-counter-measures.selector';
import { ReasonsForLeavingComponent } from './reasons-for-leaving.component';
import { ReasonsForLeavingTableModule } from './reasons-for-leaving-table/reasons-for-leaving-table.module';

describe('ReasonsForLeavingComponent', () => {
  let component: ReasonsForLeavingComponent;
  let spectator: Spectator<ReasonsForLeavingComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: ReasonsForLeavingComponent,
    detectChanges: false,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      MatCardModule,
      ReasonsForLeavingTableModule,
      PushPipe,
    ],
    providers: [
      provideMockStore({}),
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
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
    test(
      'should initialize observables from store',
      marbles((m) => {
        const result = 'a' as any;

        store.overrideSelector(getCurrentTab, result);
        store.overrideSelector(getReasonsTableData, result);
        store.overrideSelector(getReasonsChartData, result);
        store.overrideSelector(getReasonsChildren, result);
        store.overrideSelector(getConductedInterviewsInfo, result);
        store.overrideSelector(getComparedReasonsTableData, result);
        store.overrideSelector(getComparedReasonsChartData, result);
        store.overrideSelector(getReasonsChildren, result);
        store.overrideSelector(getComparedConductedInterviewsInfo, result);

        component.ngOnInit();

        m.expect(component.selectedTab$).toBeObservable(
          m.cold('a', {
            a: result,
          })
        );
        m.expect(component.reasonsTableData$).toBeObservable(
          m.cold('a', {
            a: result,
          })
        );
        m.expect(component.reasonsChartData$).toBeObservable(
          m.cold('a', {
            a: result,
          })
        );
        m.expect(component.reasonsChildren$).toBeObservable(
          m.cold('a', {
            a: result,
          })
        );
        m.expect(component.conductedInterviewsInfo$).toBeObservable(
          m.cold('a', {
            a: result,
          })
        );
        m.expect(component.comparedReasonsTableData$).toBeObservable(
          m.cold('a', {
            a: result,
          })
        );
        m.expect(component.comparedReasonsChartData$).toBeObservable(
          m.cold('a', {
            a: result,
          })
        );
        m.expect(component.comparedReasonsChildren$).toBeObservable(
          m.cold('a', {
            a: result,
          })
        );
        m.expect(component.comparedConductedInterviewsInfo$).toBeObservable(
          m.cold('a', {
            a: result,
          })
        );
      })
    );
  });

  describe('onSelectedTabChange', () => {
    test('should emit selected tab', () => {
      store.dispatch = jest.fn();

      component.onSelectedTabChange(ReasonForLeavingTab.TOP_REASONS);

      expect(store.dispatch).toHaveBeenCalledWith(
        selectReasonsForLeavingTab({
          selectedTab: ReasonForLeavingTab.TOP_REASONS,
        })
      );
    });
  });
});
