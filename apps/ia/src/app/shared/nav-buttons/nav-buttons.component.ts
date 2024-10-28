import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../shared.module';
import { NavItem } from './models';

@Component({
  selector: 'ia-nav-buttons',
  standalone: true,
  imports: [
    SharedModule,
    SharedTranslocoModule,
    MatIconModule,
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
