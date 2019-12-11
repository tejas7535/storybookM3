import { filter, map } from 'rxjs/operators';

import { Component, Input, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  PRIMARY_OUTLET,
  Router
} from '@angular/router';

import { BreadcrumbItem } from './models/breadcrumb-item.model';

@Component({
  selector: 'sta-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {
  @Input() public home = '/';

  public breadcrumb = [];

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router
  ) {}

  public ngOnInit(): void {
    this.handleActiveRoute();
  }

  /**
   * Helps Angular to track array
   */
  public trackByFn(index): number {
    return index;
  }

  /**
   * Adds current route to breadcrumb.
   */
  private handleActiveRoute(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .pipe(map(() => this.activatedRoute))
      .pipe(
        map(route => {
          let leaf = route;
          while (leaf.firstChild) {
            leaf = leaf.firstChild;
          }

          return leaf;
        })
      )
      .pipe(filter(route => route.outlet === PRIMARY_OUTLET))
      .subscribe(route => {
        const snapshot = this.router.routerState.snapshot;
        // TODO: that is only working for levl 1 breadcrumbs
        this.breadcrumb = [];
        const url = snapshot.url;

        if (url !== this.home) {
          const routeData = route.snapshot.data;

          const label = routeData['breadcrumb'];
          this.breadcrumb.push(new BreadcrumbItem(url, label));
        }
      });
  }
}
