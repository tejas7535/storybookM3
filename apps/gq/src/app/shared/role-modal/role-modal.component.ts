import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import { translate } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import { getAllRoles } from '../../core/store';
import { mailAdress } from '../constants';
import { RoleGroup } from './models/role-group.model';

@Component({
  selector: 'gq-role-modal',
  templateUrl: './role-modal.component.html',
  styleUrls: ['./role-modal.component.scss'],
})
export class RoleModalComponent implements OnInit {
  public allRoles$: Observable<RoleGroup[]>;
  public contactInfo: string;

  constructor(
    private readonly dialogRef: MatDialogRef<RoleModalComponent>,
    private readonly store: Store
  ) {}

  ngOnInit(): void {
    this.allRoles$ = this.store.select(getAllRoles);
    const translationString: string = translate(
      'shared.roleModal.contactInformation'
    );
    this.contactInfo = translationString.replace('{mailAdress}', mailAdress);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  public trackByFn(index: number): number {
    return index;
  }
}
