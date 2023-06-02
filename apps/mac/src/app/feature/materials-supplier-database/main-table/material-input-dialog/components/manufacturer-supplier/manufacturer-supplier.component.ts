import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { Subject, takeUntil } from 'rxjs';

import { StringOption } from '@schaeffler/inputs';

import * as util from '@mac/msd/main-table/material-input-dialog/util';
import {
  addCustomSupplierName,
  addCustomSupplierPlant,
} from '@mac/msd/store/actions/dialog';
import { DialogFacade } from '@mac/msd/store/facades/dialog';

@Component({
  selector: 'mac-manufacturer-supplier',
  templateUrl: './manufacturer-supplier.component.html',
})
export class ManufacturerSupplierComponent implements OnInit, OnDestroy {
  @Input()
  public readonly: boolean;
  @Input()
  public editable: boolean;

  @Input() public manufacturerSupplierIdControl: FormControl<number>;
  @Input() public supplierControl: FormControl<StringOption>;
  @Input() public supplierPlantControl: FormControl<StringOption>;
  @Input() public supplierCountryControl: FormControl<StringOption>;

  public suppliers$ = this.dialogFacade.suppliers$;
  public supplierPlants$ = this.dialogFacade.supplierPlants$;
  public supplierCountries$ = this.dialogFacade.supplierCountries$;

  public supplierEditControl = new FormControl<string>(undefined);
  public supplierPlantEditControl = new FormControl<string>(undefined);
  public supplierCountryEditControl = new FormControl<string>(undefined);
  public viewMode = '';

  public getErrorMessage = util.getErrorMessage;
  public filterFn = util.filterFn;
  public valueTitleToOptionKeyFilterFnFactory =
    util.valueTitleToOptionKeyFilterFnFactory;
  public valueOptionKeyToTitleFilterFnFactory =
    util.valueOptionKeyToTitleFilterFnFactory;

  private supplierDependencies: FormGroup<{
    supplierName: FormControl<StringOption>;
    supplierPlant: FormControl<StringOption>;
    supplierCountry: FormControl<StringOption>;
  }>;
  private readonly destroy$ = new Subject<void>();

  @ViewChildren('dialogControl', { read: ElementRef })
  dialogControlRefs: QueryList<ElementRef>;

  constructor(private readonly dialogFacade: DialogFacade) {}

  ngOnInit(): void {
    if (this.editable) {
      this.viewMode = 'editable';
    } else if (this.readonly) {
      this.viewMode = 'readonly';
    } else {
      this.viewMode = '';
    }

    if (!this.editable && !this.readonly) {
      // only apply with dropDown available
      this.supplierDependencies = new FormGroup({
        supplierName: this.supplierControl,
        supplierPlant: this.supplierPlantControl,
        supplierCountry: this.supplierCountryControl,
      });
      // manufacturer only available for new suppliers. For old suppliers value will be prefilled
      this.supplierPlantControl.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe((supplierPlant) => {
          if (supplierPlant) {
            this.supplierCountryControl.enable();
          } else {
            this.supplierCountryControl.disable();
          }

          this.supplierCountryControl.setValue(
            supplierPlant?.data?.supplierCountry
          );
        });

      this.supplierDependencies.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(({ supplierName, supplierPlant }) => {
          // all supplier fields depend on the selection of a supplier
          if (supplierName) {
            this.supplierPlantControl.enable({ emitEvent: false });
            if (supplierPlant) {
              // verify selected plant is available for selected supplier name (special case for created items)
              if (
                supplierName.id && // new custom supplier has been selected
                supplierPlant.id && // new custom plant has been selected
                supplierPlant.data['supplierName'] !== supplierName.title
              ) {
                this.supplierPlantControl.reset();
                this.supplierCountryControl.reset();
              } else {
                // store supplier id (not available for created entries)
                const supplierId = supplierPlant?.data?.['supplierId'];
                this.manufacturerSupplierIdControl.patchValue(supplierId);
              }
            } else {
              this.manufacturerSupplierIdControl.reset();
            }
          } else {
            this.manufacturerSupplierIdControl.reset();
            this.supplierPlantControl.reset(undefined, { emitEvent: false });
            this.supplierPlantControl.disable({ emitEvent: false });
            this.supplierCountryControl.reset(undefined, { emitEvent: false });
            this.supplierCountryControl.disable({ emitEvent: false });
          }
        });
    } else if (this.editable) {
      // only needed in edit mode
      // set form field values
      this.supplierEditControl.setValue(this.supplierControl.value?.title);
      this.supplierPlantEditControl.setValue(
        this.supplierPlantControl.value?.title
      );
      this.supplierCountryEditControl.setValue(
        this.supplierCountryControl.value?.title
      );
      // create subscribtions to update parent form fields
      this.supplierEditControl.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe((name) => this.mapToControl(this.supplierControl, name));
      this.supplierPlantEditControl.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe((plant) =>
          this.mapToControl(this.supplierPlantControl, plant)
        );
      this.supplierCountryEditControl.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe((country) =>
          this.mapToControl(this.supplierCountryControl, country)
        );
    }
  }

  private mapToControl(
    control: FormControl<StringOption>,
    value: string
  ): void {
    const newValue = {
      id: value,
      title: value,
    } as StringOption;
    control.setValue(newValue);
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public addSupplierName(supplierName: string): void {
    this.dialogFacade.dispatch(addCustomSupplierName({ supplierName }));
  }

  public addSupplierPlant(supplierPlant: string): void {
    this.dialogFacade.dispatch(addCustomSupplierPlant({ supplierPlant }));
  }
}
