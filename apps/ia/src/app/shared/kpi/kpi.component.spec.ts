import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { TeamMemberDialogComponent } from '../../organizational-view/org-chart/team-member-dialog/team-member-dialog.component';
import { TeamMemberDialogModule } from '../../organizational-view/org-chart/team-member-dialog/team-member-dialog.module';
import { SharedModule } from '../shared.module';
import { KpiComponent } from './kpi.component';

describe('KpiComponent', () => {
  let component: KpiComponent;
  let spectator: Spectator<KpiComponent>;

  const createComponent = createComponentFactory({
    component: KpiComponent,
    detectChanges: false,
    providers: [],
    imports: [
      SharedModule,
      MatIconModule,
      MatTooltipModule,
      TeamMemberDialogModule,
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  describe('openTeamMemberDialog', () => {
    test('should open dialog with employees', () => {
      component['dialog'].open = jest.fn();
      const employee = { name: 'jason' } as any;
      component.employees = [employee];

      component.openTeamMemberDialog();
      expect(component['dialog'].open).toHaveBeenCalledWith(
        TeamMemberDialogComponent,
        { data: { directLeafChildren: [employee] } }
      );
    });
  });
});
