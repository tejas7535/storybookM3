import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

import { of } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockModule } from 'ng-mocks';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';

import { ExportDemandValidationService } from '../../services/export-demand-validation.service';
import { DemandValidationExportLoadingModalComponent } from './demand-validation-export-loading-modal.component';

describe('DemandValidationExportLoadingModalComponent', () => {
  let spectator: Spectator<DemandValidationExportLoadingModalComponent>;

  const createComponent = createComponentFactory({
    component: DemandValidationExportLoadingModalComponent,
    imports: [MockModule(LoadingSpinnerModule)],
    providers: [
      {
        provide: MAT_DIALOG_DATA,
        useValue: {
          selectedKpis: {},
          filledRange: {},
          demandValidationFilters: {},
        },
      },
      {
        provide: MatDialog,
        useValue: {
          close: jest.fn(),
        },
      },
      {
        provide: ExportDemandValidationService,
        useValue: {
          triggerExport: jest.fn().mockReturnValue(of(null)),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
