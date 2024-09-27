import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { activeCaseFeature } from '@gq/core/store/active-case/active-case.reducer';
import { getIsQuotationStatusActive } from '@gq/core/store/active-case/active-case.selectors';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { LetDirective, PushPipe } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { QUOTATION_MOCK } from '../../../../../testing/mocks';
import { QuotationNoteModalComponent } from '../modal/quotation-note-modal.component';
import { QuotationNoteIconComponent } from './quotation-note-icon.component';

describe('QuotationNoteIconComponent', () => {
  let component: QuotationNoteIconComponent;
  let spectator: Spectator<QuotationNoteIconComponent>;
  let store: MockStore;
  let dialog: MatDialog;

  const createComponent = createComponentFactory({
    component: QuotationNoteIconComponent,
    imports: [CommonModule, MatIconModule, PushPipe, LetDirective],
    providers: [provideMockStore()],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = spectator.inject(MockStore);
    dialog = spectator.inject(MatDialog);
    store.overrideSelector(activeCaseFeature.selectQuotation, QUOTATION_MOCK);
    store.overrideSelector(getIsQuotationStatusActive, true);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('observables', () => {
    test(
      'should be set correctly',
      marbles((m) => {
        m.expect(component.quotation$).toBeObservable(
          m.cold('a', { a: QUOTATION_MOCK })
        );
        m.expect(component.quotationStatusActive$).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );
  });
  describe('openQuotationNoteModal', () => {
    it('should open the QuotationNoteModalComponent', () => {
      const quotationMetadata = {
        note: 'Test note',
      };
      const isQuotationStatusActive = true;

      const openMock = jest.fn();
      dialog.open = openMock;

      component.openQuotationNoteModal(
        quotationMetadata,
        isQuotationStatusActive
      );

      expect(openMock).toHaveBeenCalledWith(QuotationNoteModalComponent, {
        width: '491px',
        height: '300px',
        data: {
          quotationMetadata,
          isQuotationStatusActive,
        },
      });
    });
  });
});
