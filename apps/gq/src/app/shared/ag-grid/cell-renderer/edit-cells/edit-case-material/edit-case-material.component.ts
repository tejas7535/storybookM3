import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

import { CreateCaseFacade } from '@gq/core/store/create-case/create-case.facade';
import { AutoCompleteFacade } from '@gq/core/store/facades';
import { ProcessCaseFacade } from '@gq/core/store/process-case';
import { FeatureToggleConfigService } from '@gq/shared/services/feature-toggle/feature-toggle-config.service';
import { ICellRendererParams } from 'ag-grid-community';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AppRoutePath } from '../../../../../app-route-path.enum';
import { AutocompleteRequestDialog } from '../../../../components/autocomplete-input/autocomplete-request-dialog.enum';
import { EditingMaterialModalComponent } from '../../../../components/modal/editing-material-modal/editing-material-modal.component';
import { MaterialTableItem } from '../../../../models/table';

@Component({
  selector: 'gq-edit-case-material',
  standalone: true,
  imports: [
    MatIconModule,
    EditingMaterialModalComponent,
    SharedTranslocoModule,
  ],
  templateUrl: './edit-case-material.component.html',
})
export class EditCaseMaterialComponent {
  public params: ICellRendererParams;
  public cellValue: string;
  public isCaseView: boolean;
  private readonly dialog: MatDialog = inject(MatDialog);
  // private readonly store: Store = inject(Store);
  private readonly router: Router = inject(Router);
  private readonly autoCompleteFacade: AutoCompleteFacade =
    inject(AutoCompleteFacade);
  private readonly createCaseFacade: CreateCaseFacade =
    inject(CreateCaseFacade);
  private readonly processCaseFacade: ProcessCaseFacade =
    inject(ProcessCaseFacade);
  private readonly featureToggleConfigService: FeatureToggleConfigService =
    inject(FeatureToggleConfigService);
  newCaseCreation: boolean = this.featureToggleConfigService.isEnabled(
    'createManualCaseAsView'
  );

  agInit(params: ICellRendererParams): void {
    this.isCaseView =
      this.router.url === `/${AppRoutePath.CaseViewPath}` ||
      this.router.url === `/${AppRoutePath.CreateManualCasePath}`;
    this.params = params;

    this.cellValue = this.getValueToDisplay(params);
  }

  refresh(params: ICellRendererParams): boolean {
    this.cellValue = this.getValueToDisplay(params);

    return true;
  }

  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ?? params.value;
  }

  onIconClick(): void {
    const previousData = this.params.data;
    this.dialog
      .open(EditingMaterialModalComponent, {
        width: '660px',
        data: {
          material: this.params.data,
          field: this.params.colDef.field,
        },
        autoFocus: false,
      })
      .afterClosed()
      .subscribe((result: MaterialTableItem) => {
        if (result) {
          this.checkValidationNeeded(result, previousData);
        }

        this.autoCompleteFacade.resetAutocompleteMaterials();
        if (this.newCaseCreation && this.isCaseView) {
          this.autoCompleteFacade.initFacade(
            AutocompleteRequestDialog.CREATE_CASE
          );
        } else {
          this.autoCompleteFacade.initFacade(
            AutocompleteRequestDialog.ADD_ENTRY
          );
        }
      });
  }

  checkValidationNeeded(
    recentData: MaterialTableItem,
    previousData: MaterialTableItem
  ): void {
    const validationNeeded =
      recentData.materialDescription !== previousData.materialDescription ||
      recentData.materialNumber !== previousData.materialNumber;

    return validationNeeded
      ? this.dispatchUpdateActionAndValidationAction(recentData)
      : this.dispatchUpdateAction(recentData);
  }

  dispatchUpdateAction(
    recentData: MaterialTableItem,
    revalidate: boolean = false
  ): void {
    return this.isCaseView
      ? this.createCaseFacade.updateRowDataItem(recentData, revalidate)
      : this.processCaseFacade.updateItemFromMaterialTable(
          recentData,
          revalidate
        );
  }

  dispatchUpdateActionAndValidationAction(recentData: MaterialTableItem): void {
    this.dispatchUpdateAction(recentData, true);

    return this.isCaseView
      ? this.createCaseFacade.validateMaterialsOnCustomerAndSalesOrg()
      : this.processCaseFacade.validateMaterialTableItems();
  }
}
