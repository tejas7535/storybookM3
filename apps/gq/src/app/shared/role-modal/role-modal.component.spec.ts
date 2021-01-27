import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { ReactiveComponentModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import {
  provideTranslocoTestingModule,
  SharedTranslocoModule,
} from '@schaeffler/transloco';

import { RoleDescModule } from './role-desc/role-desc.module';
import { RoleModalComponent } from './role-modal.component';

describe('RoleModalComponent', () => {
  let component: RoleModalComponent;
  let spectator: Spectator<RoleModalComponent>;

  const createComponent = createComponentFactory({
    component: RoleModalComponent,
    declarations: [RoleModalComponent],
    imports: [
      FlexLayoutModule,
      MatDialogModule,
      SharedTranslocoModule,
      MatIconModule,
      ReactiveComponentModule,
      provideTranslocoTestingModule({}),
      RoleDescModule,
    ],
    providers: [
      provideMockStore({
        initialState: {
          auth: {
            token: {},
          },
        },
      }),
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

  describe('closeDialog', () => {
    test('should close dialog', () => {
      component['dialogRef'].close = jest.fn();

      component.closeDialog();
      expect(component['dialogRef'].close).toHaveBeenCalled();
    });
  });
  describe('trackByFn', () => {
    test('should return index', () => {
      const result = component.trackByFn(3);

      expect(result).toEqual(3);
    });
  });
});
