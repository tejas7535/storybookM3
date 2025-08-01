import { signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { TagType } from '@gq/shared/models';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { Breadcrumb } from '@schaeffler/breadcrumbs';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { RFQ_DETAIL_VIEW_DATA_MOCK } from '../../../../../testing/mocks/models/calculator/rfq-4-detail-view/rfq-4-detail-view-data.mock';
import { RecalculateSqvStatus } from '../../models/recalculate-sqv-status.enum';
import { Rfq4DetailViewStore } from '../../store/rfq-4-detail-view.store';
import { Rfq4DetailViewHeaderComponent } from './rfq-4-detail-view-header.component';

describe('HeaderComponent', () => {
  let component: Rfq4DetailViewHeaderComponent;
  let spectator: Spectator<Rfq4DetailViewHeaderComponent>;
  const rfq4DetailViewData = signal(RFQ_DETAIL_VIEW_DATA_MOCK);
  const recalculateStatus = signal(
    RFQ_DETAIL_VIEW_DATA_MOCK.rfq4ProcessData
      .calculatorRequestRecalculationStatus
  );
  const isLoggedUserAssignedToRfq = signal(false);
  const isCalculationDataInvalid = signal(false);

  const createComponent = createComponentFactory({
    component: Rfq4DetailViewHeaderComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
    providers: [
      { provide: ActivatedRoute, useValue: {} },

      {
        provide: Rfq4DetailViewStore,
        useValue: {
          rfq4DetailViewData,
          getRecalculationStatus: recalculateStatus,
          isCalculationDataInvalid,
          triggerConfirmRecalculation: jest.fn(),
          isLoggedUserAssignedToRfq,
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('breadcrumbs', () => {
    test('should return breadcrumbs', () => {
      const breadcrumb: Breadcrumb = {
        label: 'label',
      };
      component['breadcrumbsService'].getRfqDetailViewBreadcrumbs = jest
        .fn()
        .mockReturnValue([breadcrumb]);

      rfq4DetailViewData.set({
        ...RFQ_DETAIL_VIEW_DATA_MOCK,
      });
      const result = component.breadcrumbs();

      expect(
        component['breadcrumbsService'].getRfqDetailViewBreadcrumbs
      ).toHaveBeenCalledWith(
        rfq4DetailViewData().rfq4ProcessData.rfqId.toString()
      );
      expect(result).toEqual([breadcrumb]);
    });
  });

  describe('tagType', () => {
    test('should return tag type', () => {
      const result = component.tagType();
      expect(result).toEqual(TagType.NEUTRAL);
    });
    test('should update tag type when changes', () => {
      recalculateStatus.set(RecalculateSqvStatus.IN_PROGRESS);

      const result = component.tagType();
      expect(result).toEqual(TagType.INFO);
    });
  });

  describe('getTagType', () => {
    test('should return tag type neutral', () => {
      const result = component.getTagType(RecalculateSqvStatus.OPEN);
      expect(result).toEqual(TagType.NEUTRAL);
    });
    test('should return tag type info', () => {
      const result = component.getTagType(RecalculateSqvStatus.IN_PROGRESS);
      expect(result).toEqual(TagType.INFO);
    });
    test('should return tag type warning', () => {
      const result = component.getTagType(RecalculateSqvStatus.REOPEN);
      expect(result).toEqual(TagType.WARNING);
    });

    test('should return tag type success', () => {
      const result = component.getTagType(RecalculateSqvStatus.CONFIRMED);
      expect(result).toEqual(TagType.SUCCESS);
    });
    test('should return tag type error', () => {
      const result = component.getTagType(RecalculateSqvStatus.CANCELLED);
      expect(result).toEqual(TagType.ERROR);
    });
    test('should return default tag type', () => {
      const result = component.getTagType(null);
      expect(result).toEqual(TagType.NEUTRAL);
    });
  });

  describe('onConfirm', () => {
    test('confirmRecalculation should be called', () => {
      const store = spectator.inject(Rfq4DetailViewStore);
      const confirmSpy = jest.spyOn(store, 'triggerConfirmRecalculation');
      component.onConfirm();

      expect(confirmSpy).toHaveBeenCalled();
    });
  });
  describe('isConfirmDisabled', () => {
    test('should be false when all conditions are valid', () => {
      isCalculationDataInvalid.set(false);
      recalculateStatus.set(RecalculateSqvStatus.IN_PROGRESS);
      isLoggedUserAssignedToRfq.set(true);
      expect(component.isConfirmDisabled()).toBe(false);
    });

    test('should be true when calculation data is invalid', () => {
      isCalculationDataInvalid.set(true);
      recalculateStatus.set(RecalculateSqvStatus.IN_PROGRESS);
      isLoggedUserAssignedToRfq.set(true);

      expect(component.isConfirmDisabled()).toBe(true);
    });

    test('should be true when recalculation status is not IN_PROGRESS', () => {
      isCalculationDataInvalid.set(false);
      recalculateStatus.set(RecalculateSqvStatus.OPEN);
      isLoggedUserAssignedToRfq.set(true);

      expect(component.isConfirmDisabled()).toBe(true);
    });

    test('should be true when user is not assigned to RFQ', () => {
      isCalculationDataInvalid.set(false);
      recalculateStatus.set(RecalculateSqvStatus.IN_PROGRESS);
      isLoggedUserAssignedToRfq.set(false);

      expect(component.isConfirmDisabled()).toBe(true);
    });

    test('should be true when multiple conditions are invalid', () => {
      isCalculationDataInvalid.set(true);
      recalculateStatus.set(RecalculateSqvStatus.REOPEN);
      isLoggedUserAssignedToRfq.set(false);

      expect(component.isConfirmDisabled()).toBe(true);
    });
  });
});
