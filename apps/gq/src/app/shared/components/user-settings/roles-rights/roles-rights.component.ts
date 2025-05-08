import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { getAllSalesRoles } from '@gq/core/store/selectors';
import { Store } from '@ngrx/store';

import { RoleGroup } from '../../../models/role-group.model';

@Component({
  selector: 'gq-roles-rights',
  templateUrl: './roles-rights.component.html',
  standalone: false,
})
export class RolesRightsComponent implements OnInit {
  public allSalesRoles$: Observable<RoleGroup[]>;

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.allSalesRoles$ = this.store.pipe(getAllSalesRoles);
  }
}
