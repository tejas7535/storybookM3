import { MatButtonModule } from '@angular/material/button';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { BehaviorSubject, of } from 'rxjs';

import { RolesFacade } from '@gq/core/store/facades';
import { translate } from '@jsverse/transloco';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { IStatusPanelParams } from 'ag-grid-community';
import { MockDirective, MockProvider } from 'ng-mocks';
import { marbles } from 'rxjs-marbles';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  PROCESS_CASE_STATE_MOCK,
  QUOTATION_DETAIL_MOCK,
  QUOTATION_MOCK,
} from '../../../../../testing/mocks';
import { HideIfQuotationNotActiveDirective } from '../../../directives/hide-if-quotation-not-active/hide-if-quotation-not-active.directive';
import { DeleteItemsButtonComponent } from './delete-items-button.component';

describe('DeleteItemsButtonComponent', () => {
  let component: DeleteItemsButtonComponent;
  let spectator: Spectator<DeleteItemsButtonComponent>;
  let params: IStatusPanelParams;
  let store: MockStore;
  const userHasGeneralDeletePositionsRole$$ = new BehaviorSubject<boolean>(
    false
  );
  const loggedInUserId$$ = new BehaviorSubject<string>('');

  const createComponent = createComponentFactory({
    component: DeleteItemsButtonComponent,
    declarations: [
      DeleteItemsButtonComponent,
      MockDirective(HideIfQuotationNotActiveDirective),
    ],
    imports: [
      MatButtonModule,
      MatDialogModule,
      MatIconModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      MockProvider(RolesFacade, {
        userHasGeneralDeletePositionsRole$:
          userHasGeneralDeletePositionsRole$$.asObservable(),
        loggedInUserId$: loggedInUserId$$.asObservable(),
      }),
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
      provideMockStore({
        initialState: {
          processCase: PROCESS_CASE_STATE_MOCK,
        },
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    params = {
      api: {
        getSelectedRows: jest.fn(),
        getOpenedToolPanel: jest.fn(),
      },
    } as unknown as IStatusPanelParams;
    store = spectator.inject(MockStore);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('observables', () => {
    describe('buttonVisible$', () => {
      test(
        'should return true for buttonVisible$ when user has general delete positions role but is not the creator of the quotation',
        marbles((m) => {
          userHasGeneralDeletePositionsRole$$.next(true);
          loggedInUserId$$.next('aUser');
          component.quotationCreatedBy = 'anotherUser';
          m.expect(component.buttonVisible$).toBeObservable(
            m.cold('a', { a: true })
          );
        })
      );
      test(
        'should return true for buttonVisible$ when user does NOT have general delete positions role  but is creator of the case',
        marbles((m) => {
          userHasGeneralDeletePositionsRole$$.next(false);
          loggedInUserId$$.next('aUser');
          component.quotationCreatedBy = 'aUser';
          m.expect(component.buttonVisible$).toBeObservable(
            m.cold('a', { a: true })
          );
        })
      );
      test(
        'should return false for buttonVisible$ when user does NOT have general delete positions role  and is not creator of the case',
        marbles((m) => {
          userHasGeneralDeletePositionsRole$$.next(false);
          loggedInUserId$$.next('aUser');
          component.quotationCreatedBy = 'anotherUser';
          m.expect(component.buttonVisible$).toBeObservable(
            m.cold('a', { a: false })
          );
        })
      );
    });

    describe('deleteButtonClass$', () => {
      test(
        'should return right-64 class when tool panel is opened',
        marbles((m) => {
          component['toolPanelOpened$$'].next(true);

          m.expect(component.deleteButtonClass$).toBeObservable(
            m.cold('a', { a: 'right-64' })
          );
        })
      );

      test(
        'should return right-8 class when tool panel is closed',
        marbles((m) => {
          component['toolPanelOpened$$'].next(false);

          m.expect(component.deleteButtonClass$).toBeObservable(
            m.cold('a', { a: 'right-8' })
          );
        })
      );
    });
  });

  describe('agInit', () => {
    test('should set params', () => {
      const statusPanelParams = {
        api: {
          addEventListener: jest.fn(),
        },
        context: {
          quotation: QUOTATION_MOCK,
        },
      } as any;

      component.agInit(statusPanelParams);
      expect(component['params']).toBeDefined();
      expect(component['params'].api.addEventListener).toHaveBeenCalledTimes(3);
    });
  });
  describe('onGridReady', () => {
    test('should set selections', () => {
      component['params'] = params;
      component.onGridReady();

      expect(params.api.getSelectedRows).toHaveBeenCalled();
    });
  });

  describe('onSelectionChange', () => {
    test('should set selections', () => {
      component['params'] = params;
      component.onSelectionChange();

      expect(params.api.getSelectedRows).toHaveBeenCalled();
    });
  });

  describe('onToolPanelVisibleChanged', () => {
    test(
      'should toolPanelOpened$$ return true',
      marbles((m) => {
        params.api.getOpenedToolPanel = jest.fn(() => 'value');
        component['params'] = params;

        component.onToolPanelVisibleChanged();

        expect(params.api.getOpenedToolPanel).toHaveBeenCalled();
        m.expect(component['toolPanelOpened$$']).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );
    test(
      'should toolPanelOpened$$ return false',
      marbles((m) => {
        // eslint-disable-next-line unicorn/no-useless-undefined
        params.api.getOpenedToolPanel = jest.fn(() => undefined);
        component['params'] = params;

        component.onToolPanelVisibleChanged();

        expect(params.api.getOpenedToolPanel).toHaveBeenCalled();
        m.expect(component['toolPanelOpened$$']).toBeObservable(
          m.cold('a', { a: false })
        );
      })
    );
  });

  describe('deletePositions', () => {
    test('should open dialog for non sap Quote', () => {
      store.dispatch = jest.fn();

      component['dialog'].open = jest.fn(
        () =>
          ({
            afterClosed: () => of(true),
          }) as any
      );

      component.selections = [QUOTATION_DETAIL_MOCK];
      component.deletePositions();

      expect(translate).toHaveBeenCalledWith(
        `processCaseView.confirmDeletePositions.text`,
        { variable: 1 }
      );
      expect(translate).toHaveBeenCalledWith(
        `processCaseView.confirmDeletePositions.infoText`
      );
      expect(translate).toHaveBeenCalledWith(
        `processCaseView.confirmDeletePositions.deleteButton`
      );
      expect(translate).toHaveBeenCalledWith(
        `processCaseView.confirmDeletePositions.cancelButton`
      );
      expect(component['dialog'].open).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledTimes(1);
    });
    test('should open dialog for sap Quote', () => {
      store.dispatch = jest.fn();

      component['dialog'].open = jest.fn(
        () =>
          ({
            afterClosed: () => of(true),
          }) as any
      );
      component.isSapQuotation = true;
      component.selections = [QUOTATION_DETAIL_MOCK];
      component.deletePositions();

      expect(translate).toHaveBeenCalledWith(
        `processCaseView.confirmDeletePositions.sapText`,
        { variable: 1 }
      );
      expect(translate).toHaveBeenCalledWith(
        `processCaseView.confirmDeletePositions.infoText`
      );
      expect(translate).toHaveBeenCalledWith(
        `processCaseView.confirmDeletePositions.deleteButton`
      );
      expect(translate).toHaveBeenCalledWith(
        `processCaseView.confirmDeletePositions.cancelButton`
      );
      expect(component['dialog'].open).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledTimes(1);
    });
  });
});
