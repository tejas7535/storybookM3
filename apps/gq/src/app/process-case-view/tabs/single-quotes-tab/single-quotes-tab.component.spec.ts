import { MatCardModule } from '@angular/material/card';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { PushModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';
import { marbles } from 'rxjs-marbles';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';
import { ViewToggleModule } from '@schaeffler/view-toggle';

import {
  PROCESS_CASE_STATE_MOCK,
  QUOTATION_MOCK,
} from '../../../../testing/mocks';
import { getQuotation, getUpdateLoading } from '../../../core/store';
import { CustomStatusBarModule } from '../../../shared/ag-grid/custom-status-bar/custom-status-bar.module';
import { InputTableModule } from '../../../shared/components/case-material/input-table/input-table.module';
import { SharedDirectivesModule } from '../../../shared/directives/shared-directives.module';
import { QuotationDetailsTableModule } from '../../quotation-details-table/quotation-details-table.module';
import { CalculationInProgressComponent } from './calculation-in-progress/calculation-in-progress.component';
import { SingleQuotesTabComponent } from './single-quotes-tab.component';

describe('SingleQuotesTabComponent', () => {
  let component: SingleQuotesTabComponent;
  let spectator: Spectator<SingleQuotesTabComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: SingleQuotesTabComponent,
    imports: [
      MockModule(InputTableModule),
      MockModule(CustomStatusBarModule),
      MockModule(QuotationDetailsTableModule),
      RouterTestingModule,
      provideTranslocoTestingModule({ en: {} }),
      LoadingSpinnerModule,
      PushModule,
      MatCardModule,
      SharedDirectivesModule,
      MatDialogModule,
      ViewToggleModule,
    ],
    declarations: [CalculationInProgressComponent],
    providers: [
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
      provideMockStore({
        initialState: {
          processCase: PROCESS_CASE_STATE_MOCK,
          'azure-auth': {},
        },
      }),
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
      'should set quotation$',
      marbles((m) => {
        store.overrideSelector(getQuotation, QUOTATION_MOCK);

        component.ngOnInit();

        m.expect(component.quotation$).toBeObservable(
          m.cold('a', { a: QUOTATION_MOCK })
        );
      })
    );
    test(
      'should set updateLoading$',
      marbles((m) => {
        store.overrideSelector(getUpdateLoading, true);

        component.ngOnInit();

        m.expect(component.updateLoading$).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );
  });
});
