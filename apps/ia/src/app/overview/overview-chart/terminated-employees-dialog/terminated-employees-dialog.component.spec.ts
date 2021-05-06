import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoTestingModule } from '@ngneat/transloco';

import { IconsModule } from '@schaeffler/icons';

import { SharedModule } from '../../../shared/shared.module';
import { TerminatedEmployeesDialogComponent } from './terminated-employees-dialog.component';

describe('TerminatedEmployeesDialogComponent', () => {
  let component: TerminatedEmployeesDialogComponent;
  let spectator: Spectator<TerminatedEmployeesDialogComponent>;

  const createComponent = createComponentFactory({
    component: TerminatedEmployeesDialogComponent,
    detectChanges: false,
    imports: [
      SharedModule,
      MatDialogModule,
      MatButtonModule,
      MatDividerModule,
      MatListModule,
      IconsModule,
      MatIconModule,
      TranslocoTestingModule,
    ],
    providers: [
      {
        provide: MAT_DIALOG_DATA,
        useValue: {
          data: {
            title: 'Foo Bar',
            employees: [],
          },
        },
      },
    ],
    declarations: [TerminatedEmployeesDialogComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('trackByFn', () => {
    it('should return index', () => {
      const result = component.trackByFn(3);

      expect(result).toEqual(3);
    });
  });
});
