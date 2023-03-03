/* eslint-disable max-lines */
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

import { BehaviorSubject, filter, Subject, take, takeUntil } from 'rxjs';

import { translate } from '@ngneat/transloco';

import { StringOption } from '@schaeffler/inputs';

import { MaterialClass, NavigationLevel } from '@mac/msd/constants';
import { DialogControlsService } from '@mac/msd/main-table/material-input-dialog/services';
import * as util from '@mac/msd/main-table/material-input-dialog/util';
import { focusSelectedElement } from '@mac/msd/main-table/material-input-dialog/util';
import {
  DataResult,
  ManufacturerSupplier,
  MaterialFormValue,
  MaterialRequest,
  MaterialStandard,
} from '@mac/msd/models';
import {
  materialDialogConfirmed,
  materialDialogOpened,
  resetDialogOptions,
  resetMaterialRecord,
} from '@mac/msd/store/actions/dialog';
import { DialogFacade } from '@mac/msd/store/facades/dialog';

import { DataFacade } from '../../store/facades/data';
import { findProperty, mapProperty } from './util/form-helpers';

@Component({
  selector: 'mac-base-input-dialog',
  template: '',
})
export class MaterialInputDialogComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  public TOOLTIP_DELAY = 1500;

  public materialClass: MaterialClass;

  public dialogLoading$ = this.dialogFacade.dialogLoading$;
  public createMaterialLoading$ = this.dialogFacade.createMaterialLoading$;
  public editLoading$: BehaviorSubject<boolean>;
  public dialogError$ = this.dialogFacade.dialogError$;
  public destroy$ = new Subject<void>();

  public filterFn = util.filterFn;
  public valueTitleToOptionKeyFilterFnFactory =
    util.valueTitleToOptionKeyFilterFnFactory;
  public valueOptionKeyToTitleFilterFnFactory =
    util.valueOptionKeyToTitleFilterFnFactory;
  public getErrorMessage = util.getErrorMessage;

  public materialId: number;

  // Material standard
  public materialStandardIdControl = this.controlsService.getControl<number>();
  public standardDocumentsControl =
    this.controlsService.getRequiredControl<StringOption>();
  public materialNamesControl =
    this.controlsService.getRequiredControl<StringOption>();

  // Supplier
  public manufacturerSupplierIdControl =
    this.controlsService.getControl<number>();
  public supplierControl =
    this.controlsService.getRequiredControl<StringOption>();
  public supplierPlantControl =
    this.controlsService.getRequiredControl<StringOption>(undefined, true);
  public supplierCountryControl =
    this.controlsService.getRequiredControl<StringOption>(undefined, true);

  // CO2
  public co2Scope1Control = this.controlsService.getNumberControl();
  public co2Scope2Control = this.controlsService.getNumberControl();
  public co2Scope3Control = this.controlsService.getNumberControl();
  public co2TotalControl = this.controlsService.getRequiredNumberControl(
    undefined,
    false,
    1
  );
  public co2ClassificationControl =
    this.controlsService.getRequiredControl<StringOption>(undefined, true);

  // Material
  public categoriesControl =
    this.controlsService.getRequiredControl<StringOption>();
  public releaseRestrictionsControl = this.controlsService.getControl<string>();

  public createMaterialForm: FormGroup;

  @ViewChildren('dialogControl', { read: ElementRef })
  dialogControlRefs: QueryList<ElementRef>;

  protected isCopy = false;

  public constructor(
    readonly controlsService: DialogControlsService,
    readonly dialogFacade: DialogFacade,
    readonly dataFacade: DataFacade,
    readonly dialogRef: MatDialogRef<MaterialInputDialogComponent>,
    readonly snackbar: MatSnackBar,
    readonly cdRef: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA)
    readonly dialogData: {
      editDialogInformation?: {
        row: DataResult;
        column: string;
        isCopy?: boolean;
      };
      isResumeDialog: boolean;
    }
  ) {
    this.editLoading$ = new BehaviorSubject(!!dialogData.editDialogInformation);
    this.dataFacade.materialClass$
      .pipe(takeUntil(this.destroy$))
      .subscribe((mc) => (this.materialClass = mc));
  }

  public ngOnInit(): void {
    this.dialogError$
      .pipe(
        takeUntil(this.destroy$),
        filter((error) => error !== undefined),
        take(1)
      )
      .subscribe(() => this.handleDialogError());
  }

  public ngAfterViewInit(): void {
    if (
      this.dialogData.editDialogInformation ||
      this.dialogData.isResumeDialog
    ) {
      this.dialogFacade.resumeDialogData$
        .pipe(
          filter(
            (dialogData) =>
              (!!dialogData.editMaterial &&
                !!dialogData.editMaterial.parsedMaterial) ||
              !!dialogData.minimizedDialog
          ),
          take(1)
        )
        .subscribe((dialogData) => {
          const materialFormValue: Partial<MaterialFormValue> =
            dialogData.minimizedDialog?.value ??
            dialogData.editMaterial?.parsedMaterial;
          this.isCopy =
            this.dialogData.editDialogInformation?.isCopy ||
            dialogData.minimizedDialog?.isCopy;
          this.materialId =
            (dialogData.minimizedDialog ||
              this.dialogData.editDialogInformation) &&
            !this.isCopy
              ? dialogData.minimizedDialog?.id ??
                dialogData.editMaterial?.row?.id
              : undefined;
          if (materialFormValue) {
            this.enableEditFields(materialFormValue);
            this.patchFields(materialFormValue);

            if (
              this.dialogData.isResumeDialog ||
              this.materialId ||
              this.isCopy
            ) {
              this.createMaterialForm.markAllAsTouched();
            }

            this.createMaterialForm.updateValueAndValidity();

            this.cdRef.markForCheck();
            this.cdRef.detectChanges();
          }
          if (
            !this.dialogData.isResumeDialog &&
            this.dialogData.editDialogInformation
          ) {
            this.dialogControlRefs.changes
              .pipe(takeUntil(this.destroy$))
              .subscribe((changes: QueryList<ElementRef>) =>
                focusSelectedElement(
                  changes,
                  this.dialogData.editDialogInformation.column,
                  this.cdRef
                )
              );
          }
          this.editLoading$.next(false);
        });
    }
    setTimeout(() => {
      this.dispatchDialogOpenEvent();
    });
  }

  // allow overload in sup-class
  patchFields(materialFormValue: Partial<MaterialFormValue>): void {
    this.createMaterialForm.patchValue(materialFormValue);
  }

  // allow overload in sup-class
  dispatchDialogOpenEvent(): void {
    this.dialogFacade.dispatch(materialDialogOpened());
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public handleDialogError(): void {
    this.showInSnackbar(
      translate('materialsSupplierDatabase.somethingWentWrong'),
      translate('materialsSupplierDatabase.close')
    );
    this.cancelDialog();
  }

  public cancelDialog(): void {
    this.closeDialog(false);
    this.dialogFacade.dispatch(resetDialogOptions());
  }

  public closeDialog(reload: boolean): void {
    this.dialogRef.close({ reload });
  }

  public minimizeDialog(): void {
    this.dialogRef.close({
      minimize: {
        id: this.materialId,
        value: this.createMaterialForm.getRawValue(),
        isCopy: this.isCopy,
      },
    });
  }

  public showInSnackbar(
    msg: string,
    action?: string,
    config?: MatSnackBarConfig
  ): void {
    this.snackbar.open(msg, action ?? undefined, config);
  }

  // extend this method in child classes for specific material classes
  enableEditFields(materialFormValue: Partial<MaterialFormValue>): void {
    if (materialFormValue.supplier) {
      this.supplierPlantControl.enable({ emitEvent: false });
    }

    if (
      !materialFormValue.manufacturerSupplierId &&
      materialFormValue.supplierPlant
    ) {
      this.supplierCountryControl.enable({ emitEvent: false });
    }

    if (materialFormValue.co2PerTon) {
      this.co2ClassificationControl.enable({ emitEvent: false });
    }
  }

  public isEditDialog(): boolean {
    return !!this.materialId || !!this.dialogData?.editDialogInformation;
  }

  public isCopyDialog(): boolean {
    return !this.materialId && this.isCopy;
  }

  public getTitle(): string {
    return this.isEditDialog() && !this.isCopyDialog()
      ? translate('materialsSupplierDatabase.mainTable.dialog.updateTitle', {
          class: translate(
            `materialsSupplierDatabase.materialClassValues.${this.materialClass}`
          ),
        })
      : translate('materialsSupplierDatabase.mainTable.dialog.addTitle', {
          class: translate(
            `materialsSupplierDatabase.materialClassValues.${this.materialClass}`
          ),
        });
  }

  public compareWithId = (option: StringOption, selected: StringOption) =>
    option?.id === selected?.id;

  public getColumn(): string {
    return this.dialogData?.editDialogInformation?.column;
  }

  protected buildMaterialStandard(
    baseMaterial: MaterialFormValue
  ): MaterialStandard {
    return {
      id: baseMaterial.materialStandardId,
      materialName: baseMaterial.materialName.title,
      materialNumber: mapProperty<string>(
        baseMaterial,
        'materialNumber',
        (val) => (val.length > 0 ? val.split(/,\s?/) : undefined)
      ),
      standardDocument: baseMaterial.standardDocument.title,
    };
  }

  protected buildManufacturerSupplier(
    baseMaterial: MaterialFormValue
  ): ManufacturerSupplier {
    return {
      id: baseMaterial.manufacturerSupplierId,
      name: baseMaterial.supplier.title,
      plant: baseMaterial.supplierPlant.title,
      country: baseMaterial.supplierCountry?.title,
      manufacturer: findProperty(baseMaterial, 'manufacturer'),
    };
  }

  protected buildMaterial(baseMaterial: MaterialFormValue): MaterialRequest {
    return {
      // TODO: should not be hardcoded later on
      id: this.materialId,
      manufacturerSupplierId: baseMaterial.manufacturerSupplierId,
      materialStandardId: baseMaterial.materialStandardId,
      productCategory: baseMaterial.productCategory?.id as string,
      referenceDoc: JSON.stringify(
        findProperty<StringOption[]>(baseMaterial, 'referenceDoc')?.map(
          (val) => val.title
        )
      ),
      co2Scope1: baseMaterial.co2Scope1,
      co2Scope2: baseMaterial.co2Scope2,
      co2Scope3: baseMaterial.co2Scope3,
      co2PerTon: baseMaterial.co2PerTon,
      co2Classification: baseMaterial.co2Classification?.id as string,
      releaseDateYear: findProperty(baseMaterial, 'releaseDateYear'),
      releaseDateMonth: findProperty(baseMaterial, 'releaseDateMonth'),
      releaseRestrictions: baseMaterial.releaseRestrictions,
      blocked: findProperty(baseMaterial, 'blocked'),
      castingMode: findProperty(baseMaterial, 'castingMode'),
      castingDiameter: findProperty<StringOption>(
        baseMaterial,
        'castingDiameter'
      )?.title,
      maxDimension: findProperty(baseMaterial, 'maxDimension'),
      minDimension: findProperty(baseMaterial, 'minDimension'),
      steelMakingProcess: findProperty<StringOption>(
        baseMaterial,
        'steelMakingProcess'
      )?.id as string,
      productionProcess: findProperty<StringOption>(
        baseMaterial,
        'productionProcess'
      )?.id as string,
      rating: findProperty<StringOption>(baseMaterial, 'rating')?.id as string,
      ratingRemark: findProperty(baseMaterial, 'ratingRemark'),
      ratingChangeComment: findProperty(baseMaterial, 'ratingChangeComment'),
      selfCertified: findProperty(baseMaterial, 'selfCertified'),
      recyclingRate: findProperty(baseMaterial, 'recyclingRate'),
      condition: findProperty<StringOption>(baseMaterial, 'condition')
        ?.id as string,
      coating: findProperty<StringOption>(baseMaterial, 'coating')
        ?.id as string,
      grade: findProperty(baseMaterial, 'grade'),
      // attachments: '',
    };
  }

  public confirmMaterial(createAnother: boolean): void {
    const baseMaterial = {
      ...(this.createMaterialForm.value as MaterialFormValue),
    } as MaterialFormValue;

    const standard = this.buildMaterialStandard(baseMaterial);
    const supplier = this.buildManufacturerSupplier(baseMaterial);
    const material = this.buildMaterial(baseMaterial);

    // include material, stdDoc and supplier put logic in effect
    this.dialogFacade.dispatch(
      materialDialogConfirmed({ standard, supplier, material })
    );
    this.awaitMaterialComplete(createAnother, NavigationLevel.MATERIAL);
  }

  public awaitMaterialComplete(
    createAnother: boolean,
    navigationLevel: NavigationLevel
  ) {
    // rename to createMaterialComplete, return object instead of
    this.dialogFacade.createMaterialRecord$
      .pipe(filter(Boolean), take(1))
      .subscribe((record) => {
        let msgKey;
        if (!record.error) {
          if (!createAnother) {
            this.closeDialog(true);
          }
          msgKey = 'materialsSupplierDatabase.mainTable.dialog.createSuccess';
        } else {
          msgKey = `materialsSupplierDatabase.mainTable.dialog.createFailure.${record.error.code}`;
        }
        const level = translate(
          `materialsSupplierDatabase.mainTable.dialog.level.${navigationLevel}`
        );
        this.showInSnackbar(
          translate(msgKey, { level }),
          translate('materialsSupplierDatabase.mainTable.dialog.close'),
          { duration: 5000 }
        );
        this.dialogFacade.dispatch(
          resetMaterialRecord({ error: !!record.error, createAnother })
        );
      });
  }
}
