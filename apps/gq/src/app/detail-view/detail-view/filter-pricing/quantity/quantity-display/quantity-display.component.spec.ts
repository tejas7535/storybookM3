import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { EditingModalService } from '@gq/shared/components/modal/editing-modal/editing-modal.service';
import { HideIfQuotationNotActiveOrPendingDirective } from '@gq/shared/directives/hide-if-quotation-not-active-or-pending/hide-if-quotation-not-active-or-pending.directive';
import * as rfq4Utils from '@gq/shared/utils/rfq-4-utils';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
  SpyObject,
} from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { MockDirective } from 'ng-mocks';

import { QuantityDisplayComponent } from './quantity-display.component';

describe('QuantityDisplayComponent', () => {
  let component: QuantityDisplayComponent;
  let spectator: Spectator<QuantityDisplayComponent>;
  let editingModalServiceSpy: SpyObject<EditingModalService>;

  const createComponent = createComponentFactory({
    component: QuantityDisplayComponent,
    imports: [MatIconModule, MatDialogModule, PushPipe],
    declarations: [MockDirective(HideIfQuotationNotActiveOrPendingDirective)],
    providers: [
      provideMockStore({
        initialState: {
          processCase: {
            quotation: {},
          },
        },
      }),
      mockProvider(EditingModalService),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    editingModalServiceSpy = spectator.inject(EditingModalService);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('isRfq4ProcessOngoing', () => {
    test('should return true when isRfq4ProcessOngoingForQuotationDetail returns true', () => {
      const mockQuotationDetail = { id: 1 } as any;
      spectator.setInput('quotationDetail', mockQuotationDetail);
      jest
        .spyOn(rfq4Utils, 'isRfq4ProcessOngoingForQuotationDetail')
        .mockReturnValue(true);

      const result = component.isRfq4ProcessOngoing();

      expect(
        rfq4Utils.isRfq4ProcessOngoingForQuotationDetail
      ).toHaveBeenCalledWith(mockQuotationDetail);
      expect(result).toBe(true);
    });

    test('should return false when isRfq4ProcessOngoingForQuotationDetail returns false', () => {
      const mockQuotationDetail = { id: 2 } as any;
      spectator.setInput('quotationDetail', mockQuotationDetail);
      jest
        .spyOn(rfq4Utils, 'isRfq4ProcessOngoingForQuotationDetail')
        .mockReturnValue(false);

      const result = component.isRfq4ProcessOngoing();

      expect(
        rfq4Utils.isRfq4ProcessOngoingForQuotationDetail
      ).toHaveBeenCalledWith(mockQuotationDetail);
      expect(result).toBe(false);
    });
  });
  describe('openEditing', () => {
    test('should open dialog for editing', () => {
      jest
        .spyOn(rfq4Utils, 'isRfq4ProcessOngoingForQuotationDetail')
        .mockReturnValue(false);
      component.openEditing();
      expect(editingModalServiceSpy.openEditingModal).toHaveBeenCalledTimes(1);
    });
    test('should not open the dialog if isRfq4ProcessOngoing is true', () => {
      jest
        .spyOn(rfq4Utils, 'isRfq4ProcessOngoingForQuotationDetail')
        .mockReturnValue(true);
      component.openEditing();
      expect(editingModalServiceSpy.openEditingModal).not.toHaveBeenCalled();
    });
  });
});
