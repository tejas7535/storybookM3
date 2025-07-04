import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  output,
  QueryList,
  Signal,
  signal,
  untracked,
  ViewChildren,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { filter, map, take, tap } from 'rxjs';

import { translate } from '@jsverse/transloco';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { PushPipe } from '@ngrx/component';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { GlobalSelectionHelperService } from '../../../../feature/global-selection/global-selection.service';
import { SelectableOptionsService } from '../../../services/selectable-options.service';
import { SnackbarService } from '../../../utils/service/snackbar.service';
import { MultiAutocompletePreLoadedComponent } from '../../inputs/autocomplete/multi-autocomplete-pre-loaded/multi-autocomplete-pre-loaded.component';
import { DisplayFunctions } from '../../inputs/display-functions.utils';
import { StyledSectionComponent } from '../../styled-section/styled-section.component';
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
  selector: 'd360-global-selection-criteria',
  imports: [
    MinimizedGlobalSelectionCriteriaComponent,
    SharedTranslocoModule,
    OnTypeAutocompleteWithMultiselectComponent,
    PreLoadedAutocompleteWithMultiselectComponent,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    PushPipe,
    LoadingSpinnerModule,
    MatTooltipModule,
    MultiAutocompletePreLoadedComponent,
    StyledSectionComponent,
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

  @ViewChildren(MultiAutocompletePreLoadedComponent)
  private readonly preLoadedComponents!: QueryList<MultiAutocompletePreLoadedComponent>;

  @ViewChildren(PreLoadedAutocompleteWithMultiselectComponent)
  private readonly preLoadedWithMultiselectComponents!: QueryList<PreLoadedAutocompleteWithMultiselectComponent>;

  /**
   * The SnackBarService instance.
   *
   * @private
   * @type {SnackbarService}
   * @memberof GlobalSelectionCriteriaComponent
   */
  private readonly snackbarService: SnackbarService = inject(SnackbarService);

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
      ? translate('globalSelection.dropdown.loading', {})
      : `${this.translocoLocaleService.localizeNumber(this.count(), 'decimal', this.translocoLocaleService.getLocale())}  ${translate('globalSelection.results', {})}`
  );

  // Display functions
  protected readonly displayFnId = DisplayFunctions.displayFnId;
  protected readonly displayFnUnited = DisplayFunctions.displayFnUnited;
  protected readonly displayFnText = DisplayFunctions.displayFnText;

  protected readonly searchControls = new FormGroup({
    region: new FormControl(''),
    salesArea: new FormControl(''),
    sectorManagement: new FormControl(''),
    materialClassification: new FormControl(''),
    alertTypes: new FormControl(''),
  });

  /**
   * @inheritdoc
   */
  public ngOnInit(): void {
    this.isCollapsed.set(!this.globalSelectionStateService.isEmpty());

    // inform other components
    this.onGlobalSelectionChange.emit(this.getFilters());

    // load count
    this.loadCount();

    // handle open tasks logic
    this.handleTasks();
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
      this.snackbarService.warning(
        translate('globalSelection.selection_empty')
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

    // reset the options in the pre-loaded components
    this.preLoadedComponents?.forEach((component) => component?.onClear?.());
    this.preLoadedWithMultiselectComponents?.forEach((component) =>
      component?.onClear?.()
    );
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
    } else if (!untracked(() => this.countLoading())) {
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

  /**
   * Enables / disables the tasks dropdown based on found options.
   *
   * @private
   * @memberof GlobalSelectionCriteriaComponent
   */
  private handleTasks(): void {
    this.selectableOptionsService.loading$
      .pipe(
        filter((loading) => !loading),
        map(
          () =>
            this.selectableOptionsService.get('alertTypes')?.options?.length > 0
        ),
        tap((hasOptions: boolean) => {
          if (hasOptions) {
            this.globalForm.controls.alertType.enable();
          } else {
            this.globalForm.controls.alertType.disable();
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
}
