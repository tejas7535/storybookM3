import { AgGridModule } from '@ag-grid-community/angular';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { translate } from '@ngneat/transloco';

import { UnderConstructionModule } from '@schaeffler/empty-states';

import { EmployeeListDialogComponent } from '../../shared/employee-list-dialog/employee-list-dialog.component';
import { EmployeeListDialogModule } from '../../shared/employee-list-dialog/employee-list-dialog.module';
import { LostJobProfilesComponent } from './lost-job-profiles.component';

describe('LostJobProfilesComponent', () => {
  let component: LostJobProfilesComponent;
  let spectator: Spectator<LostJobProfilesComponent>;

  const createComponent = createComponentFactory({
    component: LostJobProfilesComponent,
    detectChanges: false,
    imports: [
      UnderConstructionModule,
      EmployeeListDialogModule,
      AgGridModule.withComponents([EmployeeListDialogComponent]),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('handleCellClick', () => {
    const params: any = {
      value: 5,
      data: {
        employees: ['Foo', 'Bar'],
        leavers: ['Donald'],
      },
    };

    beforeEach(() => {
      component['openEmployeeListDialog'] = jest.fn();
    });
    it('should collect correct data for cellType workforce', () => {
      component['handleCellClick'](params, 'workforce');

      expect(translate).toHaveBeenCalled();
      expect(component['openEmployeeListDialog']).toHaveBeenCalledWith(
        'translate it',
        5,
        ['Foo', 'Bar']
      );
    });

    it('should collect correct data for celltype leavers', () => {
      component['handleCellClick'](params, 'leavers');

      expect(translate).toHaveBeenCalled();
      expect(component['openEmployeeListDialog']).toHaveBeenCalledWith(
        'translate it',
        5,
        ['Donald']
      );
    });
  });

  describe('openEmployeeListDialog', () => {
    it('should open the dialog with correct params', () => {
      const title = 'FOO';
      const total = 5;
      const employees = ['Donald'];

      component['dialog'].open = jest.fn();

      component['openEmployeeListDialog'](title, total, employees);

      expect(component['dialog'].open).toHaveBeenCalledWith(
        EmployeeListDialogComponent,
        {
          data: { title, total, employees },
          width: '700px',
          height: '400px',
        }
      );
    });
  });
});
