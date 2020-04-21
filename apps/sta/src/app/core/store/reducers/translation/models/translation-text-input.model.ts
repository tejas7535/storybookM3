import { Language } from '../../../../../shared/result/models/language.enum';

export interface TranslationTextInput {
  text: string;
  targetLang?: Language;
  textLang?: Language;
}
