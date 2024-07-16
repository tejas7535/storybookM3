import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { of } from 'rxjs';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { QuotationStatus, SAP_SYNC_STATUS } from '@gq/shared/models';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { MockProvider } from 'ng-mocks';
import { marbles } from 'rxjs-marbles';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AddItemsButtonComponent } from './add-items-button.component';

describe('AddItemsButtonComponent', () => {
  let component: AddItemsButtonComponent;
  let spectator: Spectator<AddItemsButtonComponent>;

  const createComponent = createComponentFactory({
    component: AddItemsButtonComponent,
    imports: [PushPipe, provideTranslocoTestingModule({ en: {} })],
    providers: [
      MockProvider(ActiveCaseFacade, {
        canEditQuotation$: of(true),
        quotationStatus$: of(QuotationStatus.ACTIVE),
        quotationSapSyncStatus$: of(SAP_SYNC_STATUS.SYNCED),
        simulationModeEnabled$: of(true),
      }),
      provideMockStore({}),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });
  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test(
    'should provide Observables',
    marbles((m) => {
      m.expect(component.quotationEditable$).toBeObservable(
        m.cold('(a|)', { a: true })
      );
      m.expect(component.simulationModeEnabled$).toBeObservable(
        m.cold('(a|)', { a: true })
      );
    })
  );

  describe('agInit', () => {
    test('should set simulationModeEnabled$ and tooltipText$', () => {
      component.agInit();
      expect(component.tooltipText$).toBeDefined();
    });
    test('should call getTooltipTextKey', () => {
      component['getTooltipTextKey'] = jest.fn();
      component.agInit();
      expect(component['getTooltipTextKey']).toHaveBeenCalled();
    });
  });
});
