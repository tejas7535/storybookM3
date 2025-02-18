import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Subject, takeUntil } from 'rxjs';

import { PushPipe } from '@ngrx/component';

import { StringOption } from '@schaeffler/inputs';
import { SelectModule } from '@schaeffler/inputs/select';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { ErrorMessagePipe } from '@mac/feature/materials-supplier-database/main-table/pipes/error-message-pipe/error-message.pipe';
import { DialogFacade } from '@mac/msd/store/facades/dialog';

import { DialogControlsService } from '../../services';
import * as util from '../../util';

@Component({
  selector: 'mac-material-standard',
  templateUrl: './material-standard.component.html',
  standalone: true,
  imports: [
    // default
    CommonModule,
    ErrorMessagePipe,
    // angular material
    MatFormFieldModule,
    MatTooltipModule,
    MatInputModule,
    // forms
    ReactiveFormsModule,
    // libs
    SelectModule,
    SharedTranslocoModule,
    // ngrx
    PushPipe,
  ],
})
export class MaterialStandardComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChildren('dialogControl', { read: ElementRef })
  dialogControlRefs: QueryList<ElementRef>;

  @Input()
  // property defining if entries should be "readonly" or dropdown menues
  public readonly = false;

  @Input()
  // property defining if entries should be "readonly" or dropdown menues
  public editable = false;

  @Input()
  // form control for ID
  public materialStandardIdControl: FormControl<number>;

  @Input()
  // form control for standard document
  public standardDocumentsControl: FormControl<StringOption>;

  @Input()
  // form control for material name
  public materialNamesControl: FormControl<StringOption>;

  // form control for standard document editing
  public standardDocumentsEditControl: FormControl<string>;
  // form control for material name editing
  public materialNamesEditControl: FormControl<string>;
  // switch expression to identify what view to use
  public viewMode = '';

  // list of standard documents for dropdown list
  public readonly standardDocuments$ = this.dialogFacade.standardDocuments$;
  // list of material names for dropdown list
  public readonly materialNames$ = this.dialogFacade.materialNames$;

  private readonly destroy$ = new Subject<void>();

  // constructor
  constructor(
    private readonly dialogFacade: DialogFacade,
    private readonly dialogControl: DialogControlsService
  ) {
    this.standardDocumentsEditControl = this.dialogControl.getRequiredControl();
    this.materialNamesEditControl = this.dialogControl.getRequiredControl();
  }

  // on destroy
  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // on init
  ngOnInit(): void {
    if (this.editable) {
      this.viewMode = 'editable';
    } else if (this.readonly) {
      this.viewMode = 'readonly';
    } else {
      this.viewMode = '';
    }

    // no logic to apply, if in edit-mode or readonly
    if (!this.editable && !this.readonly) {
      this.standardDocumentsControl.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe((stdDoc) => this.onUpdateStandardDocument(stdDoc));

      this.materialNamesControl.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe((matName) => this.onUpdateMaterialName(matName));
    } else if (this.editable) {
      this.materialNamesEditControl.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe((matName) =>
          this.mapToControl(this.materialNamesControl, matName)
        );
      this.standardDocumentsEditControl.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe((stdDoc) =>
          this.mapToControl(this.standardDocumentsControl, stdDoc)
        );
    }
  }

  ngAfterViewInit(): void {
    this.materialNamesEditControl.setValue(
      this.materialNamesControl.value?.title,
      { emitEvent: false }
    );
    this.standardDocumentsEditControl.setValue(
      this.standardDocumentsControl.value?.title,
      { emitEvent: false }
    );
  }

  public addStandardDocument(standardDocument: string): void {
    this.dialogFacade.addCustomMaterialStandardDocument(standardDocument);
  }

  public addMaterialName(materialName: string): void {
    this.dialogFacade.addCustomMaterialStandardName(materialName);
  }

  // TO DO replace with Pipe or attribute!!!!
  public materialNameFilterFnFactory =
    (standardDocumentsControl: FormControl<StringOption>) =>
    (option?: StringOption, value?: string) => {
      if (
        option.id &&
        standardDocumentsControl.value &&
        standardDocumentsControl.value.data &&
        !standardDocumentsControl.value.data['materialNames'].some(
          ({ materialName }: { materialName: string }) =>
            materialName === option.title
        )
      ) {
        return false;
      }

      return util.filterFn(option, value);
    };

  // TO DO replace with Pipe or attribute!!!!
  public standardDocumentFilterFnFactory =
    (materialNamesControl: FormControl<StringOption>) =>
    (option?: StringOption, value?: string) => {
      if (
        option.id &&
        materialNamesControl.value &&
        materialNamesControl.value.data &&
        !materialNamesControl.value.data['standardDocuments'].some(
          ({ standardDocument }: { standardDocument: string }) =>
            standardDocument === option.title
        )
      ) {
        return false;
      }

      return util.filterFn(option, value);
    };

  private mapToControl(
    control: FormControl<StringOption>,
    value: string
  ): void {
    const newValue = {
      title: value,
    } as StringOption;
    control.setValue(newValue);
  }

  /* Detect changes of stdDoc and reset material name if value from matName does
   not fit to selected value */
  private onUpdateStandardDocument(standardDocument: StringOption): void {
    // reset material name if stdDoc has been reseted
    if (!standardDocument) {
      this.reset(this.materialStandardIdControl);
      this.reset(this.materialNamesControl);
    }
    // check match for material name
    else if (this.materialNamesControl.value) {
      const mappedSelection = standardDocument.data?.materialNames.find(
        ({ materialName }: { id: number; materialName: string }) =>
          materialName === this.materialNamesControl.value.title
      );
      if (mappedSelection) {
        this.materialStandardIdControl.setValue(mappedSelection.id);
      }
      // special rule for selecting custom added entries
      else if (!standardDocument.id || !this.materialNamesControl.value.id) {
        this.reset(this.materialStandardIdControl);
      } else {
        this.reset(this.materialNamesControl);
      }
    }
  }

  /* Detect changes of field and reset stdDoc if value from stdDoc does
       not fit to selected value */
  private onUpdateMaterialName(materialName: StringOption): void {
    // reset stdDoc if field has been reseted
    if (!materialName) {
      this.reset(this.standardDocumentsControl);
      this.reset(this.materialStandardIdControl);
    }
    // check match with material name
    else if (this.standardDocumentsControl.value) {
      const mappedSelection = materialName.data?.standardDocuments.find(
        ({ standardDocument }: { id: number; standardDocument: string }) =>
          standardDocument === this.standardDocumentsControl.value.title
      );
      if (mappedSelection) {
        this.materialStandardIdControl.setValue(mappedSelection.id);
      }
      // special rule for new created custom entries
      else if (!materialName.id || !this.standardDocumentsControl.value.id) {
        this.reset(this.materialStandardIdControl);
      } else {
        this.reset(this.standardDocumentsControl);
      }
    }
  }

  private reset(control: FormControl): void {
    control.reset(undefined, { emitEvent: false });
  }
}
