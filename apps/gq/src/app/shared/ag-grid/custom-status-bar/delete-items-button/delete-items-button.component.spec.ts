import { MatButtonModule } from '@angular/material/button';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';

import { of } from 'rxjs';

import { RolesFacade } from '@gq/core/store/facades';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { translate } from '@ngneat/transloco';
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
      MockProvider(RolesFacade),
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
        getOpenedToolPanel: jest
          .fn()
          .mockReturnValueOnce(true)
          .mockReturnValueOnce(false),
      },
    } as unknown as IStatusPanelParams;
    store = spectator.inject(MockStore);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test('should call checkUserRoles method', () => {
      component['checkUserRoles'] = jest.fn();
      component.ngOnInit();
      expect(component['checkUserRoles']).toHaveBeenCalled();
    });
    test(
      'should return true for buttonVisible$ when user has general delete positions role but is not the creator of the quotation',
      marbles((m) => {
        component['rolesFacade'].userHasGeneralDeletePositionsRole$ = of(true);
        component['rolesFacade'].loggedInUserId$ = of('aUser');
        component.quotationCreatedBy = 'anotherUser';
        component.ngOnInit();
        m.expect(component.buttonVisible$).toBeObservable(
          m.cold('(a|)', { a: true })
        );
      })
    );
    test(
      'should return true for buttonVisible$ when user does NOT have general delete positions role  but is creator of the case',
      marbles((m) => {
        component['rolesFacade'].userHasGeneralDeletePositionsRole$ = of(false);
        component['rolesFacade'].loggedInUserId$ = of('aUser');
        component.quotationCreatedBy = 'aUser';
        component.ngOnInit();
        m.expect(component.buttonVisible$).toBeObservable(
          m.cold('(a|)', { a: true })
        );
      })
    );
    test(
      'should return false for buttonVisible$ when user does NOT have general delete positions role  and is not creator of the case',
      marbles((m) => {
        component['rolesFacade'].userHasGeneralDeletePositionsRole$ = of(false);
        component['rolesFacade'].loggedInUserId$ = of('aUser');
        component.quotationCreatedBy = 'anotherUser';
        component.ngOnInit();
        m.expect(component.buttonVisible$).toBeObservable(
          m.cold('(a|)', { a: false })
        );
      })
    );
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
    test('should set toolPanelOpened', () => {
      component['params'] = params;

      component.onToolPanelVisibleChanged();
      expect(params.api.getOpenedToolPanel).toHaveBeenCalled();
      expect(component.toolPanelOpened).toBeTruthy();

      component.onToolPanelVisibleChanged();
      expect(params.api.getOpenedToolPanel).toHaveBeenCalled();
      expect(component.toolPanelOpened).toBeFalsy();
    });
  });

  describe('deletePositions', () => {
    test('should open dialog for non sap Quote', () => {
      store.dispatch = jest.fn();

      component['dialog'].open = jest.fn(
        () =>
          ({
            afterClosed: () => of(true),
          } as any)
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
          } as any)
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
