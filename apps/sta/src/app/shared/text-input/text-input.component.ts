import { EMPTY, Observable, Subscription } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  mergeMap,
  startWith,
  take,
  tap
} from 'rxjs/operators';

import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {
  Component,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

import { TranslocoService } from '@ngneat/transloco';

import { DataService } from '../result/services/data.service';

import { AVAILABLE_LANGUAGES } from '../../constants/available-languages.constant';

import {
  KeyValue,
  Language,
  LanguageDetectionResponse,
  TextInput
} from '../result/models';

@Component({
  selector: 'sta-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss']
})
export class TextInputComponent implements OnDestroy, OnInit {
  @Input() public minLength = 40;
  @Input() public btnText = 'Generate';
  @Input() public defaultText = '';
  @Input() public textHint = '';
  @Input() public showTargetLanguage = true;
  @Input() public disabledLanguages: string[] = [];

  @Output() public readonly btnClicked = new EventEmitter<TextInput>();

  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  public MIN_LENGTH_LANG_DETECTION = 2;
  public DEBOUNCE_TIME = 1000;

  public textFormGroup: FormGroup;
  public supportedLanguages: KeyValue[] = [];
  public avlLanguages: KeyValue[] = [];

  public disableSubmit = true;
  public apiErrorMessage = '';

  private readonly subscription: Subscription = new Subscription();

  private static identifyAvailableLanguages(userLang: string): KeyValue[] {
    let langs: KeyValue[] = [];

    AVAILABLE_LANGUAGES.forEach(langEntry => {
      if (langEntry['userLang'] === userLang) {
        langs = langEntry['languages'];
      }
    });

    return langs;
  }

  public constructor(
    private readonly fb: FormBuilder,
    private readonly dataService: DataService,
    private readonly languageService: TranslocoService,
    private readonly _ngZone: NgZone
  ) {}

  public ngOnInit(): void {
    const userLang = this.languageService.getActiveLang();
    this.initForm();

    this.avlLanguages = TextInputComponent.identifyAvailableLanguages(userLang);

    this.subscription.add(
      this.detectedLanguage.valueChanges.subscribe(val =>
        this.handleLanguageDetectionChange(val)
      )
    );

    this.subscription.add(
      this.text.valueChanges
        .pipe(this.validateTextInput(userLang))
        .subscribe(languageDetectionResponse => {
          this.triggerResize();
          this.handleTextInput(languageDetectionResponse);
        })
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public get text(): AbstractControl {
    return this.textFormGroup.get('text');
  }

  public get detectedLanguage(): AbstractControl {
    return this.textFormGroup.get('detectedLanguage');
  }

  public get targetLanguage(): AbstractControl {
    return this.textFormGroup.get('targetLanguage');
  }

  public triggerResize(): void {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable
      .pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  public btnClick(): void {
    this.btnClicked.emit(
      new TextInput(
        this.textFormGroup.get('text').value,
        this.textFormGroup.get('targetLanguage').value,
        this.textFormGroup.get('detectedLanguage').value
      )
    );
  }

  private initForm(): void {
    this.textFormGroup = this.fb.group({
      text: new FormControl(this.defaultText, [
        Validators.required,
        Validators.minLength(this.minLength)
      ]),
      detectedLanguage: new FormControl('', [Validators.required]),
      targetLanguage: new FormControl(
        '',
        this.showTargetLanguage ? [Validators.required] : []
      )
    });
  }

  private validateTextInput(
    userLang: string
  ): (source: Observable<string>) => Observable<LanguageDetectionResponse> {
    return (source: Observable<string>) => {
      return source.pipe(
        tap(() => (this.disableSubmit = true)),
        debounceTime(this.DEBOUNCE_TIME),
        distinctUntilChanged(),
        startWith(this.defaultText),
        filter(
          text =>
            text.length >= this.MIN_LENGTH_LANG_DETECTION &&
            text.length >= this.minLength
        ),
        mergeMap(text =>
          this.dataService
            .postLanguageDetectionText(text, userLang as Language)
            .pipe(catchError(e => this.handlePostLanguageDetectionTextError(e)))
        ),
        tap(languageDetectionResponse => {
          if (!languageDetectionResponse.supported) {
            this.setTextInputError({ invalidLang: true }, true);
          }

          this.disableSubmit = false;
        })
      );
    };
  }

  private handlePostLanguageDetectionTextError(
    error: string
  ): Observable<never> {
    // show error from REST call
    this.apiErrorMessage = error;
    this.setTextInputError({ apiError: true }, true);

    // reset detected language
    this.detectedLanguage.reset();

    // reset supported languages
    this.setSupportedLanguages();

    return EMPTY;
  }

  private handleTextInput(
    languageDetectionResponse: LanguageDetectionResponse
  ): void {
    // set detected language
    this.detectedLanguage.setValue(languageDetectionResponse.textLang);

    // set supported languages
    this.setSupportedLanguages(languageDetectionResponse);
  }

  private setTextInputError(error: any, markAsTouched: boolean = false): void {
    this.text.setErrors(error);

    if (markAsTouched) {
      this.text.markAsTouched();
    }
  }

  private handleLanguageDetectionChange(val: string): void {
    if (!val) {
      return;
    }

    const oldValue = this.textFormGroup.value['detectedLanguage'];

    let newValIsAvl = false;

    this.avlLanguages.forEach(lang => {
      if (lang.key !== val && this.disabledLanguages.indexOf(lang.key) === -1) {
        this.targetLanguage.setValue(lang.key);
      } else if (lang.key === val) {
        // new selected language is available
        newValIsAvl = true;
      }
    });

    // if user manually selects a detected language (again) that is not supported
    const avlLanguagesKeys = this.avlLanguages.map(entry => entry.key);
    if (avlLanguagesKeys.indexOf(val) === -1) {
      this.setTextInputError({ invalidLang: true });
    }

    // if user manually selects an available language as detected language
    if (newValIsAvl && this.text.errors && this.text.errors.invalidLang) {
      this.setTextInputError(undefined);
    }

    // if user manually selects an available language after the language could not be detected
    if (
      !oldValue &&
      newValIsAvl &&
      this.text.errors &&
      this.text.errors.apiError
    ) {
      this.setTextInputError(undefined);
      this.disableSubmit = false;
    }
  }

  private setSupportedLanguages(
    languageDetectionResponse?: LanguageDetectionResponse
  ): void {
    let langs: KeyValue[] = [];
    if (
      languageDetectionResponse &&
      !languageDetectionResponse.supported &&
      languageDetectionResponse.textLang
    ) {
      const lang = new KeyValue(
        languageDetectionResponse.textLang,
        languageDetectionResponse.displayName
      );
      langs.push(lang);
    }

    langs = [...langs, ...this.avlLanguages];

    this.supportedLanguages = langs;
  }
}
