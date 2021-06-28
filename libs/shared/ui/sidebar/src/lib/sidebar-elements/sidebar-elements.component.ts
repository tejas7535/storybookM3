import { Component, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { SidebarElement, SidebarMode } from '../models';
import { getSidebarMode } from '../store/selectors/sidebar.selectors';

@Component({
  selector: 'schaeffler-sidebar-elements',
  templateUrl: './sidebar-elements.component.html',
  styleUrls: ['./sidebar-elements.component.scss'],
})
export class SidebarElementsComponent implements OnInit {
  @Input() public elements: SidebarElement[];

  public mode$: Observable<SidebarMode>;

  public constructor(private readonly store: Store) {}

  public ngOnInit(): void {
    this.mode$ = this.store.select(getSidebarMode);
  }

  public trackByFn(index: number, _item: any): number {
    return index;
  }
}
