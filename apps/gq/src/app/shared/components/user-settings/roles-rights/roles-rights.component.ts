import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { getAllRoles } from '@gq/core/store/selectors';
import { Store } from '@ngrx/store';

import { RoleGroup } from '../../../models/role-group.model';

@Component({
  selector: 'gq-roles-rights',
  templateUrl: './roles-rights.component.html',
  standalone: false,
})
export class RolesRightsComponent implements OnInit {
  public allRoles$: Observable<RoleGroup[]>;

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.allRoles$ = this.store.pipe(getAllRoles);
  }
}
