import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'gq-detail-view-navigation-bar',
  templateUrl: './detail-view-navigation-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailViewNavigationBarComponent implements OnInit {
  @Input() numberOfCases: number;
  @Input() selectedCaseIndex: number;

  @Output() navigateToCase: EventEmitter<number> = new EventEmitter<number>();

  customIndexFormControl: FormControl;

  ngOnInit(): void {
    this.customIndexFormControl = new FormControl('', [
      Validators.min(1),
      Validators.max(this.numberOfCases),
    ]);
  }

  onFirstCaseClicked() {
    this.navigateToCase.emit(0);
  }

  onLastCaseClicked() {
    this.navigateToCase.emit(this.numberOfCases - 1);
  }

  onNextCaseClicked() {
    this.navigateToCase.emit(this.selectedCaseIndex + 1);
  }

  onPrevCaseClicked() {
    this.navigateToCase.emit(this.selectedCaseIndex - 1);
  }

  onCustomIndexEntered() {
    const index = Number.parseInt(this.customIndexFormControl.value, 10);
    if (!this.customIndexFormControl.valid || Number.isNaN(index)) {
      this.customIndexFormControl.setValue('');

      return;
    }

    this.navigateToCase.emit(index - 1);
    this.customIndexFormControl.setValue('');
  }
}
