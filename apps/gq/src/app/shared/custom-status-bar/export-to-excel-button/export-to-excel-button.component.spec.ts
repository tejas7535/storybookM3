import { IStatusPanelParams } from '@ag-grid-community/all-modules';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';
import { ExportToExcelButtonComponent } from './export-to-excel-button.component';

describe('ExportToExcelButtonComponent', () => {
  let component: ExportToExcelButtonComponent;
  let spectator: Spectator<ExportToExcelButtonComponent>;
  let params: IStatusPanelParams;

  const createComponent = createComponentFactory({
    component: ExportToExcelButtonComponent,
    declarations: [ExportToExcelButtonComponent],
    imports: [
      MatButtonModule,
      MatIconModule,
      provideTranslocoTestingModule({}),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    params = ({
      api: {
        exportDataAsExcel: jest.fn(),
      },
    } as unknown) as IStatusPanelParams;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('exportToExcel', () => {
    test('should export to Excel', () => {
      component['params'] = params;
      component.exportToExcel();

      expect(params.api.exportDataAsExcel).toHaveBeenCalled();
    });
  });
});
