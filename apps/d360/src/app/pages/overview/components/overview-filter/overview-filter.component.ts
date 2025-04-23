import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
  OutputEmitterRef,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

import { TranslocoDirective } from '@jsverse/transloco';

import { GlobalSelectionHelperService } from '../../../../feature/global-selection/global-selection.service';
import { OnTypeAutocompleteWithMultiselectComponent } from '../../../../shared/components/global-selection-criteria/on-type-autocomplete-with-multiselect/on-type-autocomplete-with-multiselect.component';
import { PreLoadedAutocompleteWithMultiselectComponent } from '../../../../shared/components/global-selection-criteria/pre-loaded-autocomplete-with-multiselect/pre-loaded-autocomplete-with-multiselect.component';
import { SelectableValue } from '../../../../shared/components/inputs/autocomplete/selectable-values.utils';
import { DisplayFunctions } from '../../../../shared/components/inputs/display-functions.utils';
import { SelectableOptionsService } from '../../../../shared/services/selectable-options.service';

export interface OverviewFilterValue {
  gkams?: SelectableValue[];
  customers?: SelectableValue[];
}

@Component({
  selector: 'd360-overview-filter',
  imports: [
    TranslocoDirective,
    MatButton,
    ReactiveFormsModule,
    MatIcon,
    OnTypeAutocompleteWithMultiselectComponent,
    PreLoadedAutocompleteWithMultiselectComponent,
  ],
  templateUrl: './overview-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./overview-filter.component.scss'],
})
export class OverviewFilterComponent {
  protected readonly DisplayFunctions: typeof DisplayFunctions =
    DisplayFunctions;
  protected readonly selectableOptionsService: SelectableOptionsService =
    inject(SelectableOptionsService);
  protected readonly globalSelectionHelperService: GlobalSelectionHelperService =
    inject(GlobalSelectionHelperService);

  protected filterForm = new FormGroup({
    gkams: new FormControl<SelectableValue[]>([], { nonNullable: true }),
    customers: new FormControl<SelectableValue[]>([], { nonNullable: true }),
    gkamSearch: new FormControl('', { nonNullable: true }),
    customerSearch: new FormControl('', { nonNullable: true }),
  });
  public onFilterChange: OutputEmitterRef<OverviewFilterValue> =
    output<OverviewFilterValue>();
  public onReset: OutputEmitterRef<void> = output();

  protected applyFilters: () => void = (): void => {
    this.onFilterChange.emit(this.computeReturnFilter(this.filterForm.value));
  };

  protected resetFilters: () => void = (): void => {
    this.filterForm.reset();
    this.onReset.emit();
    this.onFilterChange.emit(this.computeReturnFilter(this.filterForm.value));
  };

  private computeReturnFilter(
    filter: OverviewFilterValue
  ): OverviewFilterValue {
    return {
      gkams: filter.gkams?.length > 0 ? filter.gkams : undefined,
      customers: filter.customers?.length > 0 ? filter.customers : undefined,
    };
  }
}
