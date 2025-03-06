import { AfterViewChecked, ChangeDetectorRef, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

import { combineLatest, map } from 'rxjs';

import { LetDirective, PushPipe } from '@ngrx/component';
import { Store } from '@ngrx/store';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { setPreferredGreaseSelection } from '@ga/core/store/actions';
import {
  getAllGreases,
  getPreferredGrease,
  isPreselectionDisabled,
} from '@ga/core/store/selectors/calculation-parameters/calculation-parameters.selector';
import {
  defaultPreferredGreaseOption,
  emptyPreferredGreaseOptionId,
} from '@ga/shared/constants';
import { PreferredGreaseOption } from '@ga/shared/models';

@Component({
  selector: 'ga-preferred-grease-selection',
  imports: [
    LetDirective,
    SharedTranslocoModule,
    MatIconModule,
    MatSelectModule,
    MatTooltipModule,
    PushPipe,
  ],
  templateUrl: './preferred-grease-selection.component.html',
})
export class PreferredGreaseSelectionComponent implements AfterViewChecked {
  public defaultOption = defaultPreferredGreaseOption;
  public preferredGrease$ = this.store.select(getPreferredGrease);
  public allGreases$ = this.store.select(getAllGreases);

  public isDisabled$ = combineLatest([
    this.store.select(isPreselectionDisabled),
    this.preferredGrease$,
  ]).pipe(
    map(
      ([preselectionDisabled, preferred]) =>
        preselectionDisabled || preferred.loading
    )
  );

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
  ): boolean =>
    (a?.id === undefined && b?.id === undefined) || a?.text === b?.text;

  public removeEmptyOptions = (
    options: PreferredGreaseOption[]
  ): PreferredGreaseOption[] =>
    options?.filter(
      (option): option is PreferredGreaseOption =>
        !!option &&
        !option?.id.toString().includes(emptyPreferredGreaseOptionId)
    );
}
