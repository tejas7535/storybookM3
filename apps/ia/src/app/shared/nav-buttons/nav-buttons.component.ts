import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
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
export class NavButtonsComponent implements OnDestroy {
  selectedIndex: number;
  @Input() items: NavItem[];
  @Input() set selectedTab(selectedTab: string) {
    if (selectedTab) {
      this.selectedIndex = this.items.findIndex(
        (item) => item.label === selectedTab
      );
    }
  }
  @Output() selectedTabChange = new EventEmitter<string>();

  onSelectedIndexChange(index: number): void {
    this.selectedIndex = index;
    if (index > -1) {
      this.selectedTabChange.emit(this.items[index].label);
    }
  }

  ngOnDestroy(): void {
    this.selectedIndex = undefined;
  }
}
