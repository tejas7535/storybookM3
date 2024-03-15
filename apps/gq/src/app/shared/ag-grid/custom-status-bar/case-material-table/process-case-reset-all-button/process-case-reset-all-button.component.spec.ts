import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

import { ProcessCaseActions } from '@gq/core/store/process-case';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { SharedTranslocoModule } from '@schaeffler/transloco';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ProcessCaseResetAllButtonComponent } from './process-case-reset-all-button.component';

describe('ResetAllButtonComponent', () => {
  let component: ProcessCaseResetAllButtonComponent;
  let spectator: Spectator<ProcessCaseResetAllButtonComponent>;
  let mockStore: MockStore;

  const createComponent = createComponentFactory({
    component: ProcessCaseResetAllButtonComponent,
    declarations: [ProcessCaseResetAllButtonComponent],
    imports: [
      CommonModule,
      SharedTranslocoModule,
      MatButtonModule,
      MatIconModule,
      PushPipe,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      provideMockStore({}),
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    mockStore = spectator.inject(MockStore);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('resetAll', () => {
    test('should dispatch action', () => {
      mockStore.dispatch = jest.fn();
      component.resetAll();
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        ProcessCaseActions.clearRowData()
      );
    });
  });
});
