import { Component, inject, input, InputSignal } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { Observable } from 'rxjs';

import { OptionsLoadingResult } from '../../../services/selectable-options.service';
import { MultiAutocompleteOnTypeComponent } from '../../inputs/autocomplete/multi-autocomplete-on-type/multi-autocomplete-on-type.component';
import { ResolveSelectableValueResult } from '../../inputs/autocomplete/selectable-values.utils';
import { DisplayFunction } from '../../inputs/display-functions.utils';
import { MultiselectFromClipboardModalComponent } from '../../inputs/multiselect-from-clipboard-modal/multiselect-from-clipboard-modal.component';

type ResolveFunction = (
  values: string[]
) => Observable<ResolveSelectableValueResult[]>;

/**
 * The OnTypeAutocompleteWithMultiselect Component
 *
 * @export
 * @class OnTypeAutocompleteWithMultiselectComponent
 */
@Component({
  selector: 'd360-on-type-autocomplete-with-multiselect',
  standalone: true,
  imports: [
    MultiAutocompleteOnTypeComponent,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './on-type-autocomplete-with-multiselect.component.html',
  styleUrls: ['./on-type-autocomplete-with-multiselect.component.scss'],
})
export class OnTypeAutocompleteWithMultiselectComponent {
  /**
   * The MatDialog Service Instance
   *
   * @private
   * @type {MatDialog}
   * @memberof OnTypeAutocompleteWithMultiselectComponent
   */
  private readonly dialog: MatDialog = inject(MatDialog);
  public form: InputSignal<FormGroup> = input.required<FormGroup>();
  public control: InputSignal<FormControl> = input.required<FormControl>();
  public urlBegin: InputSignal<string> = input.required<string>();
  public resolveFunction: InputSignal<ResolveFunction> =
    input.required<ResolveFunction>();

  protected searchFormControl = new FormControl('');

  // Input
  public autocompleteLabel: InputSignal<string> = input.required<string>();
  public getOptionLabel: InputSignal<DisplayFunction> =
    input.required<DisplayFunction>();
  public getOptionLabelInTag: InputSignal<DisplayFunction> =
    input.required<DisplayFunction>();
  public optionsLoadingResult: InputSignal<OptionsLoadingResult> =
    input<OptionsLoadingResult>();

  // Clipboard
  public entityName: InputSignal<string> = input.required<string>();
  public entityNamePlural: InputSignal<string> = input.required<string>();

  /**
   * Opens the MultiselectFromClipboardModal Dialog
   *
   * @memberof OnTypeAutocompleteWithMultiselectComponent
   */
  public openModal() {
    this.dialog.open(MultiselectFromClipboardModalComponent, {
      data: {
        control: this.control(),
        form: this.form(),
        searchControl: this.searchFormControl,
        autocompleteLabel: this.autocompleteLabel(),
        getOptionLabel: this.getOptionLabel(),
        getOptionLabelInTag: this.getOptionLabelInTag(),
        optionsLoadingResults: this.optionsLoadingResult(),
        selectableValuesByKeys: this.resolveFunction(),
        entityName: this.entityName(),
        entityNamePlural: this.entityNamePlural(),
        urlBegin: this.urlBegin(),
      },
    });
  }
}
