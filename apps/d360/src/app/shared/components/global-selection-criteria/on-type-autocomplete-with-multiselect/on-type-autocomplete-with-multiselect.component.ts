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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { Observable, tap } from 'rxjs';

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
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly changeDetectorRef: ChangeDetectorRef =
    inject(ChangeDetectorRef);
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
  public panelClass: InputSignal<string | string[]> = input<string | string[]>(
    ''
  );

  // Clipboard
  public entityName: InputSignal<string> = input.required<string>();
  public entityNamePlural: InputSignal<string> = input.required<string>();

  /**
   * Opens the MultiselectFromClipboardModal Dialog
   *
   * @memberof OnTypeAutocompleteWithMultiselectComponent
   */
  public openModal() {
    this.dialog
      .open(MultiselectFromClipboardModalComponent, {
        data: {
          control: this.control(),
          form: this.form(),
          autocompleteLabel: this.autocompleteLabel(),
          getOptionLabel: this.getOptionLabel(),
          getOptionLabelInTag: this.getOptionLabelInTag(),
          optionsLoadingResults: this.optionsLoadingResult(),
          selectableValuesByKeys: this.resolveFunction(),
          entityName: this.entityName(),
          entityNamePlural: this.entityNamePlural(),
          urlBegin: this.urlBegin(),
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
