import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  output,
  Signal,
  signal,
  untracked,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { take } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { PushPipe } from '@ngrx/component';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AlertCategory } from '../../../../feature/alerts/model';
import { GlobalSelectionHelperService } from '../../../../feature/global-selection/global-selection.service';
import { materialClassifications } from '../../../../feature/material-customer/model';
import { SelectableOptionsService } from '../../../services/selectable-options.service';
import { SnackbarService } from '../../../utils/service/snackbar.service';
import { SelectableValue } from '../../inputs/autocomplete/selectable-values.utils';
import { DisplayFunctions } from '../../inputs/display-functions.utils';
import { FilterDropdownComponent } from '../../inputs/filter-dropdown/filter-dropdown.component';
import {
  GlobalSelectionFilters,
  GlobalSelectionState,
  GlobalSelectionStateService,
} from '../global-selection-state.service';
import { MinimizedGlobalSelectionCriteriaComponent } from '../minimized-global-selection-criteria/minimized-global-selection-criteria.component';
import { OnTypeAutocompleteWithMultiselectComponent } from '../on-type-autocomplete-with-multiselect/on-type-autocomplete-with-multiselect.component';
import { PreLoadedAutocompleteWithMultiselectComponent } from '../pre-loaded-autocomplete-with-multiselect/pre-loaded-autocomplete-with-multiselect.component';

/**
 * The GlobalSelectionCriteria Component
 *
 * @export
 * @class GlobalSelectionCriteriaComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-global-selection-criteria',
  standalone: true,
  imports: [
    MinimizedGlobalSelectionCriteriaComponent,
    // ResultCountTitleComponent,
    FilterDropdownComponent,
    SharedTranslocoModule,
    OnTypeAutocompleteWithMultiselectComponent,
    PreLoadedAutocompleteWithMultiselectComponent,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    PushPipe,
    LoadingSpinnerModule,
  ],
  templateUrl: './global-selection-criteria.component.html',
  styleUrls: ['./global-selection-criteria.component.scss'],
})
export class GlobalSelectionCriteriaComponent implements OnInit {
  /**
   * The SelectableOptionsService instance.
   *
   * @protected
   * @type {SelectableOptionsService}
   * @memberof GlobalSelectionCriteriaComponent
   */
  protected readonly selectableOptionsService: SelectableOptionsService =
    inject(SelectableOptionsService);

  /**
   * The TranslocoService instance.
   *
   * @private
   * @type {TranslocoService}
   * @memberof GlobalSelectionCriteriaComponent
   */
  private readonly translocoService: TranslocoService =
    inject(TranslocoService);

  /**
   * The SnackBarService instance.
   *
   * @private
   * @type {SnackbarService}
   * @memberof GlobalSelectionCriteriaComponent
   */
  private readonly snackBarService: SnackbarService = inject(SnackbarService);

  /**
   * The TranslocoLocaleService instance.
   *
   * @private
   * @type {TranslocoService}
   * @memberof GlobalSelectionCriteriaComponent
   */
  private readonly translocoLocaleService: TranslocoLocaleService = inject(
    TranslocoLocaleService
  );

  /**
   * The loading state for the count call.
   *
   * @private
   * @type {WritableSignal<boolean>}
   * @memberof GlobalSelectionCriteriaComponent
   */
  private readonly countLoading: WritableSignal<boolean> = signal(false);

  /**
   * The GlobalSelectionStateService instance.
   *
   * @type {GlobalSelectionStateService}
   * @memberof GlobalSelectionCriteriaComponent
   */
  public readonly globalSelectionStateService: GlobalSelectionStateService =
    inject(GlobalSelectionStateService);

  /**
   * The GlobalSelectionService instance.
   *
   * @type {GlobalSelectionHelperService}
   * @memberof GlobalSelectionCriteriaComponent
   */
  public readonly globalSelectionHelperService: GlobalSelectionHelperService =
    inject(GlobalSelectionHelperService);

  /**
   * The DestroyRef instance used for takeUntilDestroyed().
   *
   * @protected
   * @type {DestroyRef}
   * @memberof GlobalSelectionCriteriaComponent
   */
  protected readonly destroyRef: DestroyRef = inject(DestroyRef);

  /**
   * The output event emitter to emit filter changes to the parent.
   *
   * @memberof GlobalSelectionCriteriaComponent
   */
  public onGlobalSelectionChange = output<GlobalSelectionState>();

  /**
   * Are the GlobalSelections collapsed?
   *
   * @type {WritableSignal<boolean>}
   * @memberof GlobalSelectionCriteriaComponent
   */
  public isCollapsed: WritableSignal<boolean> = signal(true);

  /**
   * The global FormGroup to use in this form Component.
   *
   * @type {FormGroup<GlobalSelectionFilters>}
   * @memberof GlobalSelectionCriteriaComponent
   */
  public globalForm: FormGroup<GlobalSelectionFilters> =
    this.globalSelectionStateService.form();

  /**
   * Are the Options currently loading?
   *
   * @protected
   * @memberof GlobalSelectionCriteriaComponent
   */
  protected optionsLoading$ = this.selectableOptionsService.loading$;

  /**
   * The Material Classification Options.
   *
   * @type {SelectableValue[]}
   * @memberof GlobalSelectionCriteriaComponent
   */
  public materialClassifications: SelectableValue[] =
    materialClassifications.map((id) => ({ id, text: id }));

  /**
   * The current loaded count
   *
   * @type {WritableSignal<number>}
   * @memberof GlobalSelectionCriteriaComponent
   */
  public readonly count: WritableSignal<number> = signal(0);

  /**
   * The current available count or a loading message.
   *
   * @type {Signal<string>}
   * @memberof GlobalSelectionCriteriaComponent
   */
  public text: Signal<string> = computed(() =>
    this.countLoading()
      ? this.translocoService.translate('globalSelection.dropdown.loading', {})
      : `${this.translocoLocaleService.localizeNumber(this.count(), 'decimal')}  ${this.translocoService.translate('globalSelection.results', {})}`
  );

  // Display functions
  protected readonly displayFnId = DisplayFunctions.displayFnId;
  protected readonly displayFnUnited = DisplayFunctions.displayFnUnited;
  protected readonly displayFnText = DisplayFunctions.displayFnText;

  /**
   * @inheritdoc
   */
  public ngOnInit(): void {
    this.isCollapsed.set(!this.globalSelectionStateService.isEmpty());

    // inform other components
    this.onGlobalSelectionChange.emit(this.getFilters());

    // load count
    this.loadCount();
  }

  /**
   * Returns the preloaded Alert Types and translates them.
   *
   * @return {SelectableValue[]}
   * @memberof GlobalSelectionCriteriaComponent
   */
  public getAlertTypeValues(): SelectableValue[] {
    return (
      this.selectableOptionsService.get('alertTypes')?.options ?? []
    )?.map((item) => ({
      id: item.id,
      text: this.translocoService.translate(
        `alert.category.${item.id as AlertCategory}`,
        {},
        item.text
      ),
    }));
  }

  /**
   * Saves the current selected values in the global state storage.
   *
   * @protected
   * @return {void}
   * @memberof GlobalSelectionCriteriaComponent
   */
  protected saveFilters(): void {
    const values: GlobalSelectionState = this.getFilters();

    if (this.globalSelectionStateService.isEmpty()) {
      this.snackBarService.openSnackBar(
        this.translocoService.translate('globalSelection.selection_empty')
      );

      this.count.set(0);
    } else {
      this.loadCount();
    }

    this.globalSelectionStateService.saveState();
    this.onGlobalSelectionChange.emit(values);
  }

  /**
   * Resets the filter state.
   *
   * @protected
   * @memberof GlobalSelectionCriteriaComponent
   */
  protected resetFilters(): void {
    this.globalSelectionStateService.resetState();
    this.onGlobalSelectionChange.emit(null);

    // reset the count
    this.count.set(0);
  }

  /**
   * Returns the current filter state.
   *
   * @private
   * @return {GlobalSelectionState}
   * @memberof GlobalSelectionCriteriaComponent
   */
  private getFilters(): GlobalSelectionState {
    return { ...this.globalSelectionStateService.getState() };
  }

  /**
   * Load the count data.
   *
   * @private
   * @memberof GlobalSelectionCriteriaComponent
   */
  private loadCount(): void {
    const filters = this.getFilters();

    if (this.globalSelectionStateService.isEmpty()) {
      this.count.set(0);
    } else {
      if (!untracked(() => this.countLoading())) {
        this.countLoading.set(true);
        this.globalSelectionHelperService
          .getResultCount(filters)
          .pipe(take(1), takeUntilDestroyed(this.destroyRef))
          .subscribe((data) => {
            this.count.set(data || 0);

            this.countLoading.set(false);
          });
      }
    }
  }
}
