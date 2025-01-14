/* eslint-disable max-lines */
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { LetDirective, PushPipe } from '@ngrx/component';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { MaterialClass, NavigationLevel } from '@mac/msd/constants';
import { DataFacade } from '@mac/msd/store/facades/data';

import { ActiveNavigationLevel } from '../../../models';
import { MsdAgGridStateService } from '../../../services';

/* eslint-disable max-lines */
@Component({
  selector: 'mac-msd-navigation',
  templateUrl: './msd-navigation.component.html',
  standalone: true,
  imports: [
    // default
    CommonModule,
    // angular material
    MatListModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    // libs
    SharedTranslocoModule,
    // ngrx
    PushPipe,
    LetDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MsdNavigationComponent implements OnInit, OnChanges {
  @Input() activeNavigationLevel: ActiveNavigationLevel;

  public navigationLevels = [
    NavigationLevel.MATERIAL,
    NavigationLevel.SUPPLIER,
    NavigationLevel.STANDARD,
  ];

  public materialClasses$ = this.dataFacade.materialClassOptions$;
  public navigation$ = this.dataFacade.navigation$;
  public hasEditorRole$ = this.dataFacade.hasEditorRole$;

  public minimized = false;

  constructor(
    private readonly dataFacade: DataFacade,
    private readonly msdAgGridStateService: MsdAgGridStateService,
    private readonly applicationInsightsService: ApplicationInsightsService
  ) {}

  public ngOnInit(): void {
    if (!this.activeNavigationLevel) {
      this.activeNavigationLevel =
        this.msdAgGridStateService.getLastActiveNavigationLevel();
    }

    this.updateNavigationLevel(this.activeNavigationLevel, false);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.activeNavigationLevel && this.activeNavigationLevel) {
      this.updateNavigationLevel(this.activeNavigationLevel);
    }
  }

  public setActive(
    materialClass: MaterialClass,
    navigationLevel = NavigationLevel.MATERIAL
  ): void {
    this.updateNavigationLevel({ materialClass, navigationLevel });
  }

  public toggleSideBar() {
    this.minimized = !this.minimized;
  }

  public hasNavigationLevels(materialClass: MaterialClass): boolean {
    return ![MaterialClass.SAP_MATERIAL, MaterialClass.VITESCO].includes(
      materialClass
    );
  }

  private updateNavigationLevel(
    active: ActiveNavigationLevel,
    storeInSessionStorage = true
  ) {
    // set event for AppInsights
    this.applicationInsightsService.logEvent(
      `[MAC - MSD] SELECTED NAVIGATION LEVEL`,
      { ...active }
    );
    // dispatch event and store
    this.dataFacade.setNavigation(active.materialClass, active.navigationLevel);
    if (storeInSessionStorage) {
      this.msdAgGridStateService.storeActiveNavigationLevel({ ...active });
    }
  }
}
