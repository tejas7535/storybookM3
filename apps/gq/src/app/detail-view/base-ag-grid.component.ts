import {
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';

import { Observable } from 'rxjs';

import { AgGridLocale } from '@gq/shared/ag-grid/models/ag-grid-locale.interface';
import { LocalizationService } from '@gq/shared/ag-grid/services';
import { AgGridStateService } from '@gq/shared/services/ag-grid-state/ag-grid-state.service';
import {
  ColumnEvent,
  ColumnState,
  GridReadyEvent,
  SortChangedEvent,
} from 'ag-grid-enterprise';

@Component({ standalone: true, template: '' })
export abstract class BaseAgGridComponent implements OnInit, OnDestroy {
  protected abstract TABLE_KEY: string;
  destroyRef = inject(DestroyRef);
  localeText$: Observable<AgGridLocale>;

  protected readonly agGridStateService: AgGridStateService =
    inject(AgGridStateService);

  protected readonly localizationService: LocalizationService =
    inject(LocalizationService);

  ngOnInit(): void {
    this.localeText$ = this.localizationService.locale$;
    this.agGridStateService.init(this.TABLE_KEY);
    this.agGridStateService.setActiveView(0);
  }

  ngOnDestroy(): void {
    this.agGridStateService.saveUserSettings();
  }

  onGridReady(event: GridReadyEvent): void {
    const state = this.agGridStateService.getColumnStateForCurrentView();
    if (state) {
      event.api.applyColumnState({ state, applyOrder: true });
    }
  }

  public onColumnChange(event: SortChangedEvent | ColumnEvent): void {
    const columnState: ColumnState[] = event.api.getColumnState();

    this.agGridStateService.setColumnStateForCurrentView(columnState);
  }
}
