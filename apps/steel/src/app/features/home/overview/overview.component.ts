import { Subscription } from 'rxjs';

import { Component, OnDestroy, OnInit } from '@angular/core';

import { RestService } from '../../../core/services/rest.service';

import { Extension } from '../extension/extension.model';

@Component({
  selector: 'schaeffler-steel-overview',
  templateUrl: './overview.component.html'
})
export class OverviewComponent implements OnInit, OnDestroy {
  extensions: Extension[];
  public readonly subscription: Subscription = new Subscription();

  constructor(private readonly restService: RestService) {}

  public ngOnInit(): void {
    this.subscription.add(
      this.restService
        .getExtensions()
        .subscribe((extensions: Extension[]) => (this.extensions = extensions))
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Helps Angular to track array
   */
  public trackByFn(index: number): number {
    return index;
  }
}
