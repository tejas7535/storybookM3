import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import * as en from '../../../assets/i18n/en.json';
import { EmployeeListDialogComponent } from './employee-list-dialog.component';

describe('EmployeeListDialogComponent', () => {
  let component: EmployeeListDialogComponent;
  let spectator: Spectator<EmployeeListDialogComponent>;

  const createComponent = createComponentFactory({
    component: EmployeeListDialogComponent,
    imports: [
      FlexLayoutModule,
      MatButtonModule,
      MatDialogModule,

      provideTranslocoTestingModule({ en }),
    ],
    providers: [
      {
        provide: MAT_DIALOG_DATA,
        useValue: { data: { title: 'Foo', total: 12, employees: [] } },
      },
    ],
    declarations: [EmployeeListDialogComponent],
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
