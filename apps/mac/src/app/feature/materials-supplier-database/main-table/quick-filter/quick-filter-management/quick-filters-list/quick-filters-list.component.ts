import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';

import { debounceTime, fromEvent, Subject, takeUntil } from 'rxjs';

import { QuickFiltersListConfig } from './quick-filters-list-config.model';

export interface TableConfig {
  headersTranslationKeySuffixes: string[];
  dataFields: string[];
}

@Component({
  selector: 'mac-quick-filters-list',
  templateUrl: './quick-filters-list.component.html',
})
export class QuickFiltersListComponent implements AfterViewInit, OnDestroy {
  @ViewChild('searchField') searchField: ElementRef<HTMLInputElement>;

  private _config: QuickFiltersListConfig;

  private readonly defaultTableConfig: TableConfig = {
    headersTranslationKeySuffixes: ['title', 'description', 'actions'],
    dataFields: ['title', 'description'],
  };

  private readonly SEARCH_DEBOUNCE_TIME = 500;

  private readonly destroy$ = new Subject<void>();

  get config(): QuickFiltersListConfig {
    return this._config;
  }

  @Input()
  set config(config: QuickFiltersListConfig) {
    this._config = !config.tableConfig
      ? {
          ...config,
          tableConfig: this.defaultTableConfig,
        }
      : config;
  }

  ngAfterViewInit(): void {
    if (this.config.searchable) {
      // Without debounce search() is executed after typing of every single character!
      fromEvent<InputEvent>(this.searchField.nativeElement, 'input')
        .pipe(takeUntil(this.destroy$), debounceTime(this.SEARCH_DEBOUNCE_TIME))
        .subscribe((inputEvent: InputEvent) => {
          const inputFieldValue = (
            inputEvent.target as HTMLInputElement
          ).value.trim();

          this.config.search?.(inputFieldValue);
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
