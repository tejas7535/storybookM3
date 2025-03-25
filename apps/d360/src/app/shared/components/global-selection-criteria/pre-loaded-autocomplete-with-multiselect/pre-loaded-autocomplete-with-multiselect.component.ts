import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  input,
  InputSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { Observable, tap } from 'rxjs';

import { OptionsLoadingResult } from '../../../services/selectable-options.service';
import { MultiAutocompletePreLoadedComponent } from '../../inputs/autocomplete/multi-autocomplete-pre-loaded/multi-autocomplete-pre-loaded.component';
import {
  ResolveSelectableValueResult,
  SelectableValue,
} from '../../inputs/autocomplete/selectable-values.utils';
import { DisplayFunction } from '../../inputs/display-functions.utils';
import { MultiselectFromClipboardModalComponent } from '../../inputs/multiselect-from-clipboard-modal/multiselect-from-clipboard-modal.component';

type ResolveFunction = (
  values: string[],
  options: SelectableValue[]
) => Observable<ResolveSelectableValueResult[]>;

/**
 * The PreLoadedAutocompleteWithMultiselect Component
 *
 * @export
 * @class PreLoadedAutocompleteWithMultiselectComponent
 */
@Component({
  selector: 'd360-pre-loaded-autocomplete-with-multiselect',
  imports: [
    MultiAutocompletePreLoadedComponent,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './pre-loaded-autocomplete-with-multiselect.component.html',
  styleUrls: ['./pre-loaded-autocomplete-with-multiselect.component.scss'],
})
export class PreLoadedAutocompleteWithMultiselectComponent {
  public destroyRef: DestroyRef = inject(DestroyRef);
  public changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);

  public form: InputSignal<FormGroup> = input.required<FormGroup>();
  public control: InputSignal<FormControl> = input.required<FormControl>();

  public resolveFunction: InputSignal<ResolveFunction> =
    input.required<ResolveFunction>();

  // Input
  public autocompleteLabel: InputSignal<string> = input.required<string>();
  public getOptionLabel: InputSignal<DisplayFunction> =
    input.required<DisplayFunction>();
  public getOptionLabelInTag: InputSignal<DisplayFunction> =
    input.required<DisplayFunction>();
  public panelClass: InputSignal<string | string[]> = input<string | string[]>(
    ''
  );

  // Clipboard
  public entityName: InputSignal<string> = input.required<string>();
  public entityNamePlural: InputSignal<string> = input.required<string>();

  /**
   * The options loading result.
   *
   * @type {InputSignal<OptionsLoadingResult>}
   * @memberof PreLoadedAutocompleteWithMultiselectComponent
   */
  public optionsLoadingResult: InputSignal<OptionsLoadingResult> =
    input.required<OptionsLoadingResult>();

  /**
   * The search field control
   *
   * @protected
   * @memberof PreLoadedAutocompleteWithMultiselectComponent
   */
  protected searchFormControl = new FormControl('');

  /**
   * The MatDialog Service Instance
   *
   * @private
   * @type {MatDialog}
   * @memberof PreLoadedAutocompleteWithMultiselectComponent
   */
  private readonly dialog: MatDialog = inject(MatDialog);

  /**
   * Open the MultiselectFromClipboard Dialog
   *
   * @memberof PreLoadedAutocompleteWithMultiselectComponent
   */
  public openModal() {
    this.dialog
      .open(MultiselectFromClipboardModalComponent, {
        data: {
          control: this.control(),
          form: this.form(),
          searchControl: this.searchFormControl,
          autocompleteLabel: this.autocompleteLabel(),
          getOptionLabel: this.getOptionLabel(),
          getOptionLabelInTag: this.getOptionLabelInTag(),
          optionsLoadingResults: this.optionsLoadingResult(),
          selectableValuesByKeys: (values: string[]) =>
            this.resolveFunction()(values, this.optionsLoadingResult().options),
          entityName: this.entityName(),
          entityNamePlural: this.entityNamePlural(),
        },
        maxWidth: '600px',
        autoFocus: false,
      })
      .afterClosed()
      .pipe(
        tap(() => this.changeDetectorRef.markForCheck()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
}
