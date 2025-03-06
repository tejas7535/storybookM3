import {
  Component,
  ElementRef,
  Inject,
  signal,
  ViewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { tap } from 'rxjs';

import { StaticHTMLService } from '@ea/core/services/static-html.service';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'ea-calculation-disclaimer',
  imports: [MatDialogModule, SharedTranslocoModule, MatIconModule],
  templateUrl: './calculation-disclaimer.component.html',
})
export class CalculationDisclaimerComponent {
  @ViewChild('disclaimerContentContainer')
  disclaimerContentContainer: ElementRef;
  readonly disclaimerSectionId = 'downstreamSection';
  private readonly isDownstream = signal(false);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  public disclaimerContent = toSignal(
    this.staticHTMLService
      .getHtmlContentByTranslationKey(
        'calculationResultReport.calculationDisclaimer.disclaimerFile'
      )
      .pipe(
        tap(() => {
          // Perform the scroll action after the content is loaded
          if (this.isDownstream()) {
            setTimeout(() => {
              this.scrollToDownstreamSection();
            }, 0);
          }
        })
      )
  );

  constructor(
    private readonly dialogRef: MatDialogRef<CalculationDisclaimerComponent>,
    private readonly staticHTMLService: StaticHTMLService,
    @Inject(MAT_DIALOG_DATA)
    public readonly data: { isDownstreamDisclaimer: boolean }
  ) {
    if (data?.isDownstreamDisclaimer !== undefined) {
      this.isDownstream.set(data.isDownstreamDisclaimer);
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  scrollToDownstreamSection(): void {
    const element =
      this.disclaimerContentContainer.nativeElement.querySelector(
        '#downstreamSection'
      );
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
