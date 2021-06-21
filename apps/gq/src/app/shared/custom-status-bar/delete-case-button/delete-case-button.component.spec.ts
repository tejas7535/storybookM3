import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { of } from 'rxjs';

import { IStatusPanelParams } from '@ag-grid-community/all-modules';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { DeleteCaseButtonComponent } from './delete-case-button.component';

describe('DeleteCaseButtonComponent', () => {
  let component: DeleteCaseButtonComponent;
  let spectator: Spectator<DeleteCaseButtonComponent>;
  let params: IStatusPanelParams;

  const createComponent = createComponentFactory({
    component: DeleteCaseButtonComponent,
    imports: [
      MatButtonModule,
      provideTranslocoTestingModule({ en: {} }),
      MatDialogModule,
      MatIconModule,
    ],
    providers: [provideMockStore({})],
    declarations: [DeleteCaseButtonComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    params = {
      api: {
        addEventListener: jest.fn(),
        getSelectedRows: jest.fn(),
      },
    } as unknown as IStatusPanelParams;
    const dialogRef = {
      afterClosed: jest.fn(() => of(true)),
    };
    component.dialog = {
      open: jest.fn(() => dialogRef),
    } as any;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('agInit', () => {
    test('should set params and add listeners', () => {
      component.agInit(params as unknown as IStatusPanelParams);

      expect(component['params']).toEqual(params);

      expect(params.api.addEventListener).toHaveBeenCalledTimes(1);
    });
  });
  describe('onSelectionChange', () => {
    test('should set selections', () => {
      component['params'] = params;
      component.onSelectionChange();

      expect(params.api.getSelectedRows).toHaveBeenCalled();
    });
  });
  describe('deleteCase', () => {
    test('should open dialog', () => {
      component.selections = [{ customer: { name: '1' }, gqId: '123' }];
      component.deleteCase();

      expect(component.dialog.open).toHaveBeenCalledTimes(1);
    });
  });
});
