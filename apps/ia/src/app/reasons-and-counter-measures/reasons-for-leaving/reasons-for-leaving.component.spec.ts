import { MatCardModule } from '@angular/material/card';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  getOverallComparedReasonsTableData,
  getOverallReasonsTableData,
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

        store.overrideSelector(getOverallReasonsTableData, result);
        store.overrideSelector(getOverallComparedReasonsTableData, result);

        component.ngOnInit();

        m.expect(component.reasonsTableData$).toBeObservable(
          m.cold('a', {
            a: result,
          })
        );
        m.expect(component.comparedReasonsTableData$).toBeObservable(
          m.cold('a', {
            a: result,
          })
        );
      })
    );
  });
});
