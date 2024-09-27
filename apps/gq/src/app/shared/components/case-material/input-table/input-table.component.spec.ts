import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import {
  CreateCaseActionCellComponent,
  CreateCaseActionHeaderComponent,
  ProcessCaseActionCellComponent,
  ProcessCaseActionHeaderComponent,
} from '@gq/shared/ag-grid/cell-renderer';
import { AddMaterialButtonComponent } from '@gq/shared/ag-grid/custom-status-bar/case-material-table/add-material-button/add-material-button.component';
import { CreateCaseButtonComponent } from '@gq/shared/ag-grid/custom-status-bar/case-material-table/create-case-button/create-case-button.component';
import { CreateCaseResetAllButtonComponent } from '@gq/shared/ag-grid/custom-status-bar/case-material-table/create-case-reset-all-button/create-case-reset-all-button.component';
import { ProcessCaseResetAllButtonComponent } from '@gq/shared/ag-grid/custom-status-bar/case-material-table/process-case-reset-all-button/process-case-reset-all-button.component';
import { RemoveAllFilteredButtonComponent } from '@gq/shared/ag-grid/custom-status-bar/case-material-table/remove-all-filtered-button/remove-all-filtered-button.component';
import { MaterialValidationStatusComponent } from '@gq/shared/ag-grid/custom-status-bar/material-validation-status/material-validation-status.component';
import { PasteButtonComponent } from '@gq/shared/ag-grid/custom-status-bar/paste-button/paste-button.component';
import { LocalizationService } from '@gq/shared/ag-grid/services/localization.service';
import { StatusBarConfig } from '@gq/shared/models/table';
import { FeatureToggleConfigService } from '@gq/shared/services/feature-toggle/feature-toggle-config.service';
import { PasteMaterialsService } from '@gq/shared/services/paste-materials/paste-materials.service';
import { translate } from '@jsverse/transloco';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { ColDef } from 'ag-grid-community';
import { MockComponent, MockProvider } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { BASE_STATUS_BAR_CONFIG } from './config';
import { InputTableColumnDefService } from './config/input-table-column-defs.service';
import { InputTableComponent } from './input-table.component';

describe('InputTableComponent', () => {
  let component: InputTableComponent;
  let spectator: Spectator<InputTableComponent>;

  const BASE_COLUMN_DEFS = [
    {
      headerName: translate('shared.caseMaterial.table.materialDescription'),
      field: 'materialDescription',
      flex: 0.3,
      sortable: true,
    },
    {
      headerName: translate('shared.caseMaterial.table.materialNumber'),
      field: 'materialNumber',
      flex: 0.3,
      sortable: true,
    },
    {
      headerName: translate('shared.caseMaterial.table.quantity'),
      field: 'quantity',
      flex: 0.2,
      sortable: true,
    },
    {
      headerName: translate('shared.caseMaterial.table.info.title'),
      field: 'info',
      cellRenderer: 'infoCellComponent',
      flex: 0.1,
      sortable: true,
    },
  ];

  const createComponent = createComponentFactory({
    component: InputTableComponent,
    imports: [
      PushPipe,
      provideTranslocoTestingModule({ en: {} }),
      MockComponent(AddMaterialButtonComponent),
      MockComponent(CreateCaseButtonComponent),
      MockComponent(CreateCaseResetAllButtonComponent),
      MockComponent(ProcessCaseResetAllButtonComponent),
      MockComponent(RemoveAllFilteredButtonComponent),
      MockComponent(PasteButtonComponent),
      MockComponent(MaterialValidationStatusComponent),
    ],

    providers: [
      MockProvider(PasteMaterialsService),
      provideMockStore({
        initialState: {
          processCase: {
            addMaterials: {
              addMaterialRowData: [],
            },
          },
          activeCase: {},
        },
      }),
      {
        provide: MatDialogRef,
        useValue: {},
      },
      MockProvider(InputTableColumnDefService, {
        BASE_COLUMN_DEFS: [],
      }),
      MockProvider(LocalizationService),
      MockProvider(FeatureToggleConfigService, {
        isEnabled: jest.fn(() => false),
      }),
    ],
    detectChanges: false,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });
  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initStatusBar', () => {
    test('should return StatusBarConfig for createCase', () => {
      const result = component.initStatusBar(
        true,
        false,
        BASE_STATUS_BAR_CONFIG
      );

      const expected: StatusBarConfig = {
        statusPanels: [
          ...BASE_STATUS_BAR_CONFIG.statusPanels,
          {
            statusPanel: CreateCaseButtonComponent,
            align: 'left',
          },
          {
            statusPanel: PasteButtonComponent,
            align: 'left',
            statusPanelParams: {
              isCaseView: true,
              isNewCaseCreationView: false,
            },
          },
          {
            statusPanel: RemoveAllFilteredButtonComponent,
            align: 'right',
            statusPanelParams: {
              isCaseView: true,
            },
          },
          {
            statusPanel: CreateCaseResetAllButtonComponent,
            align: 'right',
          },
        ],
      };
      expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
    });
    test('should return StatusBarConfig for newCreateCase', () => {
      const result = component.initStatusBar(
        true,
        true,
        BASE_STATUS_BAR_CONFIG
      );

      const expected: StatusBarConfig = {
        statusPanels: [
          ...BASE_STATUS_BAR_CONFIG.statusPanels,
          {
            statusPanel: PasteButtonComponent,
            align: 'left',
            statusPanelParams: {
              isCaseView: true,
              isNewCaseCreationView: true,
            },
          },
          {
            statusPanel: RemoveAllFilteredButtonComponent,
            align: 'right',
            statusPanelParams: {
              isCaseView: true,
            },
          },
          {
            statusPanel: CreateCaseResetAllButtonComponent,
            align: 'right',
          },
        ],
      };
      expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
    });
    test('should return StatusBarConfig for processCase', () => {
      const result = component.initStatusBar(
        false,
        false,
        BASE_STATUS_BAR_CONFIG
      );

      const expected: StatusBarConfig = {
        statusPanels: [
          ...BASE_STATUS_BAR_CONFIG.statusPanels,
          {
            statusPanel: AddMaterialButtonComponent,
            align: 'left',
          },
          {
            statusPanel: PasteButtonComponent,
            align: 'left',
            statusPanelParams: {
              isCaseView: false,
              isNewCaseCreationView: false,
            },
          },
          {
            statusPanel: RemoveAllFilteredButtonComponent,
            align: 'right',
            statusPanelParams: {
              isCaseView: false,
            },
          },
          {
            statusPanel: ProcessCaseResetAllButtonComponent,
            align: 'right',
          },
        ],
      };
      expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
    });
  });

  describe('initColDef', () => {
    test('should return ColDef for createCase', () => {
      const result = component.initColDef(true, BASE_COLUMN_DEFS);

      const expected: ColDef[] = [
        ...BASE_COLUMN_DEFS,
        {
          cellRenderer: CreateCaseActionCellComponent,
          flex: 0.2,
          filter: false,
          floatingFilter: false,
          headerComponent: CreateCaseActionHeaderComponent,
        },
      ];

      expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
    });
    test('should return ColDef for processCase', () => {
      const result = component.initColDef(false, BASE_COLUMN_DEFS);

      const expected: ColDef[] = [
        ...BASE_COLUMN_DEFS,
        {
          cellRenderer: ProcessCaseActionCellComponent,
          flex: 0.2,
          filter: false,
          floatingFilter: false,
          headerComponent: ProcessCaseActionHeaderComponent,
        },
      ];

      expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
    });
  });
});
