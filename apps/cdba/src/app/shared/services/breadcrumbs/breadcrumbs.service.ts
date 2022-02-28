import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';

import { merge, Observable } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  mapTo,
  withLatestFrom,
} from 'rxjs/operators';

import { AppRoutePath } from '@cdba/app-route-path.enum';
import {
  getMaterialDesignation,
  getMaterialDesignationOfSelectedRefType,
  getResultCount,
} from '@cdba/core/store';
import { getEnv } from '@cdba/environments/environment.provider';
import { ScrambleMaterialDesignationPipe } from '@cdba/shared/pipes';
import { translate } from '@ngneat/transloco';
import { ComponentStore } from '@ngrx/component-store';
import { concatLatestFrom } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { Breadcrumb } from '@schaeffler/breadcrumbs';

export interface BreadcrumbState {
  items: Breadcrumb[];
}

interface RouteProps {
  url: string;
  queryParams: Params;
}

const initialState = () => ({
  items: [
    {
      label: translate('shared.breadcrumbs.search'),
      url: '/search',
      queryParams: {},
    },
  ],
});

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbsService extends ComponentStore<BreadcrumbState> {
  scrambleMaterialDesignationPipe: ScrambleMaterialDesignationPipe =
    new ScrambleMaterialDesignationPipe(getEnv());

  public constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute
  ) {
    super(initialState());

    const { url, queryParams } = this.extractCurrentRouteProps();

    const isDetailRoute = this.isDetailRoute(url);
    const isCompareRoute = this.isCompareRoute(url);

    if (isDetailRoute) {
      this.setDetailBreadcrumb({
        url,
        queryParams,
        label: translate('shared.breadcrumbs.detail'),
      });
    } else if (isCompareRoute) {
      this.setCompareBreadcrumb({
        url,
        queryParams,
        label: translate('shared.breadcrumbs.compare'),
      });
    }

    this.resetBreadcrumbItems(this.search$);
    this.updateMaterialDesignation(this.materialDesignation$);
    this.setResultsBreadcrumb(this.resultsBreadcrumb$);
    this.setDetailBreadcrumb(this.detailBreadcrumbs$);
    this.setCompareBreadcrumb(this.compareBreadcrumbs$);
    this.setPortfolioAnalysisBreadcrumb(this.portfolioAnalysisBreadcrumbs$);
  }

  private readonly routeProps$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    map(() => this.extractCurrentRouteProps())
  );

  private readonly materialDesignation$: Observable<string> = merge(
    this.store.select(getMaterialDesignationOfSelectedRefType),
    this.store.select(getMaterialDesignation)
  ).pipe(
    filter((materialDesignation) => materialDesignation !== undefined),
    distinctUntilChanged()
  );

  private readonly resultsBreadcrumb$: Observable<Breadcrumb> =
    this.routeProps$.pipe(
      filter((route) => this.isResultsRoute(route.url)),
      concatLatestFrom(() => this.store.select(getResultCount)),
      map(([{ url, queryParams }, resultCount]) => ({
        url,
        queryParams,
        label: `${translate('shared.breadcrumbs.results')} (${resultCount})`,
      }))
    );

  private readonly search$: Observable<boolean> = this.routeProps$.pipe(
    filter((route) => this.isSearchRoute(route.url)),
    mapTo(true)
  );

  private readonly detailBreadcrumbs$: Observable<Breadcrumb> =
    this.routeProps$.pipe(
      filter((route) => this.isDetailRoute(route.url)),
      withLatestFrom(this.materialDesignation$),
      map(([{ url, queryParams }, materialDesignation]) => ({
        url,
        queryParams,
        label: materialDesignation
          ? this.scrambleMaterialDesignationPipe.transform(
              materialDesignation,
              0
            )
          : translate('shared.breadcrumbs.detail'),
      }))
    );

  private readonly compareBreadcrumbs$: Observable<Breadcrumb> =
    this.routeProps$.pipe(
      filter((route) => this.isCompareRoute(route.url)),
      map(({ url, queryParams }) => ({
        url,
        queryParams,
        label: translate('shared.breadcrumbs.compare'),
      }))
    );

  private readonly portfolioAnalysisBreadcrumbs$: Observable<Breadcrumb> =
    this.routeProps$.pipe(
      filter((route) => this.isPortfolioAnalysisRoute(route.url)),
      map(({ url, queryParams }) => ({
        url,
        queryParams,
        label: translate('shared.breadcrumbs.portfolioAnalysis'),
      }))
    );

  public readonly breadcrumbs$: Observable<Breadcrumb[]> = this.select(
    (state) => {
      const breadcrumbs = [...state.items];

      const lastElement: Breadcrumb = { ...breadcrumbs.pop() };
      lastElement.url = undefined;

      return [...breadcrumbs, lastElement];
    }
  );

  public readonly setResultsBreadcrumb = this.updater(
    (state, breadcrumb: Breadcrumb): BreadcrumbState =>
      this.addBreadcrumb(state, breadcrumb)
  );

  public readonly setCompareBreadcrumb = this.updater(
    (state, compareBreadcrumb: Breadcrumb): BreadcrumbState => {
      const lastItem = state.items[state.items.length - 1];
      if (
        this.isCompareRoute(lastItem.url) &&
        this.checkQueryParamsEquality(
          lastItem.queryParams,
          compareBreadcrumb.queryParams
        )
      ) {
        // just update the link
        const items = [...state.items];

        const lastElement: Breadcrumb = { ...items.pop() };
        lastElement.url = compareBreadcrumb.url;

        return { items: [...items, lastElement] };
      }

      return this.addBreadcrumb(state, compareBreadcrumb);
    }
  );

  public readonly setPortfolioAnalysisBreadcrumb = this.updater(
    (state, breadcrumb: Breadcrumb): BreadcrumbState =>
      this.addBreadcrumb(state, breadcrumb)
  );

  public readonly updateMaterialDesignation = this.updater(
    (state, materialDesignation: string): BreadcrumbState => {
      const lastItem = state.items[state.items.length - 1];

      if (this.isDetailRoute(lastItem.url)) {
        // just update the link
        const items = [...state.items];

        const lastElement: Breadcrumb = { ...items.pop() };
        lastElement.label = this.scrambleMaterialDesignationPipe.transform(
          materialDesignation,
          0
        );

        return { items: [...items, lastElement] };
      }

      return state;
    }
  );

  public readonly setDetailBreadcrumb = this.updater(
    (state, detailBreadcrumb: Breadcrumb): BreadcrumbState => {
      const lastItem = state.items[state.items.length - 1];
      if (
        this.isDetailRoute(lastItem.url) &&
        this.checkQueryParamsEquality(
          lastItem.queryParams,
          detailBreadcrumb.queryParams
        )
      ) {
        // just update the link
        const items = [...state.items];

        const lastElement: Breadcrumb = { ...items.pop() };
        lastElement.url = detailBreadcrumb.url;

        return { items: [...items, lastElement] };
      }

      return this.addBreadcrumb(state, detailBreadcrumb);
    }
  );

  public readonly resetBreadcrumbItems = this.updater(
    (_state, _bool: boolean): BreadcrumbState => initialState()
  );

  private readonly extractCurrentRouteProps = (): RouteProps => ({
    url: this.router.routerState.snapshot.url.split('?')[0],
    queryParams: this.activatedRoute.snapshot.queryParams,
  });

  private readonly checkQueryParamsEquality = (
    queryParams1: Params,
    queryParams2: Params
  ): boolean => JSON.stringify(queryParams1) === JSON.stringify(queryParams2);

  private readonly isSearchRoute = (path: string): boolean =>
    !!path.split('/')[1]?.includes(AppRoutePath.SearchPath);

  private readonly isResultsRoute = (path: string): boolean =>
    !!path.split('/')[1]?.includes(AppRoutePath.ResultsPath);

  private readonly isDetailRoute = (path: string): boolean =>
    !!path.split('/')[1]?.includes(AppRoutePath.DetailPath);

  private readonly isCompareRoute = (path: string): boolean =>
    !!path.split('/')[1]?.includes(AppRoutePath.ComparePath);

  private readonly isPortfolioAnalysisRoute = (path: string): boolean =>
    !!path.split('/')[1]?.includes(AppRoutePath.PortfolioAnalysisPath);

  private readonly addBreadcrumb = (
    state: BreadcrumbState,
    breadcrumb: Breadcrumb
  ): BreadcrumbState => {
    const index = state.items.findIndex(
      (item) =>
        item.url === breadcrumb.url &&
        this.checkQueryParamsEquality(item.queryParams, breadcrumb.queryParams)
    );

    const items =
      index === -1
        ? [...state.items, breadcrumb]
        : state.items.slice(0, index + 1);

    return { ...state, items };
  };
}
