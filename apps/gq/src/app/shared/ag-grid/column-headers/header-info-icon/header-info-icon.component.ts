import { Component } from '@angular/core';

import { IHeaderParams } from 'ag-grid-community';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { InfoIconModule } from '../../../components/info-icon/info-icon.module';

@Component({
  standalone: true,
  imports: [InfoIconModule, SharedTranslocoModule],
  selector: 'gq-header-info-icon',
  templateUrl: './header-info-icon.component.html',
})
export class HeaderInfoIconComponent {
  params: IHeaderParams;

  agInit(params: IHeaderParams): void {
    this.params = params;
  }
}
