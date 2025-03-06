import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { SelectableValue } from '../../shared/components/inputs/autocomplete/selectable-values.utils';
import { SingleAutocompleteOnTypeComponent } from '../../shared/components/inputs/autocomplete/single-autocomplete-on-type/single-autocomplete-on-type.component';
import { SingleAutocompletePreLoadedComponent } from '../../shared/components/inputs/autocomplete/single-autocomplete-pre-loaded/single-autocomplete-pre-loaded.component';
import { OptionsLoadingResult } from '../../shared/services/selectable-options.service';

@Component({
  selector: 'd360-test-page',
  imports: [
    CommonModule,
    SingleAutocompletePreLoadedComponent,
    SingleAutocompleteOnTypeComponent,
  ],
  templateUrl: './test-page.component.html',
})
export class TestPageComponent {
  protected testControl = new FormControl<SelectableValue | string>('hallo 1');
  testMaterialControl: FormControl<SelectableValue | string> = new FormControl(
    '0000003167'
  );

  protected formGroup = new FormGroup({
    testControl: this.testControl,
    testMaterialControl: this.testMaterialControl,
  });

  protected optionsLoadingResult: OptionsLoadingResult = {
    options: [
      { id: 'hallo 1', text: 'Hallo 1' },
      { id: 'hallo 2', text: 'Hallo 2' },
      { id: 'hallo 3', text: 'Hallo 3' },
    ],
    loading: false,
  };
}
