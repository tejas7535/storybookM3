import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { EditingModalService } from '@gq/shared/components/modal/editing-modal/editing-modal.service';
import { HideIfQuotationNotActiveDirective } from '@gq/shared/directives/hide-if-quotation-not-active/hide-if-quotation-not-active.directive';
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
    declarations: [MockDirective(HideIfQuotationNotActiveDirective)],
    providers: [
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
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
  describe('openEditing', () => {
    test('should open dialog for editing', () => {
      component.openEditing();
      expect(editingModalServiceSpy.openEditingModal).toHaveBeenCalledTimes(1);
    });
  });
});
