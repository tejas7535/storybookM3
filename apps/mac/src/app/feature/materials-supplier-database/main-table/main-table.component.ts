import { CommonModule, DatePipe } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';

import { Subject } from 'rxjs';

import { LetDirective, PushPipe } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { MaterialClass, NavigationLevel } from '@mac/msd/constants';
import { ActiveNavigationLevel } from '@mac/msd/models';
import { DataFacade } from '@mac/msd/store/facades/data';

import { MsdAgGridStateService, MsdDialogService } from '../services';
import { QuickFilterFacade } from '../store/facades/quickfilter';
import { MsdNavigationComponent } from './components/msd-navigation/msd-navigation.component';
import { RawMaterialControlPanelComponent } from './control-panel/raw-material-control-panel/raw-material-control-panel.component';
import { SapMaterialControlPanelComponent } from './control-panel/sap-material-control-panel/sap-material-control-panel.component';
import { VitescoMaterialControlPanelComponent } from './control-panel/vitesco-material-control-panel/vitesco-material-control-panel.component';
import { RawMaterialDatagridComponent } from './datagrid/raw-material-datagrid/raw-material-datagrid.component';
import { SapMaterialDatagridComponent } from './datagrid/sap-material-datagrid/sap-material-datagrid.component';
import { VitescoMaterialDatagridComponent } from './datagrid/vitesco-material-datagrid/vitesco-material-datagrid.component';
import { QuickFilterComponent } from './quick-filter/quick-filter.component';
import { QuickFilterManagementComponent } from './quick-filter/quick-filter-management/quick-filter-management.component';

@Component({
  selector: 'mac-main-table',
  templateUrl: './main-table.component.html',
  standalone: true,
  imports: [
    // default
    CommonModule,
    // msd
    MsdNavigationComponent,
    QuickFilterComponent,
    QuickFilterManagementComponent,
    SapMaterialDatagridComponent,
    VitescoMaterialDatagridComponent,
    RawMaterialDatagridComponent,
    RawMaterialControlPanelComponent,
    SapMaterialControlPanelComponent,
    VitescoMaterialControlPanelComponent,
    // angular material
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    // libs
    SharedTranslocoModule,
    // ngrx
    PushPipe,
    LetDirective,
  ],
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainTableComponent implements OnInit, OnDestroy, AfterViewInit {
  public activeNavigationLevel: ActiveNavigationLevel;
  public navigation$ = this.dataFacade.navigation$;
  public quickFilterManagementTabActive = false;

  public optionsLoading$ = this.dataFacade.optionsLoading$;
  public resultLoading$ = this.dataFacade.resultLoading$;
  public quickFiltersLoading$ = this.quickFilterFacade.isLoading$;
  public destroy$ = new Subject<void>();

  public constructor(
    private readonly dataFacade: DataFacade,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly quickFilterFacade: QuickFilterFacade,
    private readonly dialogService: MsdDialogService,
    private readonly stateService: MsdAgGridStateService
  ) {}

  public ngOnInit(): void {
    this.dataFacade.fetchClassOptions();
    // open disclaimer dialog if after timeout
    if (Date.now() > this.stateService.getDisclaimerConsentTimeout()) {
      this.dialogService.openDisclaimerDialog();
    }
  }

  public ngAfterViewInit(): void {
    this.parseQueryParams();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private parseQueryParams(): void {
    const materialClass: MaterialClass = this.route.snapshot.queryParamMap.get(
      'materialClass'
    ) as MaterialClass;
    const navigationLevel: NavigationLevel =
      this.route.snapshot.queryParamMap.get(
        'navigationLevel'
      ) as NavigationLevel;
    const agGridFilterString =
      this.route.snapshot.queryParamMap.get('agGridFilter');

    if (materialClass && navigationLevel) {
      this.activeNavigationLevel = {
        materialClass,
        navigationLevel,
      };
    }
    if (agGridFilterString) {
      this.setParamAgGridFilter(agGridFilterString);
    }

    this.router.navigate([], { relativeTo: this.route, queryParams: {} });
    this.changeDetectorRef.markForCheck();
    this.changeDetectorRef.detectChanges();
  }

  private setParamAgGridFilter(filterModelString: string): void {
    const filterModel = JSON.parse(filterModelString);
    if (!filterModel) {
      return;
    }
    this.dataFacade.setAgGridFilter(filterModel);
  }
}
