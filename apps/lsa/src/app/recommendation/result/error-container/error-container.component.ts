import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { map, Observable, of, ReplaySubject, switchMap } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';
import { ErrorResponse } from '@lsa/shared/models';
import { LetDirective } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { ErrorMessage } from './error-message.model';

export const BASE_TRANSLATION_PATH = 'recommendation.result';

@Component({
  selector: 'lsa-error-container',
  standalone: true,
  templateUrl: './error-container.component.html',
  imports: [SharedTranslocoModule, CommonModule, LetDirective],
})
export class ErrorContainerComponent implements OnChanges {
  @Input() response: ErrorResponse;

  private readonly responseSubject = new ReplaySubject<Error>();

  private readonly defaultError = this.transloco.langChanges$.pipe(
    map(
      () =>
        ({
          title: this.transloco.translate(
            `${BASE_TRANSLATION_PATH}.error.heading`
          ),
          body: this.transloco.translate(`${BASE_TRANSLATION_PATH}.error.body`),
          cta: undefined,
        }) as ErrorMessage
    )
  );

  // eslint-disable-next-line @typescript-eslint/member-ordering
  public readonly errorMessage: Observable<ErrorMessage> =
    this.responseSubject.pipe(
      map((errResponse) => {
        const basePath = `${BASE_TRANSLATION_PATH}.errors.${errResponse.name}`;

        return {
          title: this.transloco.translate(`${basePath}.title`),
          body: this.transloco.translate(`${basePath}.body`),
          cta: this.transloco.translate(`${basePath}.cta`),
        } as ErrorMessage;
      }),
      switchMap((message) =>
        message.body.startsWith(BASE_TRANSLATION_PATH)
          ? this.defaultError
          : of({
              ...message,
              cta: message.cta.startsWith(BASE_TRANSLATION_PATH)
                ? undefined
                : message.cta,
            })
      )
    );

  constructor(private readonly transloco: TranslocoService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('response' in changes) {
      this.responseSubject.next(changes.response.currentValue);
    }
  }
}
