import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { IconsModule } from '@schaeffler/icons';
import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { TeamMemberDialogComponent } from './team-member-dialog.component';

describe('TeamMemberDialogComponent', () => {
  let component: TeamMemberDialogComponent;
  let spectator: Spectator<TeamMemberDialogComponent>;

  const createComponent = createComponentFactory({
    component: TeamMemberDialogComponent,
    declarations: [TeamMemberDialogComponent],
    imports: [
      MatDialogModule,
      MatButtonModule,
      IconsModule,
      MatIconModule,
      MatDividerModule,
      MatListModule,
      provideTranslocoTestingModule({}),
    ],
    providers: [
      {
        provide: MAT_DIALOG_DATA,
        useValue: {},
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
