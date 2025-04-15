import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

import { map, ReplaySubject, switchMap, tap } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';
import { ProductImageResolverService } from '@mm/shared/services/product-image-resolver.service';
import { PushPipe } from '@ngrx/component';

@Component({
  selector: 'mm-product-image',
  templateUrl: './product-image.component.html',
  imports: [MatProgressSpinner, PushPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductImageComponent implements OnChanges {
  @Input() designation: string;
  @Input() width?: number;
  @Input() height?: number;

  @Input() loaderSize = 24;

  protected isLoading = true;

  protected imageDesignation = new ReplaySubject<string>(1);

  protected imageUrl$ = this.imageDesignation.pipe(
    switchMap((selectedDesignation) =>
      this.imageResolver.resolveImageDesignation(selectedDesignation)
    ),
    tap(() => (this.isLoading = false)),
    tap(() => this.changeDetection.markForCheck())
  );

  protected imageAlt = this.imageDesignation.pipe(
    map((designation) =>
      this.translocoService.translate('productImage', { designation })
    )
  );

  constructor(
    private readonly imageResolver: ProductImageResolverService,
    private readonly translocoService: TranslocoService,
    private readonly changeDetection: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('designation' in changes) {
      this.imageDesignation.next(changes['designation'].currentValue);
    }
  }
}
