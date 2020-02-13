import { Observable } from 'rxjs';

import { Component, OnInit } from '@angular/core';

import { Icon } from '@schaeffler/shared/ui-components';

import { DataStoreService } from './services/data-store.service';

@Component({
  selector: 'sta-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {
  public tags$: Observable<string[]>;
  public translation$: Observable<string>;
  public appIcon = new Icon('format_quote', true);

  constructor(private readonly dataStore: DataStoreService) {}

  public ngOnInit(): void {
    this.setObservables();
  }

  public reset(): void {
    this.dataStore.reset();
  }

  private setObservables(): void {
    this.tags$ = this.dataStore.tags$;
    this.translation$ = this.dataStore.translation$;
  }
}
