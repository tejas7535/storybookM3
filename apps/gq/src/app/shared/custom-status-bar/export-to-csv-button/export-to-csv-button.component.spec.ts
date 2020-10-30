import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';
import { ExportToCsvButtonComponent } from './export-to-csv-button.component';

describe('ExportToCsvButtonComponent', () => {
  let component: ExportToCsvButtonComponent;
  let spectator: Spectator<ExportToCsvButtonComponent>;

  const createComponent = createComponentFactory({
    component: ExportToCsvButtonComponent,
    declarations: [ExportToCsvButtonComponent],
    imports: [
      MatButtonModule,
      MatIconModule,
      provideTranslocoTestingModule({}),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('exportToCSV', () => {
    test('should export to CSV', () => {
      jest.spyOn(window, 'alert').mockImplementation(() => {});

      component.exportToCSV();
      expect(window.alert).toHaveBeenCalled();
    });
  });
});
