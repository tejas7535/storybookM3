import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { IHeaderParams } from 'ag-grid-community';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { InfoIconModule } from '../../../components/info-icon/info-icon.module';

export type HeaderInfoIconComponentParams = IHeaderParams & {
  tooltipText: string;
};

@Component({
  standalone: true,
  imports: [InfoIconModule, SharedTranslocoModule, CommonModule],
  selector: 'gq-header-info-icon',
  templateUrl: './header-info-icon.component.html',
})
export class HeaderInfoIconComponent {
  params: HeaderInfoIconComponentParams;

  agInit(params: HeaderInfoIconComponentParams): void {
    this.params = params;
  }
}
