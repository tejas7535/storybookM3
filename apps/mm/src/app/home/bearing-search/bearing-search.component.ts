import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

import { map, Observable } from 'rxjs';

import { CalculationSelectionFacade } from '@mm/core/store/facades/calculation-selection/calculation-selection.facade';
import { PushPipe } from '@ngrx/component';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { StringOption } from '@schaeffler/inputs';
import { SearchModule } from '@schaeffler/inputs/search';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { BEARING } from '../../shared/constants/tracking-names';
import { BearingOption } from '../../shared/models';
@Component({
  standalone: true,
  imports: [SearchModule, PushPipe, SharedTranslocoModule],
  selector: 'mm-bearing-search',
  templateUrl: './bearing-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BearingSearchComponent {
  @Input() public selectedBearing?: BearingOption;
  @Output() public bearing = new EventEmitter<string | undefined>();

  public myControl = new UntypedFormControl('');

  public bearingSelectionLoading$ = this.calculationSelectionFacade.isLoading$;

  public bearingResultList$: Observable<StringOption[]> =
    this.calculationSelectionFacade.bearingResultList$.pipe(
      map((bearingDesignation) => {
        if (!bearingDesignation) {
          return [];
        }
        const options: StringOption[] = bearingDesignation.map((result) => ({
          id: result.id,
          title: result.title,
        }));

        return options;
      })
    );

  private readonly minimumChars = 2;

  public constructor(
    private readonly calculationSelectionFacade: CalculationSelectionFacade,
    private readonly applicationInsightsService: ApplicationInsightsService,
    private readonly changeDetector: ChangeDetectorRef
  ) {}

  public getBearings(searchQuery: string): void {
    if (searchQuery?.length >= this.minimumChars) {
      this.calculationSelectionFacade.searchBearing(searchQuery);
      this.changeDetector.detectChanges();
    } else {
      this.calculationSelectionFacade.resetBearingSelection();
    }
  }

  public onOptionSelected(selection: StringOption): void {
    if (selection) {
      const { id, title } = selection;
      this.trackBearingSelection(title, id as string);
      this.bearing.emit(id as string);
    }
  }

  public trackBearingSelection(bearing: string, selectionId: string): void {
    this.applicationInsightsService.logEvent(BEARING, {
      name: bearing,
      id: selectionId,
    });
  }
}
