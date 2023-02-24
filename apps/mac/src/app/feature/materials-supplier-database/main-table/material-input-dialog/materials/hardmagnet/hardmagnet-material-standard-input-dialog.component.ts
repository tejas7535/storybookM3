import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { BehaviorSubject, filter, take } from 'rxjs';

import { translate } from '@ngneat/transloco';

import { StringOption } from '@schaeffler/inputs';

import {
  materialstandardDialogConfirmed,
  materialstandardDialogOpened,
  resetMaterialRecord,
} from '@mac/feature/materials-supplier-database/store/actions/dialog';
import { DataFacade } from '@mac/feature/materials-supplier-database/store/facades/data';
import { MaterialInputDialogComponent } from '@mac/msd/main-table/material-input-dialog/material-input-dialog.component';
import { DialogControlsService } from '@mac/msd/main-table/material-input-dialog/services';
import {
  DataResult,
  MaterialFormValue,
  MaterialStandard,
  MaterialStandardForm,
  MaterialStandardFormValue,
} from '@mac/msd/models';
import { DialogFacade } from '@mac/msd/store/facades/dialog';

@Component({
  selector: 'mac-hardmagnet-material-standard-input-dialog',
  templateUrl: './hardmagnet-material-standard-input-dialog.component.html',
})
export class HardmagnetMaterialStandardInputDialogComponent
  extends MaterialInputDialogComponent
  implements OnInit, AfterViewInit
{
  public materialNamesEditControl =
    this.controlsService.getRequiredControl<string>();

  public constructor(
    readonly controlsService: DialogControlsService,
    readonly dialogFacade: DialogFacade,
    readonly dataFacade: DataFacade,
    readonly dialogRef: MatDialogRef<MaterialInputDialogComponent>,
    readonly snackbar: MatSnackBar,
    readonly cdRef: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA)
    readonly dialogData: {
      editDialogInformation?: { row: DataResult; column: string };
      isResumeDialog: boolean;
    }
  ) {
    super(
      controlsService,
      dialogFacade,
      dataFacade,
      dialogRef,
      snackbar,
      cdRef,
      dialogData
    );
    this.editLoading$ = new BehaviorSubject(!!dialogData.editDialogInformation);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.createMaterialForm = new FormGroup<MaterialStandardForm>({
      id: this.materialStandardIdControl,
      materialName: this.materialNamesControl,
      standardDocument: this.standardDocumentsControl,
    });
  }

  public ngAfterViewInit(): void {
    super.ngAfterViewInit();

    // as only materialname is available, generate a stdDoc name and set the ID on updates
    this.materialNamesEditControl.valueChanges.subscribe((val) => {
      const id = this.materialStandardIdControl.value;
      const title: string = val ? `stdDoc for ${val}` : undefined;
      const stdDoc: StringOption = val ? { id, title } : undefined;
      const matName: StringOption = val ? { id, title: val } : undefined;

      this.standardDocumentsControl.setValue(stdDoc);
      this.materialNamesControl.setValue(matName);
    });
  }

  public dispatchDialogOpenEvent(): void {
    this.dialogFacade.dispatch(materialstandardDialogOpened());
  }

  patchFields(materialFormValue: Partial<MaterialFormValue>): void {
    const formValue: Partial<MaterialStandardFormValue> = {
      ...materialFormValue,
      id: this.materialId,
    };

    this.createMaterialForm.patchValue(formValue);
    this.materialNamesEditControl.setValue(
      materialFormValue.materialName?.title,
      { emitEvent: false }
    );
  }

  enableEditFields(): void {}

  public getTitle(): string {
    return this.isEditDialog() && !this.isCopyDialog()
      ? translate(
          'materialsSupplierDatabase.mainTable.dialog.updateMaterialStandardTitle',
          {
            class: translate(
              `materialsSupplierDatabase.materialClassValues.${this.materialClass}`
            ),
          }
        )
      : translate(
          'materialsSupplierDatabase.mainTable.dialog.addMaterialStandardTitle',
          {
            class: translate(
              `materialsSupplierDatabase.materialClassValues.${this.materialClass}`
            ),
          }
        );
  }

  protected buildMaterialStandard(
    baseMaterial: MaterialStandardFormValue
  ): MaterialStandard {
    return {
      id: baseMaterial.id,
      materialName: baseMaterial.materialName.title,
      standardDocument: baseMaterial.standardDocument.title,
    };
  }

  public confirmMaterial(createAnother: boolean): void {
    const baseMaterial = this.createMaterialForm
      .value as MaterialStandardFormValue;

    const standard: MaterialStandard = this.buildMaterialStandard(baseMaterial);

    // include stdDoc put logic in effect
    this.dialogFacade.dispatch(materialstandardDialogConfirmed({ standard }));

    this.dialogFacade.createMaterialRecord$
      .pipe(filter(Boolean), take(1))
      .subscribe((record) => {
        let msgKey;
        if (!record.error) {
          if (!createAnother) {
            this.closeDialog(true);
          }
          msgKey =
            'materialsSupplierDatabase.mainTable.dialog.createMaterialStandardSuccess';
        } else {
          msgKey = `materialsSupplierDatabase.mainTable.dialog.createFailure.${record.error.state}.${record.error.code}`;
        }
        this.showInSnackbar(
          translate(msgKey),
          translate('materialsSupplierDatabase.mainTable.dialog.close'),
          { duration: 5000 }
        );
        this.dialogFacade.dispatch(
          resetMaterialRecord({ error: !!record.error, createAnother })
        );
      });
  }
}
