import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

import { ProductImageComponent } from '@mm/shared/components/product-image/product-image.component';

import { MediasViewProductButtonComponent } from '../medias-view-product-button/medias-view-product-button.component';

@Component({
  selector: 'mm-product-card',
  templateUrl: './product-card.component.html',
  imports: [
    MatCardModule,
    MatDividerModule,
    NgClass,
    MediasViewProductButtonComponent,
    ProductImageComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent {
  @Input() productTitle: string;
  @Input() productValue: string;
  @Input() imagePath: string;
  @Input() cardClass = '';
  @Input() productSectionClass = '';
}
