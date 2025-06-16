import {
  Component,
  computed,
  ElementRef,
  inject,
  Signal,
  signal,
  ViewChild,
} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

import { SelectModule } from '@schaeffler/inputs/select';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CalculationParametersFacade } from '@ga/core/store';
import {
  defaultPreferredGreaseOption,
  emptyPreferredGreaseOptionId,
} from '@ga/shared/constants';
import {
  GreaseCategoryEntry,
  GreaseCategoryWithEntries,
  PreferredGreaseOption,
} from '@ga/shared/models';

@Component({
  selector: 'ga-preferred-grease-selection',
  imports: [
    SharedTranslocoModule,
    MatIconModule,
    MatSelectModule,
    MatTooltipModule,
    SelectModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './preferred-grease-selection.component.html',
})
export class PreferredGreaseSelectionComponent {
  private readonly parametersFacade = inject(CalculationParametersFacade);

  public defaultOption = defaultPreferredGreaseOption;

  public preferredGrease = this.parametersFacade.preferredGrease;
  public allGreases = this.parametersFacade.allGreases;
  public isDisabled = this.parametersFacade.isPreselectionDisabled;

  public searchTerm = signal('');

  public filteredGreases: Signal<GreaseCategoryWithEntries[]> = computed(() => {
    const greaseCategories = this.allGreases();
    const search = this.searchTerm().toLowerCase();
    const preferredGrease = this.preferredGrease();
    if (!search) {
      return greaseCategories;
    }

    return greaseCategories
      .map((category: GreaseCategoryWithEntries) => {
        const filteredEntries = category.entries.filter(
          (entry: GreaseCategoryEntry) =>
            entry.text.toLowerCase().includes(search) ||
            (preferredGrease?.selectedGrease &&
              this.compareOptions(entry, preferredGrease.selectedGrease))
        );

        return {
          ...category,
          entries: filteredEntries,
        };
      })
      .filter(
        (category: GreaseCategoryWithEntries) => category.entries.length > 0
      );
  });

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  public onPreferredGreaseSelectionChange(
    selectedGrease: PreferredGreaseOption
  ): void {
    this.parametersFacade.setSelectedGrease(selectedGrease);
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
        !option?.id?.toString().includes(emptyPreferredGreaseOptionId)
    );

  public onKey(event: any): void {
    // Prevent default action for Enter key to avoid form submission
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  }

  public onSelectOpened(): void {
    if (this.searchInput) {
      setTimeout(() => {
        this.searchInput.nativeElement.focus();
      }, 0);
    }
  }

  public onSelectClosed(): void {
    this.searchTerm.set('');
  }

  public onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
  }
}
