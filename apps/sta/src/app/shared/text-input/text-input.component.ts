import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'sta-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss']
})
export class TextInputComponent implements OnInit {
  public textFormControl: FormControl;
  @Input() public minLength = 40;
  @Input() public btnText = 'Generate';
  @Input() public defaultText = '';

  @Output() public readonly btnClicked = new EventEmitter<string>();

  public ngOnInit(): void {
    this.textFormControl = new FormControl(this.defaultText, [
      Validators.required,
      Validators.minLength(this.minLength)
    ]);
  }

  public getTags(): void {
    this.btnClicked.emit(this.textFormControl.value);
  }
}
