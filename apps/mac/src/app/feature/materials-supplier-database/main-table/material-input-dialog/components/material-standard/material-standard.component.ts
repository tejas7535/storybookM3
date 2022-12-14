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
import { FormControl } from '@angular/forms';

import { Subject, takeUntil } from 'rxjs';

import { StringOption } from '@schaeffler/inputs';

import {
  addCustomMaterialStandardDocument,
  addCustomMaterialStandardName,
} from '@mac/msd/store/actions/dialog';
import { DialogFacade } from '@mac/msd/store/facades/dialog';

import * as util from '../../util';

@Component({
  selector: 'mac-material-standard',
  templateUrl: './material-standard.component.html',
})
export class MaterialStandardComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  private readonly destroy$ = new Subject<void>();

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
  public standardDocumentsEditControl = new FormControl<string>(undefined);
  // form control for material name editing
  public materialNamesEditControl = new FormControl<string>(undefined);
  // switch expression to identify what view to use
  public viewMode = '';

  // list of standard documents for dropdown list
  public readonly standardDocuments$ = this.dialogFacade.standardDocuments$;
  // list of material names for dropdown list
  public readonly materialNames$ = this.dialogFacade.materialNames$;
  // utility for parsing error message
  public readonly getErrorMessage = util.getErrorMessage;

  @ViewChildren('dialogControl', { read: ElementRef })
  dialogControlRefs: QueryList<ElementRef>;

  // constructor
  constructor(private readonly dialogFacade: DialogFacade) {}

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

  private mapToControl(
    control: FormControl<StringOption>,
    value: string
  ): void {
    const newValue = {
      title: value,
    } as StringOption;
    control.setValue(newValue);
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

  public addStandardDocument(standardDocument: string): void {
    this.dialogFacade.dispatch(
      addCustomMaterialStandardDocument({ standardDocument })
    );
  }

  public addMaterialName(materialName: string): void {
    this.dialogFacade.dispatch(addCustomMaterialStandardName({ materialName }));
  }

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
}
