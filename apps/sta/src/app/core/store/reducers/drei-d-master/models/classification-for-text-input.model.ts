import { Language } from '../../../../../shared/result/models/language.enum';

export interface ClassificationTextInput {
  text: string;
  targetLang?: Language;
  textLang?: Language;
}
