import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { getAllRoles } from '../../../../core/store';
import { RoleGroup } from '../../../models/role-group.model';

@Component({
  selector: 'gq-roles-rights',
  templateUrl: './roles-rights.component.html',
})
export class RolesRightsComponent implements OnInit {
  public allRoles$: Observable<RoleGroup[]>;

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.allRoles$ = this.store.pipe(getAllRoles);
  }

  public trackByFn(index: number): number {
    return index;
  }
}
