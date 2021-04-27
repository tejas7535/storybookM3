import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import {
  provideTranslocoTestingModule,
  SharedTranslocoModule,
} from '@schaeffler/transloco';

import { AddMaterialButtonComponent } from './add-material-button.component';

describe('CreateCaseButtonComponent', () => {
  let component: AddMaterialButtonComponent;
  let spectator: Spectator<AddMaterialButtonComponent>;

  const createComponent = createComponentFactory({
    component: AddMaterialButtonComponent,
    declarations: [AddMaterialButtonComponent],
    imports: [
      CommonModule,
      SharedTranslocoModule,
      MatButtonModule,
      provideTranslocoTestingModule({ en: {} }),
      ReactiveComponentModule,
    ],
    providers: [
      provideMockStore({}),
      {
        provide: MatDialogRef,
        useValue: {},
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
});
