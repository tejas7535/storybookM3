import { ComponentFixture } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { TeamMemberDialogComponent } from '../../organizational-view/org-chart/team-member-dialog/team-member-dialog.component';
import { TeamMemberDialogModule } from '../../organizational-view/org-chart/team-member-dialog/team-member-dialog.module';
import { FilterKey } from '../../shared/models';
import { SharedPipesModule } from '../../shared/pipes/shared-pipes.module';
import { SharedModule } from '../../shared/shared.module';
import { initialState } from '../store';
import { DoughnutChartModule } from './doughnut-chart/doughnut-chart.module';
import { DoughnutConfig } from './doughnut-chart/models/doughnut-config.model';
import { DoughnutSeriesConfig } from './doughnut-chart/models/doughnut-series-config.model';
import { EntriesExitsComponent } from './entries-exits.component';

describe('EntriesExitsComponent', () => {
  let component: EntriesExitsComponent;
  let spectator: Spectator<EntriesExitsComponent>;
  let fixture: ComponentFixture<EntriesExitsComponent>;

  const createComponent = createComponentFactory({
    component: EntriesExitsComponent,
    detectChanges: false,
    providers: [
      provideMockStore({
        ...initialState,
        initialState: {
          overview: {
            fluctuationRates: {
              data: {
                employees: [],
              },
              loading: false,
              errorMessage: undefined,
            },
          },
          filter: {
            selectedFilters: {
              ids: [FilterKey.ORG_UNIT],
              entities: {
                orgUnit: {
                  name: FilterKey.ORG_UNIT,
                  value: 'Schaeffler_IT_1',
                },
              },
            },
          },
        },
      }),
    ],
    imports: [
      SharedModule,
      DoughnutChartModule,
      provideTranslocoTestingModule({ en: {} }),
      MatDialogModule,
      TeamMemberDialogModule,
      MatIconModule,
      SharedPipesModule,
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    fixture = spectator.fixture;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set data', () => {
    component.entriesDoughnutConfig = new DoughnutConfig(
      'Demo Entries',
      [new DoughnutSeriesConfig(23, 'entries')],
      ['time [s]']
    );
    component.exitsDoughnutConfig = new DoughnutConfig(
      'Demo Exits',
      [new DoughnutSeriesConfig(23, 'exits')],
      ['time [s]']
    );
    component.entriesCount = 65;
    component.exitsCount = 72;
    component.exitEmployees = [];

    fixture.detectChanges();

    const kpiValues = fixture.debugElement
      .queryAll(By.css('h4'))
      .map((element) => element.nativeElement.textContent);
    const charts = fixture.debugElement.queryAll(By.css('ia-doughnut-chart'));

    expect(kpiValues.length).toEqual(2);
    expect(kpiValues).toContain(component.entriesCount.toString());
    expect(kpiValues).toContain(component.exitsCount.toString());
    expect(charts.length).toEqual(2);
  });

  describe('openTeamMemberDialogForExits', () => {
    test('should open dialog with leavers data', () => {
      component['dialog'].open = jest.fn();
      const employee = { name: 'jason' } as any;
      component.exitEmployees = [employee];

      component.openTeamMemberDialogForExits();
      expect(component['dialog'].open).toHaveBeenCalledWith(
        TeamMemberDialogComponent,
        { data: { directLeafChildren: [employee] } }
      );
    });
  });
  describe('openTeamMemberDialogForEntries', () => {
    test('should open dialog with leavers data', () => {
      component['dialog'].open = jest.fn();
      const employee = { name: 'jason' } as any;
      component.entryEmployees = [employee];

      component.openTeamMemberDialogForEntries();
      expect(component['dialog'].open).toHaveBeenCalledWith(
        TeamMemberDialogComponent,
        { data: { directLeafChildren: [employee] } }
      );
    });
  });
});
