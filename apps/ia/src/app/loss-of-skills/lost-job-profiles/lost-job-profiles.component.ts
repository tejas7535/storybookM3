import { Component, Input } from '@angular/core';

import {
  ClientSideRowModelModule,
  ColDef,
} from '@ag-grid-community/all-modules';
import { translate } from '@ngneat/transloco';

import { LostJobProfile } from '../../shared/models';

@Component({
  selector: 'ia-lost-job-profiles',
  templateUrl: './lost-job-profiles.component.html',
  styleUrls: ['./lost-job-profiles.component.scss'],
})
export class LostJobProfilesComponent {
  @Input() loading: boolean;
  @Input() data: LostJobProfile[];
  @Input() errorMessage: string;

  public modules: any[] = [ClientSideRowModelModule];

  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    floatingFilter: true,
    resizable: true,
    suppressMenu: true,
  };

  public columnDefs: ColDef[] = [
    {
      field: 'job',
      headerName: translate('lossOfSkills.lostJobProfiles.table.job'),
      flex: 2,
    },
    {
      field: 'workforce',
      headerName: translate('lossOfSkills.lostJobProfiles.table.workforce'),
      filter: 'agNumberColumnFilter',
      flex: 1,
    },
    {
      field: 'leavers',
      headerName: translate('lossOfSkills.lostJobProfiles.table.leavers'),
      filter: 'agNumberColumnFilter',
      sort: 'desc',
      flex: 1,
    },
  ];
}
