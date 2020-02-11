import { Subject } from 'rxjs';

import { Component, OnDestroy, OnInit } from '@angular/core';

import { RestService } from '../../../core/services/rest.service';

import { Extension } from '../extension/extension.model';

@Component({
  selector: 'schaeffler-steel-overview',
  templateUrl: './overview.component.html'
})
export class OverviewComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<boolean> = new Subject();

  extensions: Extension[];

  constructor(private readonly restService: RestService) {}

  ngOnInit(): void {
    this.restService
      .getExtensions()
      .subscribe((extensions: Extension[]) => (this.extensions = extensions));
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  /**
   * Helps Angular to track array
   */
  public trackByFn(index: number): number {
    return index;
  }
}
