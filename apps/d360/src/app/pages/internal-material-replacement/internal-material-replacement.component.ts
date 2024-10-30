import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { PushPipe } from '@ngrx/component';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { IMRSubstitution } from '../../feature/internal-material-replacement/model';
import { ActionButtonComponent } from '../../shared/components/action-button/action-button.component';
import {
  HeaderActionBarComponent,
  ProjectedContendDirective,
} from '../../shared/components/header-action-bar/header-action-bar.component';
import { SelectableValue } from '../../shared/components/inputs/autocomplete/selectable-values.utils';
import { FilterDropdownComponent } from '../../shared/components/inputs/filter-dropdown/filter-dropdown.component';
import { StyledSectionComponent } from '../../shared/components/styled-section/styled-section.component';
import { SelectableOptionsService } from '../../shared/services/selectable-options.service';
import { InternalMaterialReplacementSingleSubstitutionModalComponent } from './components/modals/internal-material-replacement-single-substitution-modal/internal-material-replacement-single-substitution-modal.component';
import { InternalMaterialReplacementTableComponent } from './table/internal-material-replacement-table/internal-material-replacement-table.component';

@Component({
  selector: 'app-internal-material-replacement',
  standalone: true,
  imports: [
    CommonModule,
    SharedTranslocoModule,
    StyledSectionComponent,
    HeaderActionBarComponent,
    ActionButtonComponent,
    ProjectedContendDirective,
    FilterDropdownComponent,
    LoadingSpinnerModule,
    PushPipe,
    InternalMaterialReplacementTableComponent,
  ],
  templateUrl: './internal-material-replacement.component.html',
  styleUrl: './internal-material-replacement.component.scss',
})
export class InternalMaterialReplacementComponent implements OnInit {
  @ViewChild('internalMaterialReplacementTableComponent')
  protected table: InternalMaterialReplacementTableComponent;

  protected loading$;
  protected selectedRegion: string;

  // TODO check validators, not all fields are required
  protected regionControl = new FormControl<SelectableValue>(
    { id: '', text: '' },
    Validators.required
  );

  protected formGroup = new FormGroup({
    region: this.regionControl,
  });

  // Grid lives here to manage updates
  // TODO check if this is necessary
  // const [grid, setGrid] = useState<GridApis | undefined>();

  constructor(
    protected readonly selectableOptionsService: SelectableOptionsService,
    private readonly dialog: MatDialog
  ) {
    this.loading$ = this.selectableOptionsService.loading$;
    // console.log("Test " + this.selectableOptionsService.get('region')?.options);
  }

  ngOnInit(): void {
    this.loading$.subscribe((loading) => {
      if (!loading) {
        this.regionControl.setValue(
          this.selectableOptionsService.get('region').options[0]
        );
      }
    });
    this.regionControl.valueChanges.subscribe((option) => {
      if (option) {
        this.selectedRegion = option.id;
        this.table?.setServerSideDatasource(this.selectedRegion);
      }
    });
  }

  handleCreateSingleIMR() {
    this.dialog.open(
      InternalMaterialReplacementSingleSubstitutionModalComponent,
      {
        data: {
          substitution: this.newIMRSubstitution(this.regionControl.value.id),
          isNewSubstitution: true,
          gridApi: this.table.gridApi,
        },
        disableClose: true,
      }
    );
  }

  handleCreateMultiIMR() {
    // TODO implement
  }

  private newIMRSubstitution(region: string): IMRSubstitution {
    return {
      region,
      replacementType: null,
      salesArea: null,
      salesOrg: null,
      customerNumber: null,
      predecessorMaterial: null,
      successorMaterial: null,
      replacementDate: null,
      cutoverDate: null,
      startOfProduction: null,
      note: null,
    };
  }
}
