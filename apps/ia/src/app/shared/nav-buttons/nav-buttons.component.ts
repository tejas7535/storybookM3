import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from '../shared.module';
import { NavItem } from './models';

@Component({
  selector: 'ia-nav-buttons',
  standalone: true,
  imports: [
    SharedModule,
    SharedTranslocoModule,
    MatTabsModule,
    MatTooltipModule,
  ],
  templateUrl: './nav-buttons.component.html',
  styleUrl: './nav-buttons.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavButtonsComponent {
  selectedIndex = 0;
  @Input() items: NavItem[];
  @Output() selectedTabChange = new EventEmitter<string>();

  onSelectedIndexChange(index: number) {
    this.selectedIndex = index;
    this.selectedTabChange.emit(this.items[index].label);
  }
}
