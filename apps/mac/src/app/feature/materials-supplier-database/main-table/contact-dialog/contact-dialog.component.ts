import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { ContactData, contacts } from './contact-data';

@Component({
  selector: 'mac-contact-dialog',
  templateUrl: './contact-dialog.component.html',
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
