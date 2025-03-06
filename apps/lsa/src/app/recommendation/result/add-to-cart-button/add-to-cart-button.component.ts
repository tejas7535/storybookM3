import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'lsa-add-to-cart-button',
  templateUrl: './add-to-cart-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, MatButtonModule, MatButtonModule],
})
export class AddToCartButtonComponent {
  @Input() label: string;
  @Input() snackbarMessage: string;

  @Output() addToCart = new EventEmitter<void>();

  public disabled = false;
  private readonly snackBar = inject(MatSnackBar);
  private readonly changeDetectionRef = inject(ChangeDetectorRef);
  private readonly timeout = 3000;

  onAddToCart(): void {
    this.disabled = true;
    this.addToCart.emit();
    this.showSnackBar();

    setTimeout(() => {
      this.disabled = false;
      this.changeDetectionRef.detectChanges();
    }, this.timeout);
  }

  private showSnackBar(): void {
    this.snackBar.open(this.snackbarMessage, '', {
      duration: this.timeout,
    });
  }
}
