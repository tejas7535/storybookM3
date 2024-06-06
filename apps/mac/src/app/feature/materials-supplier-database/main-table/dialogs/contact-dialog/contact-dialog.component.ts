import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { ContactData, contacts } from './contact-data';

@Component({
  selector: 'mac-contact-dialog',
  templateUrl: './contact-dialog.component.html',
  standalone: true,
  imports: [
    // default
    CommonModule,
    // angular material
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    // libs
    SharedTranslocoModule,
  ],
})
export class ContactDialogComponent {
  constructor(readonly dialogRef: MatDialogRef<ContactDialogComponent>) {}

  getContacts(): ContactData[] {
    return contacts;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
