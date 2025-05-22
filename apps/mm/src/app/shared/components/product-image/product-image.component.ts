/* eslint-disable @typescript-eslint/member-ordering */
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

import { map, ReplaySubject, switchMap, tap } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';
import { ProductImageResolverService } from '@mm/shared/services/product-image-resolver.service';

@Component({
  selector: 'mm-product-image',
  templateUrl: './product-image.component.html',
  imports: [MatProgressSpinner],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductImageComponent implements OnChanges {
  private readonly imageResolver = inject(ProductImageResolverService);
  private readonly translocoService = inject(TranslocoService);

  @Input() designation: string;
  @Input() width?: number;
  @Input() height?: number;

  @Input() loaderSize = 24;

  protected isLoading = true;

  protected imageDesignation = new ReplaySubject<string>(1);

  protected imageUrl = toSignal(
    this.imageDesignation.pipe(
      switchMap((selectedDesignation) =>
        this.imageResolver.resolveImageDesignation(selectedDesignation)
      ),
      tap(() => (this.isLoading = false))
    )
  );

  protected imageAlt = toSignal(
    this.imageDesignation.pipe(
      map((designation) =>
        this.translocoService.translate('productImage.altText', { designation })
      )
    )
  );

  ngOnChanges(changes: SimpleChanges): void {
    if ('designation' in changes) {
      this.imageDesignation.next(changes['designation'].currentValue);
    }
  }
}
