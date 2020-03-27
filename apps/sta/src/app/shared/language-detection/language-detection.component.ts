import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Icon } from '@schaeffler/shared/icons';

import { KeyValue } from '../result/models';

@Component({
  selector: 'sta-language-detection',
  templateUrl: './language-detection.component.html',
  styleUrls: ['./language-detection.component.scss']
})
export class LanguageDetectionComponent {
  @Input() public supportedSourceLanguages: KeyValue[];
  @Input() public supportedTargetLanguages: KeyValue[];
  @Input() public disabledLanguages: string[] = [];
  @Input() public showTargetLanguage = true;

  @Input() public parentForm: FormGroup;

  public detectLanguageIcon = new Icon('language', true);
  public syncIcon = new Icon('sync_alt', true);
  public flagIcon = new Icon('flag', true);
}
