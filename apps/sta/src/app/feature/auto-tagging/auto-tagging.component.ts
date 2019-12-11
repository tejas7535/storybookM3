import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { DataService } from '../../shared/result/data.service';

import { AUTO_TAGGING_DEMO } from './constants/auto-tagging-demo.constant';

@Component({
  selector: 'sta-auto-tagging',
  templateUrl: './auto-tagging.component.html',
  styleUrls: ['./auto-tagging.component.scss']
})
export class AutoTaggingComponent implements OnInit {
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
