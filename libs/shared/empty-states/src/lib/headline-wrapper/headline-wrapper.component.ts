import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';

import { filter } from 'rxjs/operators';

@Component({
  selector: 'schaeffler-headline-wrapper',
  templateUrl: './headline-wrapper.component.html'
})
export class HeadlineWrapperComponent implements OnInit {
  public currentRouteTitle: string;

  constructor(
    private readonly router: Router,
    private readonly cdrf: ChangeDetectorRef
  ) {}

  /**
   * Subscription to routeChanges
   */
  public ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof ActivationEnd))
      .subscribe((event: ActivationEnd) => {
        this.currentRouteTitle = event.snapshot.data.title;
        this.cdrf.detectChanges();
      });
  }
}
