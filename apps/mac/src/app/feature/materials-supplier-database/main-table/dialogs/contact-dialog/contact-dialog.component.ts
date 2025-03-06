import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import {
  ContactData,
  contactSupplierDevelopment,
  contactSustainability,
} from './contact-data';

@Component({
  selector: 'mac-contact-dialog',
  templateUrl: './contact-dialog.component.html',
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
  constructor(
    private readonly applicationInsightsService: ApplicationInsightsService,
    readonly dialogRef: MatDialogRef<ContactDialogComponent>
  ) {
    this.applicationInsightsService.logEvent(
      '[MAC - MSD] contactDialogOpened',
      {}
    );
  }

  getContacts(): {
    contactSupplierDevelopment: ContactData[];
    contactSustainability: ContactData[];
  } {
    return { contactSupplierDevelopment, contactSustainability };
  }

  trackEmail() {
    this.applicationInsightsService.logEvent(
      '[MAC - MSD] contactDialogMailEvent',
      {}
    );
  }
  trackTeams() {
    this.applicationInsightsService.logEvent(
      '[MAC - MSD] contactDialogTeamsEvent',
      {}
    );
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
