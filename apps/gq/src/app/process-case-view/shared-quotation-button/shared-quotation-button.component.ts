import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { LetDirective, PushPipe } from '@ngrx/component';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedQuotationFacade } from '../../../app/core/store/shared-quotation';

@Component({
  selector: 'gq-shared-quotation-button',
  imports: [
    MatButtonModule,
    MatIconModule,
    SharedTranslocoModule,
    PushPipe,
    LoadingSpinnerModule,
    LetDirective,
  ],
  templateUrl: './shared-quotation-button.component.html',
  styleUrls: ['./shared-quotation-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedQuotationButtonComponent implements OnInit {
  @Input() quotationId: number;

  private readonly facade = inject(SharedQuotationFacade);

  readonly sharedQuotation$ = this.facade.sharedQuotation$;
  readonly sharedQuotationLoading$ = this.facade.sharedQuotationLoading$;

  ngOnInit(): void {
    this.facade.getSharedQuotation(this.quotationId);
  }

  onSave() {
    this.facade.saveSharedQuotation(this.quotationId);
  }

  onDelete(sharedQuotationId: string) {
    this.facade.deleteSharedQuotation(sharedQuotationId);
  }
}
