import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { ReactiveComponentModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { AddItemsButtonComponent } from './add-items-button.component';

describe('AddItemsButtonComponent', () => {
  let component: AddItemsButtonComponent;
  let spectator: Spectator<AddItemsButtonComponent>;

  const createComponent = createComponentFactory({
    component: AddItemsButtonComponent,
    imports: [
      ReactiveComponentModule,
      MatIconModule,
      MatDialogModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [provideMockStore({})],
  });
  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
