import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { PROCESS_CASE_STATE_MOCK } from './../../../../testing/mocks';
import { OverviewTabComponent } from './overview-tab.component';

describe('OverviewTabComponent', () => {
  let component: OverviewTabComponent;
  let spectator: Spectator<OverviewTabComponent>;
  const createComponent = createComponentFactory({
    component: OverviewTabComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [
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
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test('should call methods', () => {
      component['initializeObservables'] = jest.fn();
      component.ngOnInit();
      expect(component['initializeObservables']).toHaveBeenCalled();
    });

    test(
      'should init Observables',
      marbles((m) => {
        component.ngOnInit();

        m.expect(component.generalInformation$).toBeObservable('a', {
          a: {
            approvalLevel: 'L1 + L2',
            validityFrom: '01/01/2023',
            validityTo: '12/31/2023',
            duration: '10 months',
            project: 'GSIM Project',
            projectInformation:
              'This is a longer text that contains some Project information',
            customer: PROCESS_CASE_STATE_MOCK.customer.item,
            requestedQuotationDate: '01/01/2024',
            comment: 'This is a longer comment text, that contains a comment.',
          },
        });
      })
    );
  });

  describe('ngOnDestroy', () => {
    test('should call methods', () => {
      component['shutDown$$'].next = jest.fn();
      component['shutDown$$'].unsubscribe = jest.fn();

      component.ngOnDestroy();

      expect(component['shutDown$$'].next).toHaveBeenCalled();
      expect(component['shutDown$$'].unsubscribe).toHaveBeenCalled();
    });
  });
});
