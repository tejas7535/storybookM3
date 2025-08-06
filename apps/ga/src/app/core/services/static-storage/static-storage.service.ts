import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';

import { Observable, Subject, takeUntil } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';
import { Store } from '@ngrx/store';

import { openBanner } from '@schaeffler/banner';

import { environment } from '@ga/environments/environment';
import { MaintenanceMessage } from '@ga/shared/models/maintenance-message/maintenance-message';

@Injectable({
  providedIn: 'root',
})
export class StaticStorageService implements OnDestroy {
  storageUrl = environment.staticStorageUrl;
  fileName = 'grease-app-maintenance-message.json';

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

  public getMessage(): Observable<MaintenanceMessage> {
    return this.httpClient.get<MaintenanceMessage>(
      `${this.storageUrl}/${this.fileName}`
    );
  }

  public dispatchMessage(message: MaintenanceMessage): void {
    this.translocoService.langChanges$.subscribe();

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
      this.store.dispatch(
        openBanner({
          text: this.getLocalisedMessageValue(message),
          buttonText: this.getLocalisedButtonText(message),
          icon: message.type,
          truncateSize: 0,
        })
      );
    }
  }

  private shouldDispatchMessage(message: MaintenanceMessage): boolean {
    const currentDate = new Date(Date.now());

    try {
      return (
        currentDate >= this.getDate(message.validFrom) &&
        currentDate <= this.getDate(message.validTo)
      );
    } catch (e) {
      console.warn(
        `Error encountered while processing the validity dates. Choosing not to display any maintenance mssage: ${e}`
      );
      return false;
    }
  }

  private getDate(dateString: string): Date {
    const date = new Date(dateString);
    if (isNaN(date as any)) {
      throw new Error(`Invalid Date received: ${date}`);
    }
    return date;
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
