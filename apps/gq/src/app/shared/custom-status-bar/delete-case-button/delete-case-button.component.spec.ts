import { MatButtonModule } from '@angular/material/button';

import { IStatusPanelParams } from '@ag-grid-community/all-modules';
import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { DeleteCaseButtonComponent } from './delete-case-button.component';

describe('DeleteCaseButtonComponent', () => {
  let component: DeleteCaseButtonComponent;
  let spectator: Spectator<DeleteCaseButtonComponent>;
  let params: IStatusPanelParams;

  const createComponent = createComponentFactory({
    component: DeleteCaseButtonComponent,
    imports: [MatButtonModule, provideTranslocoTestingModule({})],
    declarations: [DeleteCaseButtonComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    params = ({
      api: {
        addEventListener: jest.fn(),
        getSelectedRows: jest.fn(),
      },
    } as unknown) as IStatusPanelParams;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('agInit', () => {
    test('should set params and add listeners', () => {
      component.agInit((params as unknown) as IStatusPanelParams);

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
});
