import { HttpClient } from '@angular/common/http';
import {
  DestroyRef,
  inject,
  Injectable,
  signal,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

import {
  BehaviorSubject,
  catchError,
  EMPTY,
  finalize,
  map,
  Observable,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';

import { translate } from '@jsverse/transloco';

import { CustomRoute } from '../../app.routes';
import { AppRoutePath, AppRouteValue } from '../../app.routes.enum';
import { KpiType } from '../../feature/demand-validation/model';
import { Region } from '../../feature/global-selection/model';
import { FilterValues } from '../../pages/demand-validation/tables/demand-validation-table/column-definitions';
import {
  DemandValidationSettings,
  DemandValidationTimeRangeUserSettings,
  DemandValidationTimeRangeUserSettingsKey,
  DemandValidationUserSettingsKey,
  UserSettings,
  UserSettingsKey,
} from '../models/user-settings.model';
import { AuthService } from '../utils/auth/auth.service';
import { checkRoles } from '../utils/auth/roles';
import { DateRangePeriod } from '../utils/date-range';
import { SnackbarService } from '../utils/service/snackbar.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly USER_REGION_API = 'api/user/region';
  private readonly http: HttpClient = inject(HttpClient);
  private readonly snackbarService: SnackbarService = inject(SnackbarService);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly USER_SETTINGS_API = 'api/user-settings/general';

  private readonly userRoles = toSignal(this.authService.getUserRoles());

  public readonly region = signal<Region>(null);
  public readonly userSettings: WritableSignal<UserSettings | null> = signal({
    startPage: null,
    demandValidation: null,
  });
  public settingsLoaded$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  public init(): void {
    this.loadRegion()
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe();
    this.loadUserSettings();
  }

  public loadRegion() {
    if (localStorage.getItem('region')) {
      this.region.set(localStorage.getItem('region') as Region);

      return of(localStorage.getItem('region') as Region);
    } else {
      return this.http
        .get(this.USER_REGION_API, {
          responseType: 'text',
        })
        .pipe(
          catchError(() => {
            this.snackbarService.openSnackBar(
              translate('error.loadingConfigurationFailed')
            );

            return of(null);
          }),
          take(1),
          map((value) => {
            this.region.set(value as Region);
            localStorage.setItem('region', value);

            return value as Region;
          }),
          takeUntilDestroyed(this.destroyRef)
        );
    }
  }

  public filterVisibleRoutes(routes: CustomRoute[]): CustomRoute[] {
    // The function menu entries can be hidden in three different ways:
    // 1. have a false visible attribute
    // 2. the user is not located in one of the allowedRegions
    // 3. the user lacks all the permissions that are set in the allowedRoles attribute
    const visibilityFilter = (route: CustomRoute) =>
      (route.visible === undefined || route.visible) &&
      (route.data?.allowedRegions === undefined ||
        (this.region() &&
          route.data?.allowedRegions.includes(this.region()))) &&
      (!route.data?.allowedRoles ||
        checkRoles(this.userRoles() || [], route.data?.allowedRoles));

    return routes?.filter((element) => visibilityFilter(element));
  }

  public updateDemandValidationUserSettings(
    key: keyof DemandValidationSettings,
    value: DemandValidationSettings[keyof DemandValidationSettings]
  ): void {
    const currentSettings =
      this.userSettings()?.[UserSettingsKey.DemandValidation];

    const mergeSettings = <T>(
      settingKey: DemandValidationUserSettingsKey,
      defaultValues: T
    ): T =>
      ({
        ...(currentSettings?.[settingKey] || defaultValues),
        ...(key === settingKey ? value : {}),
      }) as T;

    const workbench = mergeSettings<
      Omit<FilterValues, KpiType.ValidatedForecast>
    >(DemandValidationUserSettingsKey.Workbench, {
      [KpiType.Deliveries]: true,
      [KpiType.FirmBusiness]: true,
      [KpiType.ForecastProposal]: true,
      [KpiType.ForecastProposalDemandPlanner]: true,
      [KpiType.DemandRelevantSales]: true,
      [KpiType.SalesAmbition]: true,
      [KpiType.Opportunities]: true,
      [KpiType.SalesPlan]: true,
    });

    const timeRange = mergeSettings<DemandValidationTimeRangeUserSettings>(
      DemandValidationUserSettingsKey.TimeRange,
      {
        [DemandValidationTimeRangeUserSettingsKey.Type]:
          DateRangePeriod.Monthly,
        [DemandValidationTimeRangeUserSettingsKey.StartDate]: -3,
        [DemandValidationTimeRangeUserSettingsKey.EndDate]: 12,
        [DemandValidationTimeRangeUserSettingsKey.OptionalEndDate]: null,
      }
    );

    this.updateUserSettings(UserSettingsKey.DemandValidation, {
      workbench,
      timeRange,
    });
  }

  public updateUserSettings<UserSettingsKey extends keyof UserSettings>(
    key: UserSettingsKey,
    value: UserSettings[UserSettingsKey]
  ): void {
    this.userSettings.update((settings) => ({ ...settings, [key]: value }));
    this.saveUserSettings();
  }

  private saveUserSettings(): void {
    this.http
      .put(this.USER_SETTINGS_API, this.userSettings())
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  private loadUserSettings(): void {
    this.http
      .get<UserSettings>(this.USER_SETTINGS_API)
      .pipe(
        take(1),
        tap((result) =>
          this.userSettings.update((settings) => ({
            ...settings,
            ...(result || ({} as any)),
          }))
        ),
        switchMap(() => this.getStartPage()),
        finalize(() => this.settingsLoaded$.next(true)),
        catchError(() => EMPTY),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  /*
   * Returns the start-page after the necessary data is loaded from the backend.
   * If the user has configured a start-page this is returned
   * Otherwise the default startpage for the corresponding region is returned.
   */
  public getStartPage(): Observable<AppRouteValue> {
    return of(this.userSettings()).pipe(
      switchMap((settings) =>
        settings?.startPage
          ? of(settings.startPage as AppRouteValue)
          : this.loadRegion().pipe(
              map((region) => {
                const fallBackPage =
                  region === Region.Europe
                    ? AppRoutePath.OverviewPage
                    : AppRoutePath.CustomerMaterialDetailsPage;

                this.userSettings.update((currentSettings) => ({
                  ...currentSettings,
                  [UserSettingsKey.StartPage]: fallBackPage,
                }));

                return fallBackPage;
              })
            )
      ),
      takeUntilDestroyed(this.destroyRef)
    );
  }
}
