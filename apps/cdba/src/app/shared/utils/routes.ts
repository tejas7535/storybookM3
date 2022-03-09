import { Params } from '@angular/router';

import { AppRoutePath } from '@cdba/app-route-path.enum';

export const checkQueryParamsEquality = (
  queryParams1: Params,
  queryParams2: Params
): boolean => JSON.stringify(queryParams1) === JSON.stringify(queryParams2);

export const isSearchRoute = (path: string): boolean =>
  !!path.split('/')[1]?.includes(AppRoutePath.SearchPath);

export const isResultsRoute = (path: string): boolean =>
  !!path.split('/')[1]?.includes(AppRoutePath.ResultsPath);

export const isDetailRoute = (path: string): boolean =>
  !!path.split('/')[1]?.includes(AppRoutePath.DetailPath);

export const isCompareRoute = (path: string): boolean =>
  !!path.split('/')[1]?.includes(AppRoutePath.ComparePath);

export const isPortfolioAnalysisRoute = (path: string): boolean =>
  !!path.split('/')[1]?.includes(AppRoutePath.PortfolioAnalysisPath);
