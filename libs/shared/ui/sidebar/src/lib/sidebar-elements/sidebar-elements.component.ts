import { Component, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { SidebarElement, SidebarMode } from '../models';
import { getSidebarMode, SidebarState } from '../store';

@Component({
  selector: 'schaeffler-sidebar-elements',
  templateUrl: './sidebar-elements.component.html',
  styleUrls: ['./sidebar-elements.component.scss'],
})
export class SidebarElementsComponent implements OnInit {
  @Input() elements: SidebarElement[];

  mode$: Observable<SidebarMode>;

  constructor(private readonly store: Store<SidebarState>) {}

  public ngOnInit(): void {
    this.mode$ = this.store.pipe(select(getSidebarMode));
  }

  public trackByFn(index: number, _item: any): number {
    return index;
  }
}
