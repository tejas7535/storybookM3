import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { BehaviorSubject, of } from 'rxjs';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { RolesFacade } from '@gq/core/store/facades';
import { ConfirmationModalComponent } from '@gq/shared/components/modal/confirmation-modal/confirmation-modal.component';
import { HideIfQuotationNotActiveOrPendingDirective } from '@gq/shared/directives/hide-if-quotation-not-active-or-pending/hide-if-quotation-not-active-or-pending.directive';
import { SharedDirectivesModule } from '@gq/shared/directives/shared-directives.module';
import { Quotation, QuotationDetail } from '@gq/shared/models';
import { translate } from '@jsverse/transloco';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { IStatusPanelParams } from 'ag-grid-community';
import { MockDirective, MockProvider } from 'ng-mocks';
import { marbles } from 'rxjs-marbles';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  QUOTATION_DETAIL_MOCK,
  QUOTATION_MOCK,
} from '../../../../../testing/mocks';
import { DeleteItemsButtonComponent } from './delete-items-button.component';

describe('DeleteItemsButtonComponent', () => {
  let component: DeleteItemsButtonComponent;
  let spectator: Spectator<DeleteItemsButtonComponent>;
  let params: IStatusPanelParams;
  let dialog: MatDialog;
  const userHasGeneralDeletePositionsRole$$ = new BehaviorSubject<boolean>(
    false
  );
  const loggedInUserId$$ = new BehaviorSubject<string>('');

  const createComponent = createComponentFactory({
    component: DeleteItemsButtonComponent,
    declarations: [MockDirective(HideIfQuotationNotActiveOrPendingDirective)],
    imports: [
      MatButtonModule,
      MatDialogModule,
      MatIconModule,
      SharedDirectivesModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      MockProvider(RolesFacade, {
        userHasGeneralDeletePositionsRole$:
          userHasGeneralDeletePositionsRole$$.asObservable(),
        loggedInUserId$: loggedInUserId$$.asObservable(),
      }),
      MockProvider(ActiveCaseFacade, {
        removePositionsFromQuotation: jest.fn(),
      }),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    params = {
      api: {
        getSelectedRows: jest.fn(),
        getOpenedToolPanel: jest.fn(),
        deselectAll: jest.fn(),
      },
    } as unknown as IStatusPanelParams;
    component['params'] = params;
    dialog = spectator.inject(MatDialog);
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
          component.quotation = {
            gqCreatedByUser: { id: 'anotherUser' },
          } as Quotation;
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
          component.quotation = {
            gqCreatedByUser: { id: 'aUser' },
          } as Quotation;
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
          component.quotation = {
            gqCreatedByUser: { id: 'anotherUser' },
          } as Quotation;
          m.expect(component.buttonVisible$).toBeObservable(
            m.cold('a', { a: false })
          );
        })
      );
    });

    describe('deleteButtonClass$', () => {
      test(
        'should return right-60 class when tool panel is opened',
        marbles((m) => {
          component['toolPanelOpened$$'].next(true);

          m.expect(component.deleteButtonClass$).toBeObservable(
            m.cold('a', { a: 'panel-opened right-60' })
          );
        })
      );

      test(
        'should return right-12 class when tool panel is closed',
        marbles((m) => {
          component['toolPanelOpened$$'].next(false);

          m.expect(component.deleteButtonClass$).toBeObservable(
            m.cold('a', { a: 'panel-closed right-12' })
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
      component.onGridReady();

      expect(params.api.getSelectedRows).toHaveBeenCalled();
    });
  });

  describe('onSelectionChange', () => {
    test('should set selections and disable delete button if only rfq selected', () => {
      const selections = [QUOTATION_DETAIL_MOCK];

      component['params'].api.getSelectedRows = jest.fn(() => selections);

      component.onSelectionChange();

      expect(params.api.getSelectedRows).toHaveBeenCalled();
      expect(component.selections).toEqual(selections);
      expect(component.isDeleteButtonDisabled).toBeTruthy();
      expect(component.toolTipText).not.toBeEmpty();
      expect(translate).toHaveBeenCalledWith(
        'processCaseView.confirmDeletePositions.onlyRfqDetailsSelectedToolTip',
        { multipleSelected: false }
      );
    });

    test('should set selections and enable delete button not only rfq selected', () => {
      const selections: QuotationDetail[] = [
        { ...QUOTATION_DETAIL_MOCK, rfqData: null },
      ];

      component['params'].api.getSelectedRows = jest.fn(() => selections);

      component.onSelectionChange();

      expect(params.api.getSelectedRows).toHaveBeenCalled();
      expect(component.selections).toEqual(selections);
      expect(component.isDeleteButtonDisabled).toBeFalsy();
      expect(component.toolTipText).toBeUndefined();
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
      component['dialog'].open = jest.fn(
        () =>
          ({
            afterClosed: () => of(true),
          }) as any
      );
      component.selections = [
        QUOTATION_DETAIL_MOCK,
        { ...QUOTATION_DETAIL_MOCK, rfqData: null, gqPositionId: '091' },
      ];

      component.deletePositions();

      expect(translate).toHaveBeenCalledWith(
        `processCaseView.confirmDeletePositions.defaultTitle`,
        { count: 1, multipleSelected: false }
      );
      expect(translate).toHaveBeenCalledWith(
        `processCaseView.confirmDeletePositions.subTitle`,
        { multipleSelected: false }
      );
      expect(translate).toHaveBeenCalledWith(
        `processCaseView.confirmDeletePositions.infoBannerText`,
        undefined
      );
      expect(translate).toHaveBeenCalledWith(
        `processCaseView.confirmDeletePositions.deleteButtonText`,
        undefined
      );
      expect(translate).toHaveBeenCalledWith(
        `processCaseView.confirmDeletePositions.cancelButtonText`,
        undefined
      );
      expect(component['dialog'].open).toHaveBeenCalledTimes(1);
      expect(dialog.open).toHaveBeenCalledWith(ConfirmationModalComponent, {
        maxWidth: 711,
        data: {
          title: 'translate it',
          subtitle: 'translate it',
          infoBannerText: 'translate it',
          confirmButtonText: 'translate it',
          cancelButtonText: 'translate it',
          contentList: [
            {
              id: 'Item 1234',
              value: '016718798-0030 | 6052-M-C3',
            },
          ],
          confirmButtonIcon: 'delete',
        },
      });
      expect(
        component['activeCaseFacade'].removePositionsFromQuotation
      ).toHaveBeenCalled();
    });
    test('should open dialog for sap Quote', () => {
      component['dialog'].open = jest.fn(
        () =>
          ({
            afterClosed: () => of(true),
          }) as any
      );
      component.quotation = { sapId: 'sapId' } as Quotation;
      component.selections = [{ ...QUOTATION_DETAIL_MOCK, rfqData: null }];
      component.deletePositions();

      expect(translate).toHaveBeenCalledWith(
        `processCaseView.confirmDeletePositions.sapTitle`,
        { count: 1, multipleSelected: false }
      );
      expect(translate).toHaveBeenCalledWith(
        `processCaseView.confirmDeletePositions.infoBannerText`,
        undefined
      );
      expect(translate).toHaveBeenCalledWith(
        `processCaseView.confirmDeletePositions.deleteButtonText`,
        undefined
      );
      expect(translate).toHaveBeenCalledWith(
        `processCaseView.confirmDeletePositions.cancelButtonText`,
        undefined
      );
      expect(component['dialog'].open).toHaveBeenCalledTimes(1);
      expect(
        component['activeCaseFacade'].removePositionsFromQuotation
      ).toHaveBeenCalled();
    });
  });
});
