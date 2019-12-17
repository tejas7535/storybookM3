import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { DataService } from '../../../shared/result/data.service';
import { AUTO_TAGGING_DEMO } from '../constants/auto-tagging-demo.constant';

@Component({
  selector: 'sta-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss']
})
export class TextInputComponent implements OnInit {
  public textFormControl: FormControl;
  public minLength = 40;

  constructor(private readonly dataService: DataService) {}

  public ngOnInit(): void {
    this.textFormControl = new FormControl(AUTO_TAGGING_DEMO, [
      Validators.required,
      Validators.minLength(this.minLength)
    ]);
  }

  public getTags(): void {
    this.dataService.postTaggingText(this.textFormControl.value);
  }
}
