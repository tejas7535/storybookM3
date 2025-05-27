import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { of } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockComponent, MockModule, MockProvider } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { EditCaseHeaderInformationComponent } from '../../case-header-information/edit-case-header-information/edit-case-header-information.component';
import { DialogHeaderModule } from '../../header/dialog-header/dialog-header.module';
import { EditCaseModalComponent } from './edit-case-modal.component';
describe('EditCaseModalComponent', () => {
  let component: EditCaseModalComponent;
  let spectator: Spectator<EditCaseModalComponent>;

  const createComponent = createComponentFactory({
    component: EditCaseModalComponent,
    imports: [
      MockModule(DialogHeaderModule),
      MockComponent(EditCaseHeaderInformationComponent),
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      MockProvider(MatDialogRef, {
        beforeClosed: jest.fn().mockReturnValue(of([])),
        close: jest.fn(),
      } as unknown as MatDialogRef<EditCaseModalComponent>),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });
  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should close the dialog', () => {
    const dialogRef = spectator.inject(MatDialogRef);
    const closeSpy = jest.spyOn(dialogRef, 'close');

    component.closeDialog();

    expect(closeSpy).toHaveBeenCalled();
  });
});
