import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { take, tap } from 'rxjs';

import { PushPipe } from '@ngrx/component';
import { GridApi } from 'ag-grid-community';

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
import { InternalMaterialReplacementMultiSubstitutionModalComponent } from './components/modals/internal-material-replacement-multi-substitution-modal/internal-material-replacement-multi-substitution-modal.component';
import { InternalMaterialReplacementSingleSubstitutionModalComponent } from './components/modals/internal-material-replacement-single-substitution-modal/internal-material-replacement-single-substitution-modal.component';
import { InternalMaterialReplacementTableComponent } from './table/internal-material-replacement-table/internal-material-replacement-table.component';

@Component({
  selector: 'd360-internal-material-replacement',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
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
  private gridApi: GridApi | null = null;

  protected loading$;
  protected selectedRegion = signal<string>(null);

  protected regionControl = new FormControl<SelectableValue>(
    { id: '', text: '' },
    Validators.required
  );

  protected formGroup = new FormGroup({
    region: this.regionControl,
  });

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    protected readonly selectableOptionsService: SelectableOptionsService,
    private readonly dialog: MatDialog
  ) {
    this.loading$ = this.selectableOptionsService.loading$;
  }

  ngOnInit(): void {
    this.loading$.subscribe((loading) => {
      if (!loading) {
        this.regionControl.setValue(
          this.selectableOptionsService.get('region').options[0]
        );
      }
    });
  }

  protected getApi(api: GridApi): void {
    this.gridApi = api;
  }

  updateRegion(event: Partial<SelectableValue>) {
    if (event) {
      this.selectedRegion.set(event.id);
    }
  }

  handleCreateSingleIMR() {
    this.dialog
      .open(InternalMaterialReplacementSingleSubstitutionModalComponent, {
        data: {
          substitution: this.newIMRSubstitution(this.regionControl.value.id),
          isNewSubstitution: true,
          gridApi: this.gridApi,
        },
        panelClass: ['form-dialog', 'internal-material-replacement'],
        autoFocus: false,
        disableClose: true,
      })
      .afterClosed()
      .pipe(
        take(1),
        tap(({ reloadData }) => {
          if (reloadData) {
            this.gridApi.refreshServerSide({ purge: true });
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  handleCreateMultiIMR() {
    this.dialog
      .open(InternalMaterialReplacementMultiSubstitutionModalComponent, {
        disableClose: true,
        panelClass: ['table-dialog', 'internal-material-replacement'],
        autoFocus: false,
        maxHeight: 'calc(100% - 64px)',
        maxWidth: 'none',
        width: 'calc(100% - 64px)',
      })
      .afterClosed()
      .pipe(
        take(1),
        tap((reloadData: boolean) => {
          if (reloadData) {
            this.gridApi.refreshServerSide({ purge: true });
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
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
