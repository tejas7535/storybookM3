import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../shared.module';
import { NavItem } from './models';

@Component({
  selector: 'ia-nav-buttons',
  standalone: true,
  imports: [SharedModule, SharedTranslocoModule, MatTabsModule],
  templateUrl: './nav-buttons.component.html',
  styleUrl: './nav-buttons.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavButtonsComponent {
  @Input() items: NavItem[];
  @Output() selectedTabChange = new EventEmitter<string>();

  onSelectedIndexChange(index: number) {
    this.selectedTabChange.emit(this.items[index].label);
  }
}
