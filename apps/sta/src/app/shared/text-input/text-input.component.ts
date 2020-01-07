import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { AUTO_TAGGING_DEMO } from '../../feature/auto-tagging/constants/auto-tagging-demo.constant';

@Component({
  selector: 'sta-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss']
})
export class TextInputComponent implements OnInit {
  public textFormControl: FormControl;
  @Input() public minLength = 40;
  @Input() public btnText = 'Generate';

  @Output() public readonly btnClicked = new EventEmitter<string>();

  public ngOnInit(): void {
    this.textFormControl = new FormControl(AUTO_TAGGING_DEMO, [
      Validators.required,
      Validators.minLength(this.minLength)
    ]);
  }

  public getTags(): void {
    this.btnClicked.emit(this.textFormControl.value);
  }
}
