/* eslint-disable @typescript-eslint/member-ordering */
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';

import { CalculationSelectionFacade } from '@mm/core/store/facades/calculation-selection/calculation-selection.facade';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { StringOption } from '@schaeffler/inputs';
import { SearchModule } from '@schaeffler/inputs/search';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { BEARING } from '../../shared/constants/tracking-names';
import { BearingOption } from '../../shared/models';
@Component({
  imports: [SearchModule, SharedTranslocoModule],
  selector: 'mm-bearing-search',
  templateUrl: './bearing-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BearingSearchComponent {
  @Input() public selectedBearing?: BearingOption;
  @Output() public bearing = new EventEmitter<string | undefined>();

  private readonly calculationSelectionFacade = inject(
    CalculationSelectionFacade
  );
  private readonly applicationInsightsService = inject(
    ApplicationInsightsService
  );

  public myControl = new FormControl<string>('');

  public bearingSelectionLoading = toSignal(
    this.calculationSelectionFacade.isLoading$,
    { initialValue: false }
  );

  public readonly bearingResultList = toSignal(
    this.calculationSelectionFacade.bearingResultList$,
    { initialValue: undefined }
  );

  public bearingOptions = computed(() => {
    const bearingDesignation = this.bearingResultList();
    if (!bearingDesignation) {
      return [];
    }

    return bearingDesignation.map((result) => ({
      id: result.id,
      title: result.title,
    }));
  });

  private readonly minimumChars = 2;

  public getBearings(searchQuery: string): void {
    if (searchQuery?.length >= this.minimumChars) {
      this.calculationSelectionFacade.searchBearing(searchQuery);
    } else {
      this.calculationSelectionFacade.resetBearingSelection();
    }
  }

  public onOptionSelected(selection: StringOption): void {
    if (selection) {
      const { id, title } = selection;
      const bearingId = id as string;
      this.trackBearingSelection(title, bearingId);
      this.bearing.emit(bearingId);
    }
  }

  public trackBearingSelection(bearing: string, selectionId: string): void {
    this.applicationInsightsService.logEvent(BEARING, {
      name: bearing,
      id: selectionId,
    });
  }
}
