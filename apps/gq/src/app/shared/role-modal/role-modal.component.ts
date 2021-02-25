import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { AppState, getAllRoles } from '../../core/store';
import { RoleGroup } from '../../core/store/models';
import { infoMessage } from '../constants';

@Component({
  selector: 'gq-role-modal',
  templateUrl: './role-modal.component.html',
  styleUrls: ['./role-modal.component.scss'],
})
export class RoleModalComponent implements OnInit {
  public allRoles$: Observable<RoleGroup[]>;
  public contactInfo = infoMessage;

  constructor(
    private readonly dialogRef: MatDialogRef<RoleModalComponent>,
    private readonly store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.allRoles$ = this.store.pipe(select(getAllRoles));
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  public trackByFn(index: number): number {
    return index;
  }
}
