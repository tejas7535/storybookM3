import { signal } from '@angular/core';

import { of } from 'rxjs';

import { RecalculateSqvStatus } from '@gq/calculator/rfq-4-detail-view/models/recalculate-sqv-status.enum';
import { RolesFacade } from '@gq/core/store/facades';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AUTH_STATE_MOCK } from '../../../../../../testing/mocks';
import { CALCULATOR_RFQ_4_PROCESS_DATA_MOCK } from '../../../../../../testing/mocks/models/calculator/rfq-4-detail-view/rfq-4-detail-view-data.mock';
import { Rfq4DetailViewStore } from '../../../store/rfq-4-detail-view.store';
import { PositionInformationComponent } from './position-information.component';

describe('PositionInformationComponent', () => {
  let component: PositionInformationComponent;
  let spectator: Spectator<PositionInformationComponent>;
  const rfq4ProcessData = signal(CALCULATOR_RFQ_4_PROCESS_DATA_MOCK);
  const productStructureLink = 'https://example.com/product-structure';

  const createComponent = createComponentFactory({
    component: PositionInformationComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
    providers: [
      {
        provide: Rfq4DetailViewStore,
        useValue: {
          getQuotationDetailData: signal(null),
          getRfq4ProcessData: rfq4ProcessData,
          assignRfq: jest.fn(),
          productStructureUrl: signal(productStructureLink),
        },
      },
      mockProvider(RolesFacade, {
        loggedInUserId$: of(AUTH_STATE_MOCK.accountInfo.username),
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

  describe('assignRfq', () => {
    test('should call assignRfq method', () => {
      component.assignRfq();

      expect(component['store'].assignRfq).toHaveBeenCalled();
    });
  });

  describe('openLink', () => {
    beforeEach(() => {
      jest.spyOn(window, 'open').mockImplementation();
      component.productStructureUrl = signal(productStructureLink); // Assign the signal directly
    });

    test('should call openLink method', () => {
      component.openLink();

      expect(window.open).toHaveBeenCalledWith(
        productStructureLink,
        '_blank',
        'noopener'
      );
    });
  });

  describe('showAssignButton', () => {
    test('should return true', () => {
      expect(component.showAssignButton()).toBe(true);
    });

    test('should return false if status is confirmed', () => {
      rfq4ProcessData.set({
        ...CALCULATOR_RFQ_4_PROCESS_DATA_MOCK,
        calculatorRequestRecalculationStatus: RecalculateSqvStatus.CONFIRMED,
      });

      expect(component.showAssignButton()).toBe(false);
    });

    test('should return false if status is cancelled', () => {
      rfq4ProcessData.set({
        ...CALCULATOR_RFQ_4_PROCESS_DATA_MOCK,
        calculatorRequestRecalculationStatus: RecalculateSqvStatus.CANCELLED,
      });

      expect(component.showAssignButton()).toBe(false);
    });

    test('should return false on same id', () => {
      rfq4ProcessData.set({
        ...CALCULATOR_RFQ_4_PROCESS_DATA_MOCK,
        assignedUserId: AUTH_STATE_MOCK.accountInfo.username,
      });

      expect(component.showAssignButton()).toBe(false);
    });
  });
});
