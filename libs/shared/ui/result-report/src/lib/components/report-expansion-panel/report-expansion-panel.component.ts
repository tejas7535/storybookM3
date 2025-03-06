import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';

import { InfoButtonComponent } from '../info-button/info-button.component';

@Component({
  selector: 'schaeffler-report-expansion-panel',
  imports: [
    CommonModule,
    MatIconModule,
    MatExpansionModule,
    InfoButtonComponent,
  ],
  templateUrl: './report-expansion-panel.component.html',
})
export class ReportExpansionPanelComponent {
  @Input() public id: string | undefined;
  @Input() public expanded: boolean | undefined;
  @Input() public title: string | undefined;
  @Input() public titleTooltip?: string;
  @Input() public icon?: string;
  @Input() public iconClassName?: string;
  @Input()
  public svgIcon!: string;
}
