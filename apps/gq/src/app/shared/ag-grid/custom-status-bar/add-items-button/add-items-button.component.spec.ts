import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ApprovalFacade } from '@gq/core/store/approval/approval.facade';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { MockProvider } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { PROCESS_CASE_STATE_MOCK } from '../../../../../testing/mocks';
import { AddItemsButtonComponent } from './add-items-button.component';

describe('AddItemsButtonComponent', () => {
  let component: AddItemsButtonComponent;
  let spectator: Spectator<AddItemsButtonComponent>;

  const createComponent = createComponentFactory({
    component: AddItemsButtonComponent,
    imports: [
      PushModule,
      MatIconModule,
      MatDialogModule,
      MatTooltipModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      MockProvider(ApprovalFacade),
      provideMockStore({
        initialState: {
          processCase: PROCESS_CASE_STATE_MOCK,
        },
      }),
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
    ],
  });
  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
