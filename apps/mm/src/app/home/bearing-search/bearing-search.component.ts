import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

import { map, Observable, of, tap } from 'rxjs';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { StringOption } from '@schaeffler/inputs';
import { SearchModule } from '@schaeffler/inputs/search';
import { SearchAutocompleteModule } from '@schaeffler/search-autocomplete';

import { BEARING } from '../../shared/constants/tracking-names';
import { BearingOption, SearchEntry } from '../../shared/models';
import { SharedModule } from '../../shared/shared.module';
import { RestService } from './../../core/services/rest/rest.service';
@Component({
  standalone: true,
  imports: [SharedModule, SearchAutocompleteModule, SearchModule],
  selector: 'mm-bearing-search',
  templateUrl: './bearing-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BearingSearchComponent {
  @Input() public selectedBearing?: BearingOption;
  @Output() public bearing = new EventEmitter<string | undefined>();

  public myControl = new UntypedFormControl('');
  public options$: Observable<StringOption[]> = of([]);
  public loading = false;

  public constructor(
    private readonly restService: RestService,
    private readonly applicationInsightsService: ApplicationInsightsService
  ) {}

  public getBearings(searchQuery: string): void {
    if (searchQuery) {
      this.loading = true;

      this.options$ = this.restService.getBearingSearch(searchQuery).pipe(
        map((response) =>
          response.data.map(({ data: { title, id } }: SearchEntry) => ({
            title,
            id,
          }))
        ),
        tap(() => (this.loading = false))
      );
    } else {
      this.options$ = of([]);
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
