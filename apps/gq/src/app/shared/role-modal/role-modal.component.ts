import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { getAllRoles } from '../../core/store';
import { RoleGroup } from './models/role-group.model';
import { serivceNowAdress } from '../constants';

@Component({
  selector: 'gq-role-modal',
  templateUrl: './role-modal.component.html',
  styleUrls: ['./role-modal.component.scss'],
})
export class RoleModalComponent implements OnInit {
  public allRoles$: Observable<RoleGroup[]>;
  public contactInfo: string;
  serivceNowAdress = serivceNowAdress;

  constructor(
    private readonly dialogRef: MatDialogRef<RoleModalComponent>,
    private readonly store: Store
  ) {}

  ngOnInit(): void {
    this.allRoles$ = this.store.select(getAllRoles);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  public trackByFn(index: number): number {
    return index;
  }
}
