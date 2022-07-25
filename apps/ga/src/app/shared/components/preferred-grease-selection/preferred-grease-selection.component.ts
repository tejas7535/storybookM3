import { CommonModule } from '@angular/common';
import { AfterViewChecked, ChangeDetectorRef, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

import { LetModule } from '@ngrx/component';
import { Store } from '@ngrx/store';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { setPreferredGreaseSelection } from '@ga/core/store/actions';
import { getPreferredGrease } from '@ga/core/store/selectors/calculation-parameters/calculation-parameters.selector';
import { defaultOption, emptyOptionId } from '@ga/shared/constants';
import { PreferredGreaseOption } from '@ga/shared/models';

@Component({
  selector: 'ga-preferred-grease-selection',
  standalone: true,
  imports: [
    CommonModule,
    LetModule,
    SharedTranslocoModule,
    MatIconModule,
    MatSelectModule,
    MatTooltipModule,
  ],
  templateUrl: './preferred-grease-selection.component.html',
})
export class PreferredGreaseSelectionComponent implements AfterViewChecked {
  public defaultOption = defaultOption;
  public preferredGrease$ = this.store.select(getPreferredGrease);

  public constructor(
    private readonly store: Store,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {}

  public ngAfterViewChecked() {
    this.changeDetectorRef.detectChanges();
  }

  public onPreferredGreaseSelectionChange(
    selectedGrease: PreferredGreaseOption
  ): void {
    this.store.dispatch(setPreferredGreaseSelection({ selectedGrease }));
  }

  public compareOptions = (
    a: PreferredGreaseOption,
    b: PreferredGreaseOption
  ): boolean => a?.id === b?.id;

  public removeEmptyOptions = (
    options: PreferredGreaseOption[]
  ): PreferredGreaseOption[] =>
    options?.filter(
      (option): option is PreferredGreaseOption =>
        !!option && !option?.id.toString().includes(emptyOptionId)
    );
}
