import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';

import { Observable, Subject, takeUntil } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';
import { environment } from '@lsa/environments/environment';
import { Store } from '@ngrx/store';

import { openBanner } from '@schaeffler/banner';

export interface MaintenanceMessage {
  type: 'info' | 'warning' | 'error' | 'success';
  text: {
    [key: string]: string;
  };
  buttonText: {
    [key: string]: string;
  };
  validFrom: string;
  validTo: string;
}

@Injectable({
  providedIn: 'root',
})
export class StaticStorageService implements OnDestroy {
  storageUrl = environment.staticStorageUrl;
  fileName = 'lsa-app-maintenance-message.json';

  private readonly destroy$ = new Subject<void>();

  public constructor(
    private readonly httpClient: HttpClient,
    private readonly store: Store,
    private readonly translocoService: TranslocoService
  ) {}

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public displayMaintenanceMessages(): void {
    this.getMessage()
      .pipe(takeUntil(this.destroy$))
      .subscribe((message) => {
        this.dispatchMessage(message);
      });
  }

  private getMessage(): Observable<MaintenanceMessage> {
    return this.httpClient.get<MaintenanceMessage>(
      `${this.storageUrl}/${this.fileName}`
    );
  }

  private dispatchMessage(message: MaintenanceMessage): void {
    let currentLanguage = this.translocoService.getActiveLang();

    this.translocoService.langChanges$
      .pipe(takeUntil(this.destroy$))
      .subscribe((language) => {
        if (language !== currentLanguage) {
          currentLanguage = language;
          this.dispatch(message);
        }
      });

    this.dispatch(message);
  }

  private dispatch(message: MaintenanceMessage): void {
    if (this.shouldDispatchMessage(message)) {
      const text = this.getLocalisedMessageValue(message);
      const buttonText = this.getLocalisedButtonText(message);

      this.store.dispatch(
        openBanner({
          text,
          buttonText,
          icon: message.type,
          truncateSize: 0,
        })
      );
    }
  }

  private shouldDispatchMessage(message: MaintenanceMessage): boolean {
    const currentDate = new Date(Date.now());

    const validFromDate = this.parseDate(message.validFrom);
    const validToDate = this.parseDate(message.validTo);

    return currentDate >= validFromDate && currentDate <= validToDate;
  }

  private parseDate(dateString: string): Date {
    const [datePart, timePart] = dateString.split(' ');
    const [day, month, year] = datePart.split('/').map(Number);
    const [hours, minutes, seconds] = timePart.split(':').map(Number);

    return new Date(year, month - 1, day, hours, minutes, seconds);
  }

  private getLocalisedMessageValue(message: MaintenanceMessage): string {
    const languageCode = this.translocoService.getActiveLang();
    const localizedMessage = message.text[languageCode] ?? message.text?.en;

    return localizedMessage;
  }

  private getLocalisedButtonText(message: MaintenanceMessage): string {
    const languageCode = this.translocoService.getActiveLang();
    const localizedMessage =
      message.buttonText[languageCode] ?? message.buttonText?.en;

    return localizedMessage;
  }
}
